# Mappage des données - Front Office vers Back Office

## Vue d'ensemble

Le Front Office collecte les données du formulaire HTML et les transforme au format `DemandeDTO` expectedu par l'API du Back Office.

## Correspondance des champs

### Section 1 : Informations Personnelles

| Champ HTML | ID HTML | Type | Champ DemandeDTO | Type JWT |
|------------|---------|------|------------------|----------|
| NOM | `#nom` | text | `lastName` | String |
| PRENOMS | `#prenoms` | text | `firstNames` | String |
| NOM DE JEUNE FILLE | `#nomJeuneFille` | text | `maidenName` | String |
| NE(E) LE | `#dateNaissance` | date | `birthDate` | LocalDate |
| SITUATION DE FAMILLE | `#situationFamille` | select | `maritalStatus` | String |
| NATIONALITE | `#nationalite` | text | `nationality` | String |
| DOMICILE HABITUEL | `#domicile` | text | `homeAddress` | String |
| PROFESSION OU QUALITE | `#profession` | text | `occupation` | String |
| EMPLOYEUR | `#employeur` | text | `employerName` | String |
| ADRESSE | `#adresse` | text | `employerAddress` | String |

### Section 2 : Données du Passeport

| Champ HTML | ID HTML | Type | Champ DemandeDTO | Notes |
|------------|---------|------|------------------|-------|
| PASSEPORT N | `#passeport` | text | `numeroVisaPrcd` | Numéro du visa précédent |
| DELIVRE PAR | `#delivrepar` | text | `dateDelivranceVisaPrcd` | Date ou texte |

**Note** : Cette section collecte les données du visa précédent, pas du passeport lui-même.

### Section 3 : Mouvements à Madagascar

| Champ HTML | ID HTML | Type | Champ DemandeDTO | Stocké |
|------------|---------|------|------------------|--------|
| DATE D'ENTREE A MADAGASCAR | `#dateEntree` | date | *(non stocké en v1)* | [NON] |
| LIEU D'ENTREE | `#lieuEntree` | text | *(non stocké en v1)* | [NON] |
| DATE DE SORTIE | `#dateSortie` | date | *(non stocké en v1)* | [NON] |
| LIEU DE SORTIE | `#lieuSortie` | text | *(non stocké en v1)* | [NON] |

**Note** : Ces champs ne sont pas stockés dans la version actuelle de DemandeDTO mais Peutêtre ajoutés à l'avenir.

### Section 4 : Motif du Voyage

| Champ HTML | ID HTML | Valeurs | Champ DemandeDTO | Notes |
|------------|---------|---------|------------------|-------|
| MOTIF (radio) | `#travailleur`, `#investisseur`, `#regroupement` | travailleur / investisseur / regroupement | *(informationnel, synchro avec catégorie)* | Synchronisé avec la catégorie |

### Section 5 : Documents à Fournir

#### Pièces Communes

| Champ HTML | ID HTML | Valeur | Champ DemandeDTO | Type |
|------------|---------|--------|------------------|------|
| 02 photos d'identite | `#piece1` | photos | `aFourniPhotos` | boolean |
| Notice de renseignement | `#piece2` | notice | `aFourniNoticeRenseignement` | boolean |
| Demande adressee a Mr le Ministere | `#piece3` | demande | `aFourniDemandeMinistre` | boolean |
| Photocopie certifiee du visa | `#piece4` | visa | `aFourniCopieVisa` | boolean |
| Photocopie certifiee de la premiere page du passeport | `#piece5` | passeport | `aFourniCopiePasseport` | boolean |
| Photocopie certifiee de la carte resident | `#piece6` | carteResident | `aFourniCopieCarteResident` | boolean |
| Certificat de residence a Madagascar | `#piece7` | residence | `aFourniCertificatResidence` | boolean |
| Extrait de casier judiciaire | `#piece8` | casier | `aFourniExtraitCasierJudiciaire` | boolean |

#### Pièces Complémentaires - Travailleur

| Champ HTML | ID HTML | Valeur | Champ DemandeDTO | Type |
|------------|---------|--------|------------------|------|
| Autorisation emploi | `#comp1` | autorisation | `aFourniAutorisationEmploi` | boolean |
| Attestation d'emploi | `#comp2` | attestation | `aFourniAttestationEmploi` | boolean |

#### Pièces Complémentaires - Investisseur

| Champ HTML | ID HTML | Valeur | Champ DemandeDTO | Type |
|------------|---------|--------|------------------|------|
| Statut de la Societe | `#comp3` | statut | `aFourniStatutSociete` | boolean |
| Extrait d'inscription au registre de commerce | `#comp4` | registre | `aFourniExtraitRC` | boolean |
| Carte fiscale | `#comp5` | fiscale | `aFourniCarteFiscale` | boolean |

