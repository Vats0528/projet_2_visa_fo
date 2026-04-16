# Démarrage Rapide

## Prérequis

- Java 17+ [Telecharger](https://adoptium.net/)
- Maven 3.6+ [Telecharger](https://maven.apache.org/download.cgi)
- PostgreSQL 12+ [Telecharger](https://www.postgresql.org/download/)

Vérifiez l'installation :
```bash
java -version
mvn -version
```

## Démarrer PostgreSQL

### Linux
```bash
sudo service postgresql start
# ou
systemctl start postgresql
```

### macOS (Homebrew)
```bash
brew services start postgresql
```

### Windows
- Double-cliquez sur PostgreSQL depuis les services
- Ou utilisez pgAdmin

## Créer la base de données (première fois uniquement)

```bash
# Créer la base
createdb -U postgres -W visa_db

# Entrez le mot de passe : aki
```

## Lancer les applications

### Option A : Script automatisé (Recommended)

**Linux/Mac** :
```bash
cd /home/vats/Documents/GitHub
chmod +x start-all.sh
./start-all.sh all
```

**Windows** :
```bash
cd C:\Users\...\projet_2_visa
start-all.bat all
```

### Option B : Manuellement

**Terminal 1 - Back Office**
```bash
cd projet_2_visa_bo/app
mvn spring-boot:run
```

**Terminal 2 - Front Office**
```bash
cd projet_2_visa_fo
mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run
```

## Accéder à l'application

1. **Page d'accueil** : http://localhost:8081/projet_2_visa_fo/index.html
2. **Formulaire** : http://localhost:8081/projet_2_visa_fo/demande-visa-long-sejour.html
3. **Back Office API** : http://localhost:8080/api/visa/demande_transformation

## Remplir le formulaire

1. Cliquez sur "Nouvelle Demande"
2. Remplissez les informations personnelles
3. Sélectionnez votre catégorie (Travailleur, Investisseur, Regroupement familial)
4. Cochez les documents fournis
5. Cliquez sur "Soumettre la Demande"

```
✓ Succès ! Demande créée avec l'ID : DEM-2024-001
```

## Configuration de l'API

Si le Back Office tourne sur une autre URL, modifiez config.js :

```javascript
// projet_2_visa_fo/src/main/webapp/config.js

const API_CONFIG = {
    BASE_URL: 'http://votre-serveur:8080',  // Changez ici
    ENDPOINT: '/api/visa/demande_transformation',
    TIMEOUT: 30000,
    DEBUG: true
};
```

## Dépannage

### "Connection refused"
- Verifiez que le Back Office est lancé
- Verifiez l'URL dans config.js

### "Database error"
- Verifiez que PostgreSQL est lancé
- Verifiez que la base visa_db existe
- Verifiez les identifiants : username=postgres, password=aki

### "Port already in use"
- Changez le port dans la configuration
- Ou arrêtez l'application qui utilise le port

### Formulaire ne s'envoie pas
- Ouvrez la console (F12)
- Verifiez les erreurs
- Consultez INTEGRATION_GUIDE.md

## Documentation complète

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Guide complet
- [projet_2_visa_fo/README_FO.md](./README_FO.md) - Front Office
- [projet_2_visa_fo/MAPPAGE_DONNEES.md](./MAPPAGE_DONNEES.md) - Donnees

## Checklist de démarrage

- [ ] Java installé (java -version)
- [ ] Maven installé (mvn -version)
- [ ] PostgreSQL lancé
- [ ] Base de données créée (visa_db)
- [ ] Back Office lancé (port 8080)
- [ ] Front Office lancé (port 8081)
- [ ] Navigateur ouvert sur http://localhost:8081/projet_2_visa_fo
- [ ] Formulaire accessible et prêt à l'emploi

## Procédure complète (5 minutes)

```bash
# 1. Ouvrir un terminal
cd /home/vats/Documents/GitHub

# 2. Lancer les deux projets
./start-all.sh all        # Linux/Mac
# ou
start-all.bat all         # Windows

# 3. Attendre 30 secondes
# You should see two new windows starting up

# 4. Ouvrir le navigateur
# http://localhost:8081/projet_2_visa_fo/index.html

# 5. Cliquer sur "Nouvelle Demande" et remplir le formulaire

# 6. Soumettre et voir la confirmation !
```

C'est tout!

---

Besoin d'aide ?
1. Consultez INTEGRATION_GUIDE.md
2. Verifiez les logs dans les fenetres de terminal
3. Verifiez F12 (console du navigateur)

Pret a commencer ?
[Lancer les applications](./README.md)
