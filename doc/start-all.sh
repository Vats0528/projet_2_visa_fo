#!/bin/bash

# Script de démarrage pour Front Office et Back Office
# Usage: ./start-all.sh [option]
# Options: bo (back office seulement), fo (front office seulement), all (par défaut)

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BO_DIR="$PROJECT_DIR/projet_2_visa_bo/app"
FO_DIR="$PROJECT_DIR/projet_2_visa_fo"

# Options
OPTION="${1:-all}"

# Fonction pour afficher les messages
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Fonction pour vérifier Maven
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven n'est pas installé"
        return 1
    fi
    print_success "Maven trouvé"
    return 0
}

# Fonction pour vérifier Java
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java n'est pas installé"
        return 1
    fi
    print_success "Java trouvé"
    return 0
}

# Fonction pour démarrer le Back Office
start_back_office() {
    print_header "Démarrage du Back Office"
    
    # Vérifier le répertoire
    if [ ! -d "$BO_DIR" ]; then
        print_error "Répertoire Back Office non trouvé: $BO_DIR"
        return 1
    fi
    
    print_warning "Le Back Office démarre dans une fenêtre distante..."
    echo "URL: http://localhost:8080"
    echo "API: http://localhost:8080/api/visa/demande_transformation"
    echo ""
    
    # Lancer dans un nouveau terminal (tmux ou gnome-terminal)
    if command -v tmux &> /dev/null; then
        tmux new-window -n "back-office" -c "$BO_DIR" "mvn spring-boot:run"
        print_success "Back Office lancé dans tmux"
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$BO_DIR' && mvn spring-boot:run; bash"
        print_success "Back Office lancé dans gnome-terminal"
    else
        print_warning "Aucun terminal détecté, lancement en arrière-plan..."
        cd "$BO_DIR"
        mvn spring-boot:run &
        print_success "Back Office lancé (PID: $!)"
    fi
}

# Fonction pour démarrer le Front Office
start_front_office() {
    print_header "Démarrage du Front Office"
    
    # Vérifier le répertoire
    if [ ! -d "$FO_DIR" ]; then
        print_error "Répertoire Front Office non trouvé: $FO_DIR"
        return 1
    fi
    
    print_warning "Le Front Office démarre dans une fenêtre distante..."
    echo "URL: http://localhost:8081/projet_2_visa_fo"
    echo "Assurez-vous que le Back Office est en cours d'exécution"
    echo ""
    
    # Lancer dans un nouveau terminal
    if command -v tmux &> /dev/null; then
        tmux new-window -n "front-office" -c "$FO_DIR" "mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run"
        print_success "Front Office lancé dans tmux"
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$FO_DIR' && mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run; bash"
        print_success "Front Office lancé dans gnome-terminal"
    else
        print_warning "Aucun terminal détecté, lancement en arrière-plan..."
        cd "$FO_DIR"
        mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run &
        print_success "Front Office lancé (PID: $!)"
    fi
}

# Vérifications préalables
print_header "Vérifications préalables"
check_java || exit 1
check_maven || exit 1

# Démarrage selon l'option
case "$OPTION" in
    bo)
        start_back_office
        ;;
    fo)
        start_front_office
        ;;
    all)
        start_back_office
        sleep 5  # Attendre que le BO démarre
        start_front_office
        ;;
    *)
        print_error "Option invalide: $OPTION"
        echo "Usage: $0 [bo|fo|all]"
        exit 1
        ;;
esac

print_header "Démarrage terminé"
echo ""
print_success "Back Office: http://localhost:8080"
print_success "Front Office: http://localhost:8081/projet_2_visa_fo"
print_warning "Vérifiez les fenêtres de terminal pour plus d'informations"
echo ""
