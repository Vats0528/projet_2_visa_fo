# Documentation Front Office - Démarrage

## Guides disponibles

### Pour commencer rapidement
[QUICKSTART.md](./QUICKSTART.md) - Démarrage en 5 minutes

### Documentation détaillée

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Vue d'ensemble du Front Office |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Guide complet d'intégration FO-BO |
| [MAPPAGE_DONNEES.md](./MAPPAGE_DONNEES.md) | Mappage détaillé des données |
| [CHANGELOG.md](./CHANGELOG.md) | Historique des changements |
| [FILESINDEX.md](./FILESINDEX.md) | Index complet des fichiers |

## Démarrage rapide

1. **Lancer le Back Office**
   ```bash
   cd ../projet_2_visa_bo/app
   mvn spring-boot:run
   ```

2. **Lancer le Front Office**
   ```bash
   mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run
   ```

3. **Accéder au formulaire**
   ```
   http://localhost:8081/projet_2_visa_fo/index.html
   ```

## Mode d'emploi

1. **Configuration** - Editez `src/main/webapp/config.js` si nécessaire
2. **Developpement** - Lancez avec Maven Tomcat
3. **Déploiement** - Générez le WAR avec `mvn clean package`
4. **Dépannage** - Consultez [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Architecture

```
FO (HTML + JS)
    |  (HTTP POST / JSON)
    v
BO API (Spring Boot)
    ↓ (SQL)
PostgreSQL DB
```

## Points clés

- **Configuration externalisée** - `config.js`
- **Aucune dépendance au BO** - Architecture découplée
- **CORS activé** - Requêtes cross-origin supportées
- **Transformation auto** - Données transformées en DemandeDTO

## 🆘 Aide

- Consultez [QUICKSTART.md](./QUICKSTART.md) pour les problèmes courants
- Consultez [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) pour l'architecture détaillée
- Consultez la console du navigateur (F12) pour les erreurs

---

**Version** : 1.0  
**Date** : 16 avril 2026
