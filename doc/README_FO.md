# Front Office - Demande de Visa

## Changements effectués

Le Front Office a été intégré avec le Back Office pour permettre la soumission de demandes de visa en ligne.

### Modifications principales

1. **Fichier `config.js`** - Nouvelle configuration centralisée
   - Définit l'URL de base du Back Office
   - Centralisé pour faciliter le changement selon l'environnement

2. **Fichier `demande-visa-long-sejour.html`** - Mise à jour du formulaire
   - Charge maintenant `config.js` au démarrage
   - Le formulaire envoie les données directement à l'API REST du Back Office
   - Transformation automatique des données du formulaire au format `DemandeDTO`

### Flux de traitement

```
Utilisateur remplit le formulaire HTML
         ↓
JavaScript valide et collecte les données
         ↓
Transformation au format DemandeDTO (cf. /api/visa/demande_transformation)
         ↓
Envoi POST vers Back Office
         ↓
Réponse avec succès ou erreur
         ↓
Message de confirmation ou d'erreur affichée à l'utilisateur
```

## Lancer le Front Office

### Prérequis

- Java 17+
- Maven 3.6+
- Tomcat 10+ (optionnel, mais recommandé)

### Étapes

1. **Naviguer vers le répertoire du projet**
   ```bash
   cd /home/vats/Documents/GitHub/projet_2_visa_fo
   ```

2. **Compiler le projet**
   ```bash
   mvn clean package
   ```

3. **Lancer avec Tomcat (méthode rapide)**
   ```bash
   mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run
   ```
   
   Le serveur démarre sur : **http://localhost:8081**

4. **Accéder au formulaire**
   ```
   http://localhost:8081/projet_2_visa_fo/src/main/webapp/demande-visa-long-sejour.html
   ```

### Déploiement manuel sur Tomcat

1. Compiler : `mvn clean package`
2. Copier le WAR généré vers `$CATALINA_HOME/webapps/`
3. Redémarrer Tomcat

## Configuration de l'API Back Office

Avant d'utiliser le formulaire, assurez-vous que :

1. **Le Back Office est en cours d'exécution**
   ```bash
   cd /home/vats/Documents/GitHub/projet_2_visa_bo/app
   mvn spring-boot:run
   ```

2. **L'URL de l'API est correctement configurée**
   
   Éditez `/src/main/webapp/config.js` :
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'http://localhost:8080',  // Remplacez par l'URL correcte
       ENDPOINT: '/api/visa/demande_transformation',
       TIMEOUT: 30000,
       DEBUG: true
   };
   ```

## Fichiers clés

| Fichier | Description |
|---------|-------------|
| `src/main/webapp/demande-visa-long-sejour.html` | Formulaire principal de demande |
| `src/main/webapp/config.js` | Configuration de l'API Back Office |
| `pom.xml` | Configuration Maven |

## Données envoyées à l'API

Le formulaire envoie les données au format JSON correspondant à la structure `DemandeDTO` du Back Office :

```json
POST /api/visa/demande_transformation
Content-Type: application/json

{
  "typeDemande": "TRANSFORMATION",
  "categorieVisa": "TRAVAILLEUR|INVESTISSEUR|REGROUPEMENT",
  "lastName": "...",
  "firstNames": "...",
  "birthDate": "2000-01-15",
  ...
}
```

## Intégration avec le Back Office

- **Endpoint** : POST `/api/visa/demande_transformation`
- **CORS** : Activé (toutes les origines acceptées)
- **Format** : JSON

Pour plus de détails sur l'intégration complète, consultez :
- `../INTEGRATION_GUIDE.md` - Guide d'intégration complet
- `../projet_2_visa_bo/README.md` - Documentation du Back Office

## Dépannage

### Le formulaire ne s'envoie pas

1. Vérifiez la console du navigateur (F12)
2. Vérifiez que le Back Office est en cours d'exécution sur `http://localhost:8080`
3. Vérifiez l'URL dans `config.js`

### Erreur de connexion

```
Erreur lors de l'envoi à l'API:
Assurez-vous que le back office est en cours d'exécution sur http://localhost:8080
```

**Solution** :
- Vérifiez que le Back Office démarre avec `mvn spring-boot:run`
- Vérifiez que la base de données PostgreSQL est accessible
