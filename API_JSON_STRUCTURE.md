# Structure des Donnees JSON - Demande de Visa

## Format JSON complet a envoyer a l'API

```json
{
  "personalInfo": {
    "lastName": "DUPONT",
    "firstNames": "Jean Marie",
    "maidenName": "MARTIN",
    "birthDate": "1990-05-15",
    "maritalStatus": "marie",
    "nationality": "Francaise",
    "homeAddress": "123 Rue de la Paix, 75000 Paris, France",
    "occupation": "Ingenieur Informatique",
    "employerName": "TechCorp France",
    "employerAddress": "456 Avenue du Progres, 75001 Paris"
  },
  "passport": {
    "passportNumber": "AB123456789",
    "issuedBy": "Prefecture de Paris"
  },
  "movements": {
    "entryDate": "2026-01-15",
    "entryLocation": "Aeroport International d'Antananarivo",
    "exitDate": "2026-06-30",
    "exitLocation": "Aeroport International d'Antananarivo"
  },
  "purpose": "travailleur",
  "documents": {
    "piecesCommunesRequises": [
      "photos",
      "notice",
      "demande",
      "visa",
      "passeport",
      "carteResident",
      "residence",
      "casier"
    ],
    "piecesComplementairesRequises": [
      "autorisation",
      "attestation"
    ]
  }
}
```

## Mappings des champs

### Section 1 : Informations Personnelles (`personalInfo`)

| Formulaire | Cle JSON | Type | Exemple |
|-----------|----------|------|---------|
| NOM | `lastName` | string | "DUPONT" |
| Prenoms | `firstNames` | string | "Jean Marie" |
| Nom de jeune fille | `maidenName` | string or null | "MARTIN" |
| Ne(e) le | `birthDate` | date (YYYY-MM-DD) | "1990-05-15" |
| Situation de famille | `maritalStatus` | enum | "celibataire", "marie", "divorce", "veuf", "pacs" |
| Nationalite | `nationality` | string | "Francaise" |
| Domicile habituel | `homeAddress` | string | "123 Rue de la Paix..." |
| Profession ou qualite | `occupation` | string | "Ingenieur" |
| Employeur | `employerName` | string or null | "TechCorp" |
| Adresse | `employerAddress` | string | "456 Avenue..." |

### Section 2 : Passeport (`passport`)

| Formulaire | Cle JSON | Type | Exemple |
|-----------|----------|------|---------|
| Passeport n° | `passportNumber` | string | "AB123456789" |
| Delivre par | `issuedBy` | string | "Prefecture de Paris" |

### Section 3 : Mouvements a Madagascar (`movements`)

| Formulaire | Cle JSON | Type | Exemple |
|-----------|----------|------|---------|
| Date d'entree | `entryDate` | date (YYYY-MM-DD) | "2026-01-15" |
| Lieu d'entree | `entryLocation` | string or null | "Aeroport Antananarivo" |
| Date de sortie | `exitDate` | date (YYYY-MM-DD) or null | "2026-06-30" |
| Lieu de sortie | `exitLocation` | string or null | "Aeroport Antananarivo" |

### Section 4 : Motif (`purpose`)

| Valeur | Signification |
|--------|---------------|
| travailleur | Travailleur |
| investisseur | Investisseur |
| regroupement | Regroupement Familial |

### Section 5 : Documents (`documents`)

#### Pieces Communes (`piecesCommunesRequises`)
- `photos`: 02 photos d'identite
- `notice`: Notice de renseignement
- `demande`: Demande adressee au Ministere de l'Interieur
- `visa`: Photocopie certifiee du visa
- `passeport`: Photocopie certifiee de la premiere page du passeport
- `carteResident`: Photocopie certifiee de la carte resident
- `residence`: Certificat de residence a Madagascar
- `casier`: Extrait de casier judiciaire

#### Pieces Complementaires par categorie (`piecesComplementairesRequises`)

**Pour Travailleur:**
- `autorisation`: Autorisation emploi (Ministere Fonction publique)
- `attestation`: Attestation d'emploi original

**Pour Investisseur:**
- `statut`: Statut de la Societe
- `registre`: Extrait d'inscription au registre de commerce
- `fiscale`: Carte fiscale

**Pour Regroupement Familial:**
- `naissance`: Acte de naissance / livret de famille
- `ressources`: Justificatif de ressources
- `autorisationRF`: Autorisation emploi pour regroupement familial

## URL d'envoi

**Endpoint**: `POST /projet_2_visa_fo/submitVisa`  
**Content-Type**: `application/json`  
**Body**: Structure JSON complete ci-dessus

## Reponse attendue (JSON)

```json
{
  "id": "5f8b8c3a9d4e2f1a6b9c0d1e",
  "status": "success",
  "message": "Demande enregistree avec succes",
  "createdAt": "2026-04-15T22:10:30Z"
}
```

Ou en cas d'erreur:

```json
{
  "error": "Message d'erreur",
  "status": "error"
}
```

## Notes

- Les champs avec `null` sont optionnels
- Les dates doivent etre au format ISO 8601 (YYYY-MM-DD)
- Tableau `documents.piecesCommunesRequises` toujours envoye
- Tableau `documents.piecesComplementairesRequises` depend de la categorie selectionnee
