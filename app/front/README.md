# Frontend - Gestion des Demandes Administratives

Application React Vite professionnelle pour gérer les demandes administratives (visa, résidence, passeport).

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application s'ouvrira sur `http://localhost:5173`

Le backend doit être accessible sur `http://localhost:8080/api/v1`

## Build

```bash
npm run build
```

## Architecture

```
src/
├── components/         # Composants réutilisables
│   ├── UI.jsx         # Composants UI (Button, Card, Table, etc)
│   └── Layout.jsx     # Layout principal avec navigation
├── pages/             # Pages de l'application
│   ├── HomePage.jsx
│   ├── DemandeurListPage.jsx
│   ├── DemandeListPage.jsx
│   └── DemandeDetailPage.jsx
├── services/          # Services API
│   └── api.js         # Axios instance et endpoints
├── hooks/             # Custom hooks
│   └── useNotification.jsx
├── App.jsx            # Routeur principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux Tailwind
```

## Fonctionnalités

- ✅ CRUD Demandeurs avec validation
- ✅ CRUD Demandes avec filtrage par demandeur
- ✅ Détail demande avec validation automatique
- ✅ Gestion des pièces justificatives
- ✅ Affichage des pièces/objets manquants
- ✅ Interface responsive avec Tailwind CSS
- ✅ Notifications utilisateur
- ✅ Proxy API configuré pour éviter les CORS

## Variables d'environnement

Créer un fichier `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## API Endpoints

Le frontend consomme les endpoints suivants du backend:

### Demandeurs
- `GET /api/v1/demandeurs` - Liste
- `POST /api/v1/demandeurs` - Créer
- `PUT /api/v1/demandeurs/{id}` - Mettre à jour
- `DELETE /api/v1/demandeurs/{id}` - Supprimer

### Demandes
- `GET /api/v1/demandes` - Liste
- `POST /api/v1/demandes` - Créer
- `PUT /api/v1/demandes/{id}` - Mettre à jour
- `DELETE /api/v1/demandes/{id}` - Supprimer
- `GET /api/v1/demandes/{id}/validation` - Valider

### Références
- `GET /api/v1/references/types-demandes`
- `GET /api/v1/references/status-demandes`
- `GET /api/v1/references/nationalites`
- `GET /api/v1/references/situations-familiales`

## Technologies

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios
