/**
 * Configuration de l'API Back Office
 * Modifiez cette URL selon votre environnement
 */

const API_CONFIG = {
    // URL du serveur Back Office
    // Développement : http://localhost:8080
    // Production : https://api.votredomaine.com
    BASE_URL: 'http://localhost:8080',
    
    // Endpoint de la demande de transformation
    ENDPOINT: '/api/visa/demande_transformation',
    
    // Timeouts en millisecondes
    TIMEOUT: 30000,
    
    // Afficher les logs en console (développement)
    DEBUG: true
};

// Si vous déployez le FO et BO sur des domaines différents,
// assurez-vous que le BO a CORS activé (ce qui est le cas ici avec @CrossOrigin)
