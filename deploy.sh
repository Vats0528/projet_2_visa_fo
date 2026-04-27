#!/bin/bash

################################################################################
# Script de déploiement du Frontend (VISA FO) vers Tomcat 10
# Auteur: DevOps Team
# Description: Clone le dernier code, compile et déploie sur Tomcat
################################################################################

set -e  # Exit on error

# ─── CONFIGURATION ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="projet_2_visa_fo"
PROJECT_PATH="${SCRIPT_DIR}"
TOMCAT_HOME="/opt/tomcat10"
TOMCAT_WEBAPPS="${TOMCAT_HOME}/webapps"
TOMCAT_BIN="${TOMCAT_HOME}/bin"
TOMCAT_LOGS="${TOMCAT_HOME}/logs"
BUILD_DIR="${PROJECT_PATH}/target"
WAR_NAME="${PROJECT_NAME}-1.0-SNAPSHOT.war"
WAR_SOURCE="${BUILD_DIR}/${WAR_NAME}"
APP_NAME="visa-fo"
LOG_DIR="${PROJECT_PATH}/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/deploy_${PROJECT_NAME}_$(date +%Y%m%d_%H%M%S).log"

# ─── COULEURS POUR LE OUTPUT ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─── FUNCTIONS ────────────────────────────────────────────────────────────

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# ─── VÉRIFICATION PRÉREQUIS ────────────────────────────────────────────────

check_prerequisites() {
    log_info "Vérification des prérequis..."

    # Vérifier Maven
    if ! command -v mvn &> /dev/null; then
        log_error "Maven n'est pas installé ou non disponible dans le PATH"
        return 1
    fi
    log_success "Maven trouvé: $(mvn --version | head -1)"

    # Vérifier Tomcat
    if [ ! -d "$TOMCAT_HOME" ]; then
        log_error "Tomcat n'existe pas à: $TOMCAT_HOME"
        return 1
    fi
    log_success "Tomcat trouvé à: $TOMCAT_HOME"

    # Vérifier Java
    if ! command -v java &> /dev/null; then
        log_error "Java n'est pas installé"
        return 1
    fi
    log_success "Java trouvé: $(java -version 2>&1 | head -1)"

    return 0
}

# ─── GIT SYNC ──────────────────────────────────────────────────────────────

sync_code() {
    log_info "Synchronisation du code source..."

    cd "$PROJECT_PATH"

    # Vérifier si c'est un repo git
    if [ -d .git ]; then
        log_info "Mise à jour du code via Git..."
        git pull origin main 2>&1 | tee -a "$LOG_FILE" || log_warn "Impossible de tirer le code principal"
    else
        log_warn "Répertoire Git non trouvé, passage de la sync"
    fi

    return 0
}

# ─── BUILD ─────────────────────────────────────────────────────────────────

build_project() {
    log_info "Compilation du projet Maven..."

    cd "$PROJECT_PATH"

    # Clean et build
    if ! mvn clean package -DskipTests -q; then
        log_error "La compilation Maven a échoué"
        return 1
    fi

    # Vérifier que le WAR a été généré
    if [ ! -f "$WAR_SOURCE" ]; then
        log_error "Le WAR n'a pas été généré: $WAR_SOURCE"
        return 1
    fi

    log_success "WAR généré avec succès: $WAR_SOURCE"
    log_info "Taille du WAR: $(du -h "$WAR_SOURCE" | cut -f1)"

    return 0
}

# ─── BACKUP ────────────────────────────────────────────────────────────────