#### Pièces Complémentaires - Regroupement Familial

| Champ HTML | ID HTML | Valeur | Champ DemandeDTO | Type |
|------------|---------|--------|------------------|------|
| Acte de naissance / mariage | `#comp6` | naissance | *(non stocké v1)* | [NON] |
| Justificatif de ressources | `#comp7` | ressources | *(non stocké v1)* | [NON] |
| Autorisation emploi (RF travailleurs) | `#comp8` | autorisationRF | *(non stocké v1)* | [NON] |

## Énumération : CategorieVisa

La catégorie sélectionnée dans le formulaire est transformée en énumération `CategorieVisa` :

```javascript
const categorieValue = document.querySelector('input[name="categorie"]:checked').value;
// Valeurs possibles : 'travailleur', 'investisseur', 'regroupement'

// Transformation en DemandeDTO :
categorieVisa: categorieValue.toUpperCase()
// Résultat : 'TRAVAILLEUR', 'INVESTISSEUR', 'REGROUPEMENT'
```

## Énumération : TypeDemande

Actuellement, le type de demande est toujours défini à :

```javascript
typeDemande: 'TRANSFORMATION'
```

- À l'avenir, cela pourrait être :
- NOUVELLE - pour une nouvelle demande
- TRANSFORMATION - pour transformer un visa existant
- RENOUVELLEMENT - pour renouveler un visa

## Exemple complet de transformation

### Données du formulaire

```html
<input id="nom" value="Dupont">
<input id="prenoms" value="Jean">
<input id="dateNaissance" value="1990-05-15">
<input id="situationFamille" value="marie">
<input id="nationalite" value="Francaise">
...
<input id="piece1" type="checkbox" checked> <!-- photos -->
<input id="comp1" type="checkbox" checked> <!-- autorisation emploi -->
<input name="categorie" value="travailleur" checked>
```

### JSON envoyé à l'API

```json
POST /api/visa/demande_transformation
Content-Type: application/json

{
  "typeDemande": "TRANSFORMATION",
  "categorieVisa": "TRAVAILLEUR",
  "lastName": "Dupont",
  "firstNames": "Jean",
  "birthDate": "1990-05-15",
  "maritalStatus": "marie",
  "nationality": "Francaise",
  "homeAddress": "123 Rue de la Paix",
  "occupation": "Ingénieur",
  "employerName": "TechCorp",
  "employerAddress": "456 Avenue des Affaires",
  "numeroVisaPrcd": "ABC123456",
  "dateDelivranceVisaPrcd": "2020-01-01",
  "aFourniPhotos": true,
  "aFourniNoticeRenseignement": false,
  "aFourniDemandeMinistre": false,
  "aFourniCopieVisa": false,
  "aFourniCopiePasseport": false,
  "aFourniCopieCarteResident": false,
  "aFourniCertificatResidence": false,
  "aFourniExtraitCasierJudiciaire": false,
  "aFourniAutorisationEmploi": true,
  "aFourniAttestationEmploi": false,
  "aFourniStatutSociete": false,
  "aFourniExtraitRC": false,
  "aFourniCarteFiscale": false
}
```

## Notes importantes

1. **Champs non requis** : Les champs vides au formulaire sont envoyés comme `null` ou `false` selon le type
2. **Dates** : Envoyées au format ISO 8601 (`YYYY-MM-DD`)
3. **Enums** : Les valeurs de catégorie sont converties en majuscules
4. **Checkboxes** : Toutes les cases non cochées sont envoyées comme `false`
5. **Champs non supportés v1** : Certains champs du formulaire ne sont pas stockés dans la v1 (mouvements, regroupement)

## Modifications futures possibles

Pour supporter les données complètes du formulaire, les futurs champs DemandeDTO pourraient inclure :

```java
// Mouvements
private LocalDate dateEntreeeMadagascar;
private String lieuEntreeMadagascar;
private LocalDate dateSortieMadagascar;
private String lieuSortieMadagascar;

// Pièces regroupement familial
private boolean aFourniActeNaissance;
private boolean aFourniJustificatifRessources;
private boolean aFourniAutorisationEmploiRF;
```

## Configuration de variables d'environnement (optionnel)

Pour les futurs déploiements, vous pouvez externaliser la configuration :

```javascript
// config.js
const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
    ENDPOINT: process.env.API_ENDPOINT || '/api/visa/demande_transformation',
    TIMEOUT: process.env.API_TIMEOUT || 30000,
    DEBUG: process.env.DEBUG === 'true' || true
};
```
