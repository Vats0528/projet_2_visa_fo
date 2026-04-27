/**
 * Configuration API - Visa Management System
 * Frontend Office (FO)
 */

const API = {
    // URL de base du backend (Back Office)
    BASE_URL: 'http://localhost:8080',

    // Endpoints disponibles
    demandes: '/api/visa/demandes',
    demandeById: (id) => `/api/visa/demandes/${id}`,
    demandePieces: (id) => `/api/visa/demandes/${id}/pieces`,
    demande_transformation: '/api/visa/demande_transformation',
    demandeurs: '/api/visa/demandeurs',
    demandeurById: (id) => `/api/visa/demandeurs/${id}`,
    etat_civil: '/api/visa/etat-civil',
    visa_transformable: '/api/visa/visa-transformable',

    // Données de référence (BO)
    typeDemandes: '/api/visa/type-demandes',
    typeVisas: '/api/visa/type-visas',
    nationalites: '/api/visa/nationalites',
    situationsFamiliales: '/api/visa/situations-familiales',
    categoriesPieces: '/api/visa/categories-pieces',

    // Configuration requêtes HTTP
    TIMEOUT: 30000,         // 30 secondes
    DEBUG: true,
    LOG_ENABLED: true
};

/**
 * Fonction fetch globale pour l'API
 */
async function apiFetch(endpoint, options = {}) {
    const url = API.BASE_URL + endpoint;
    const method = options.method || 'GET';

    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        },
        timeout: API.TIMEOUT
    };

    if (options.body) {
        requestOptions.body = JSON.stringify(options.body);
    }

    if (API.DEBUG) {
        console.log(`[API] ${method} ${url}`, options.body);
    }

    try {
        const response = await fetch(url, requestOptions);

        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();

        if (!response.ok) {
            const detail = text ? ` - ${text}` : '';
            throw new Error(`HTTP ${response.status}: ${response.statusText}${detail}`);
        }

        if (!text) {
            return null;
        }

        let data = text;
        if (contentType.includes('application/json')) {
            data = JSON.parse(text);
        } else {
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text;
            }
        }

        if (API.DEBUG) {
            console.log(`[API] Réponse:`, data);
        }

        return data;
    } catch (error) {
        console.error(`[API ERROR] ${method} ${url}:`, error.message);
        throw error;
    }
}

/**
 * Utilitaire pour construire les URLs complètes
 */
function getApiUrl(endpoint, params = {}) {
    let url = API.BASE_URL + endpoint;

    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });

    return url;
}

/**
 * Helpers pour les opérations courantes
 */

async function createDemande(demandeData) {
    return apiFetch(API.demande_transformation, {
        method: 'POST',
        body: demandeData
    });
}

async function getAllDemandes() {
    return apiFetch(API.demandes);
}

async function getDemandeById(id) {
    return apiFetch(API.demandeById(id));
}

async function updateDemande(id, demandeData) {
    // Mise à jour désactivée pour le moment - utilisez la création
    return Promise.reject(new Error('Mise à jour via API non disponible actuellement'));
    // return apiFetch(API.demandeById(id), {
    //     method: 'PUT',
    //     body: demandeData
    // });
}

async function deleteDemande(id) {
    return apiFetch(API.demandeById(id), {
        method: 'DELETE'
    });
}

async function getAllDemandeurs() {
    return apiFetch(API.demandeurs);
}

/**
 * Affichage des notifications toast
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Comptage des pièces fournies
 */
function countPieces(demande) {
    if (demande && Array.isArray(demande.pieces) && demande.pieces.length > 0) {
        const done = demande.pieces.filter(p => p && (p.isProvided === true || p.is_provided === true)).length;
        const total = demande.pieces.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return { done, total, pct };
    }

    const pieceFields = [
        'aFourniPhotos',
        'aFourniNoticeRenseignement',
        'aFourniDemandeMinistre',
        'aFourniCopieVisa',
        'aFourniCopiePasseport',
        'aFourniCopieCarteResident',
        'aFourniCertificatResidence',
        'aFourniExtraitCasierJudiciaire',
        'aFourniStatutSociete',
        'aFourniExtraitRc',
        'aFourniCarteFiscale',
        'aFourniAutorisationEmploi',
        'aFourniAttestationEmploi'
    ];

    const done = pieceFields.filter(f => demande[f]).length;
    const total = pieceFields.length;
    const pct = Math.round((done / total) * 100);

    return { done, total, pct };
}

function normalizeDemandeForUi(demande) {
    const demandeur = demande.demandeur || {};
    const nationalite = demandeur.nationalite || {};
    const situation = demandeur.situationFamille || {};
    const typeDemande = demande.typeDemande || {};
    const typeVisa = demande.typeVisa || {};
    const statusObj = demande.status || demande.statusDm || {};
    const statusValue = typeof statusObj === 'string' ? statusObj : (statusObj.status || null);

    return {
        ...demande,
        id: demande.id || demande.idDemande || null,
        lastName: demande.lastName || demandeur.nom || null,
        firstNames: demande.firstNames || demandeur.prenom || null,
        nationality: demande.nationality || nationalite.nom || null,
        maritalStatus: demande.maritalStatus || situation.libelle || null,
        typeDemande: typeof typeDemande === 'string' ? typeDemande : (typeDemande.nom || null),
        typeVisa: typeof typeVisa === 'string' ? typeVisa : (typeVisa.libelle || null),
        statusValue: statusValue,
    };
}

function normalizeDemandesForUi(list) {
    if (!Array.isArray(list)) return [];
    return list.map(normalizeDemandeForUi);
}

/**
 * Labellisation du statut
 */
function statusLabel(status) {
    const labels = {
        'COMPLET': { label: '✓ Complet', cls: 'badge-success' },
        'INCOMPLET': { label: '⚠ Incomplet', cls: 'badge-warning' }
    };
    return labels[status] || { label: status, cls: 'badge-neutral' };
}

/**
 * Formatage des dates
 */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
}

/**
 * Charger les types de demande (référence)
 */
async function loadTypeDemandes() {
    try {
        return await apiFetch(API.typeDemandes);
    } catch (error) {
        console.error('Erreur lors du chargement des types de demande:', error);
        return [];
    }
}

/**
 * Charger les types de visa (référence)
 */
async function loadTypeVisas() {
    try {
        return await apiFetch(API.typeVisas);
    } catch (error) {
        console.error('Erreur lors du chargement des types de visa:', error);
        return [];
    }
}

/**
 * Charger les nationalités (référence)
 */
async function loadNationalites() {
    try {
        return await apiFetch(API.nationalites);
    } catch (error) {
        console.error('Erreur lors du chargement des nationalités:', error);
        return [];
    }
}

/**
 * Charger les situations familiales (référence)
 */
async function loadSituationsFamiliales() {
    try {
        return await apiFetch(API.situationsFamiliales);
    } catch (error) {
        console.error('Erreur lors du chargement des situations familiales:', error);
        return [];
    }
}

/**
 * Charger les catégories de pièces (référence)
 */
async function loadCategoriesPieces() {
    try {
        return await apiFetch(API.categoriesPieces);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories de pièces:', error);
        return [];
    }
}

