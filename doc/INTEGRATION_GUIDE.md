# Guide d'intégration Front Office - Back Office

## Vue d'ensemble

Le **Front Office** (FO) est l'interface utilisateur pour soumettre des demandes de visa transformable.
Le **Back Office** (BO) est l'API qui traite et stocke les demandes.

## Architecture

```
┌─────────────────────────────────┐
│   Front Office (FO)             │
│   - HTML Form                   │
│   - JavaScript Client           │
│   - Port: 8081 (Tomcat)        │
└──────────────┬──────────────────┘
               │ HTTP POST
               │ /api/visa/demande_transformation
               ↓
┌─────────────────────────────────┐
│   Back Office (BO)              │
│   - Spring Boot API             │
│   - PostgreSQL Database         │
│   - Port: 8080                 │
└─────────────────────────────────┘
```

## Configuration

### Back Office (BO)

Le BO écoute sur le port **8080** avec la base de données PostgreSQL :

```properties
# /projet_2_visa_bo/app/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5433/visa_db
spring.datasource.username=postgres
spring.datasource.password=aki
```

### Front Office (FO)

Modifiez le fichier de configuration `config.js` selon votre environnement :

```javascript
// /src/main/webapp/config.js
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',      // URL du Back Office
    ENDPOINT: '/api/visa/demande_transformation',
    TIMEOUT: 30000,
    DEBUG: true
};
```

**Exemples de configuration :**

- **Développement local** : `http://localhost:8080`
- **Serveur réseau** : `http://192.168.1.100:8080`
- **Production** : `https://api.votredomaine.com`

## Démarrage des applications

### 1. Démarrer le Back Office

```bash
cd /home/vats/Documents/GitHub/projet_2_visa_bo/app

# Compilation et démarrage
mvn spring-boot:run

# Ou avec Maven Wrapper
./mvnw spring-boot:run
```

Le BO démarrera sur : **http://localhost:8080**

### 2. Démarrer la base de données PostgreSQL

```bash
# Assurez-vous que PostgreSQL est démarré
# et que la base de données 'visa_db' existe

psql -U postgres -c "CREATE DATABASE visa_db;"
```

### 3. Démarrer le Front Office

```bash
cd /home/vats/Documents/GitHub/projet_2_visa_fo

# Compilation et déploiement WAR
mvn clean package

# Déployer sur Tomcat (si configuré) ou utiliser mvn tomcat7:run
mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run
```

Le FO démarrera sur : **http://localhost:8081** (ou selon votre configuration Tomcat)

## Utilisation

1. Ouvrez votre navigateur et accédez au formulaire FO :
   ```
   http://localhost:8081/projet_2_visa_fo/demande-visa-long-sejour.html
   ```

2. Remplissez le formulaire avec les informations requises

3. Cliquez sur **"Soumettre la Demande"**

4. Le formulaire enverra les données à l'API du BO :
   ```
   POST http://localhost:8080/api/visa/demande_transformation
   ```

5. Un message de confirmation s'affichera avec l'ID de la demande

## Format des données

Le FO transforme les données du formulaire au format `DemandeDTO` attendu par le BO :

### Données envoyées

```json
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
  "aFourniNoticeRenseignement": true,
  "aFourniDemandeMinistre": true,
  "aFourniCopieVisa": true,
  "aFourniCopiePasseport": true,
  "aFourniCopieCarteResident": true,
  "aFourniCertificatResidence": true,
  "aFourniExtraitCasierJudiciaire": true,
  "aFourniAutorisationEmploi": true,
  "aFourniAttestationEmploi": true
}
```

### Réponse du BO

```json
{
  "id": 1,
  "numDemande": "DEM-2024-001",
  "dateCreation": "2024-04-16",
  "statut": "CREEE",
  "typeDemande": "TRANSFORMATION",
  "categorieVisa": "TRAVAILLEUR",
  ...
}
```

## Résolution des problèmes

### Erreur : "Erreur lors de l'envoi à l'API"

**Causes possibles :**
- Le Back Office n'est pas démarré
- L'URL du Back Office est incorrecte dans `config.js`
- Un problème de CORS (généralement pas de problème car le BO a @CrossOrigin)

**Solution :**
1. Vérifiez que le BO tourne sur http://localhost:8080
2. Vérifiez la configuration dans `config.js`
3. Ouvrez la console du navigateur (F12) pour voir les détails de l'erreur

### Erreur : "Bad Request" ou "400"

**Cause :** Le format des données envoyées ne correspond pas au format attendu

**Solution :**
1. Vérifiez que tous les champs obligatoires sont remplis
2. Consultez la console du navigateur (F12) pour voir les erreurs en détail
3. Comparez le JSON envoyé avec la structure `DemandeDTO`

### La demande ne s'enregistre pas en base de données

**Cause :** La PostgreSQL n'est pas accessible ou la base de données n'existe pas

**Solution :**
1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez la configuration dans `application.properties` du BO
3. Vérifiez les identifiants PostgreSQL

## Configuration avancée

### CORS pour domaines multiples

Si le FO et le BO sont sur des domaines différents, modifiez le BO :

```java
// Dans DemandeApiController.java
@CrossOrigin(origins = {"http://localhost:8081", "https://votredomaine.com"})
```

### Timeout des requêtes

Modifiez `config.js` pour ajuster le timeout :

```javascript
const API_CONFIG = {
    ...
    TIMEOUT: 60000  // 60 secondes au lieu de 30
};
```

### Mode debug/production

```javascript
const API_CONFIG = {
    ...
    DEBUG: false  // Désactiver les logs en production
};
```

## Support

Pour plus d'informations sur les projets :
- Back Office : `/projet_2_visa_bo/README.md`
- Front Office : `/projet_2_visa_fo/README.md`