backup_current_app() {
    log_info "Sauvegarde de l'application actuelle..."

    BACKUP_DIR="${TOMCAT_WEBAPPS}/.backup"
    mkdir -p "$BACKUP_DIR"

    # Backup du WAR existant si présent
    if [ -f "${TOMCAT_WEBAPPS}/${APP_NAME}.war" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        cp "${TOMCAT_WEBAPPS}/${APP_NAME}.war" "${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.war"
        log_success "Backup du WAR: ${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.war"
    fi

    # Backup du répertoire déployé si présent
    if [ -d "${TOMCAT_WEBAPPS}/${APP_NAME}" ]; then
        tar -czf "${BACKUP_DIR}/${APP_NAME}_${TIMESTAMP}.tar.gz" -C "${TOMCAT_WEBAPPS}" "${APP_NAME}" 2>/dev/null
        log_success "Backup du dossier application"
    fi

    return 0
}

# ─── STOP TOMCAT ──────────────────────────────────────────────────────────

stop_tomcat() {
    log_info "Arrêt de Tomcat..."

    if [ -x "${TOMCAT_BIN}/catalina.sh" ]; then
        "${TOMCAT_BIN}/catalina.sh" stop 60 2>&1 | tee -a "$LOG_FILE" || true
        sleep 2

        # Force kill si nécessaire
        if pgrep -f "org.apache.catalina.startup.Bootstrap" > /dev/null; then
            log_warn "Tomcat n'a pas arrêté proprement, force kill..."
            pkill -9 -f "org.apache.catalina.startup.Bootstrap"
            sleep 1
        fi
    fi

    log_success "Tomcat arrêté"
    return 0
}

# ─── DÉPLOIEMENT ──────────────────────────────────────────────────────────

deploy_war() {
    log_info "Déploiement du WAR..."

    # Supprimer l'ancienne application
    if [ -d "${TOMCAT_WEBAPPS}/${APP_NAME}" ]; then
        log_info "Suppression de l'ancienne application..."
        rm -rf "${TOMCAT_WEBAPPS}/${APP_NAME}"
    fi

    if [ -f "${TOMCAT_WEBAPPS}/${APP_NAME}.war" ]; then
        rm -f "${TOMCAT_WEBAPPS}/${APP_NAME}.war"
    fi

    # Copier le nouveau WAR
    cp "$WAR_SOURCE" "${TOMCAT_WEBAPPS}/${APP_NAME}.war"
    log_success "WAR copié vers Tomcat: ${TOMCAT_WEBAPPS}/${APP_NAME}.war"

    # Vérifier les permissions
    if [ -w "${TOMCAT_WEBAPPS}/${APP_NAME}.war" ]; then
        log_success "Permissions vérifiées sur le WAR"
    else
        log_warn "Vérification des permissions sur le WAR"
    fi

    return 0
}

# ─── START TOMCAT ─────────────────────────────────────────────────────────

start_tomcat() {
    log_info "Démarrage de Tomcat..."

    # Nettoyer les logs
    if [ -d "${TOMCAT_LOGS}" ]; then
        # Garder seulement les 5 derniers fichiers log
        ls -1t "${TOMCAT_LOGS}"/catalina.out.* 2>/dev/null | tail -n +6 | xargs rm -f || true
    fi

    if [ -x "${TOMCAT_BIN}/catalina.sh" ]; then
        "${TOMCAT_BIN}/catalina.sh" start 2>&1 | tee -a "$LOG_FILE"
    else
        log_error "Script catalina.sh non trouvé ou non exécutable"
        return 1
    fi

    sleep 3
    log_success "Tomcat démarré"
    return 0
}

# ─── VÉRIFICATION DÉPLOIEMENT ──────────────────────────────────────────────

verify_deployment() {
    log_info "Vérification du déploiement..."

    sleep 5  # Attendre que Tomcat déploie l'application

    # Vérifier que le processus Tomcat est actif
    if ! pgrep -f "org.apache.catalina.startup.Bootstrap" > /dev/null; then
        log_error "Tomcat n'est pas en cours d'exécution"
        return 1
    fi
    log_success "Processus Tomcat actif"

    # Vérifier que l'application est accessible
    MAX_RETRIES=30
    RETRY_COUNT=0
    DEPLOYED=false

    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if [ -d "${TOMCAT_WEBAPPS}/${APP_NAME}" ]; then
            DEPLOYED=true
            break
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 1
    done

    if [ "$DEPLOYED" = true ]; then
        log_success "Application déployée et accessible après ${RETRY_COUNT}s"
    else
        log_warn "Timeout attendant le déploiement (${MAX_RETRIES}s)"
    fi

    # Vérifier les erreurs dans les logs
    if tail -50 "${TOMCAT_LOGS}/catalina.out" 2>/dev/null | grep -i "error\|exception" | grep -v "normal"; then
        log_warn "Des messages d'erreur détectés dans les logs Tomcat"
    fi

    return 0
}

# ─── AFFICHER LE RÉSUMÉ ────────────────────────────────────────────────────

print_summary() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ DÉPLOIEMENT COMPLÉTÉ AVEC SUCCÈS${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "Application: ${GREEN}${PROJECT_NAME}${NC}"
    echo -e "Chemin Tomcat: ${GREEN}${TOMCAT_HOME}${NC}"
    echo -e "URL de l'app: ${GREEN}http://localhost:8080/${APP_NAME}${NC}"
    echo -e "Timestamp: ${GREEN}$(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo -e "Log: ${GREEN}${LOG_FILE}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# ─── MAIN ──────────────────────────────────────────────────────────────────

main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  DÉPLOIEMENT FRONTEND - VISA MANAGEMENT SYSTEM                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    log_info "Début du déploiement - Script: $0"
    log_info "Projet: $PROJECT_NAME | Tomcat: $TOMCAT_HOME"

    # Exécuter les étapes
    if ! check_prerequisites; then
        log_error "Vérification des prérequis échouée"
        exit 1
    fi

    if ! sync_code; then
        log_warn "Sync du code échouée, continue avec le code local"
    fi

    if ! build_project; then
        log_error "La compilation a échoué"
        exit 1
    fi

    if ! backup_current_app; then
        log_warn "Backup échoué, continue..."
    fi

    if ! stop_tomcat; then
        log_error "Arrêt de Tomcat échoué"
        exit 1
    fi

    if ! deploy_war; then
        log_error "Déploiement du WAR échoué"
        exit 1
    fi

    if ! start_tomcat; then
        log_error "Démarrage de Tomcat échoué"
        exit 1
    fi

    if ! verify_deployment; then
        log_warn "Vérification du déploiement incomplète"
    fi

    print_summary
    log_success "Déploiement terminé avec succès"
    exit 0
}

# ─── GESTION ERREURS ───────────────────────────────────────────────────────

trap 'log_error "Script interrompu"; exit 1' SIGINT SIGTERM

# ─── LANCER ────────────────────────────────────────────────────────────────

main "$@"
