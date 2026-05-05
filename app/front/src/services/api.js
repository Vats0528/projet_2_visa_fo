import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.88.5:8080/api/v1'
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://10.142.60.162:8080/api/v1'

const currentIP = window.location.hostname;
const shareUrl = `http://${currentIP}:5173/`;
const API_BASE_URL =  `http://${currentIP}:8080/api/v1`;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Demandeurs
export const demandeurAPI = {
  getAll: () => client.get('/demandeurs'),
  getById: (id) => client.get(`/demandeurs/${id}`),
  create: (data) => client.post('/demandeurs', data),
  update: (id, data) => client.put(`/demandeurs/${id}`, data),
  delete: (id) => client.delete(`/demandeurs/${id}`)
}

// Demandes
export const demandeAPI = {
  getAll: (demandeurId) => client.get('/demandes', { params: { demandeurId } }),
  getById: (id) => client.get(`/demandes/${id}`),
  create: (data) => client.post('/demandes', data),
  update: (id, data) => client.put(`/demandes/${id}`, data),
  delete: (id) => client.delete(`/demandes/${id}`),
  validate: (id) => client.get(`/demandes/${id}/validation`)
}

// Pieces
export const pieceAPI = {
  getAll: (demandeurId) => client.get('/pieces', { params: { demandeurId } }),
  getById: (id) => client.get(`/pieces/${id}`),
  create: (data) => client.post('/pieces', data),
  update: (id, data) => client.put(`/pieces/${id}`, data),
  delete: (id) => client.delete(`/pieces/${id}`)
}

// Objets métier
export const objetMetierAPI = {
  createPasseport: (data) => client.post('/objets/passeports', data),
  getPasseports: (demandeurId) => client.get('/objets/passeports', { params: { demandeurId } }),

  createVisa: (data) => client.post('/objets/visas', data),
  getVisas: (demandeurId) => client.get('/objets/visas', { params: { demandeurId } }),

  createVisaTransformable: (data) => client.post('/objets/visas-transformables', data),
  getVisaTransformables: (demandeurId) => client.get('/objets/visas-transformables', { params: { demandeurId } }),

  createEtatCivil: (data) => client.post('/objets/etats-civils', data),
  getEtatsCivil: (demandeurId) => client.get('/objets/etats-civils', { params: { demandeurId } }),

  createCarteResident: (data) => client.post('/objets/cartes-resident', data),
  getCartesResident: (demandeurId) => client.get('/objets/cartes-resident', { params: { demandeurId } })
}

// References
export const referenceAPI = {
  getTypeDemandes: () => client.get('/references/types-demandes'),
  getStatusDemandes: () => client.get('/references/status-demandes'),
  getNationalites: () => client.get('/references/nationalites'),
  getSituationsFamiliales: () => client.get('/references/situations-familiales'),
  getTypesVisa: () => client.get('/references/types-visa'),
  getCategoriesPieces: () => client.get('/references/categories-pieces'),
  getTypesObjets: () => client.get('/references/types-objets'),
  getPiecesObligatoires: (typeDemandeId) => client.get(`/regles/types-demandes/${typeDemandeId}/pieces-obligatoires`),
  getObjetsObligatoires: (typeDemandeId) => client.get(`/regles/types-demandes/${typeDemandeId}/objets-obligatoires`)
}

export default client
