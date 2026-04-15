#!/bin/bash

APP_NAME="projet_2_visa_fo"
WAR_NAME="$APP_NAME-1.0-SNAPSHOT.war"
BUILD_DIR="target"
LIB_DIR="lib"
TOMCAT_WEBAPPS="/opt/tomcat10/webapps"
TOMCAT_BIN="/opt/tomcat10/bin"

echo "Verification de l'environnement Java"
java -version
echo ""

echo "Verification de la presence du framework JAR"
if [ ! -f "$LIB_DIR/mvc-framework-1.0.0.jar" ]; then
    echo "ERREUR: $LIB_DIR/mvc-framework-1.0.0.jar n'existe pas."
    exit 1
fi
echo "OK: Framework JAR trouve"

echo "Verification de l'acces a Tomcat 10"
if [ ! -d "$TOMCAT_WEBAPPS" ]; then
    echo "ERREUR: Repertoire Tomcat 10 non trouve: $TOMCAT_WEBAPPS"
    exit 1
fi
echo "OK: Acces Tomcat 10 OK"

echo "Construction du projet"
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "ERREUR lors de la construction Maven"
    exit 1
fi

WAR_FILE="$BUILD_DIR/$WAR_NAME"
if [ ! -f "$WAR_FILE" ]; then
    echo "ERREUR: WAR non trouve: $WAR_FILE"
    ls -la $BUILD_DIR/
    exit 1
fi
echo "OK: WAR genere avec succes"

echo "Arret de Tomcat 10..."
if ps aux | grep -v grep | grep tomcat10 > /dev/null; then
    $TOMCAT_BIN/shutdown.sh 2>/dev/null
    sleep 2
    if ps aux | grep -v grep | grep tomcat10 > /dev/null; then
        pkill -f tomcat10
    fi
fi

echo "Nettoyage de l'ancienne application..."
sudo rm -rf "$TOMCAT_WEBAPPS/$APP_NAME" "$TOMCAT_WEBAPPS/$APP_NAME.war" 2>/dev/null
rm -rf "$TOMCAT_WEBAPPS/$APP_NAME" "$TOMCAT_WEBAPPS/$APP_NAME.war" 2>/dev/null

echo "Deploiement de l'application..."
sudo cp "$WAR_FILE" "$TOMCAT_WEBAPPS/$APP_NAME.war" 2>/dev/null || cp "$WAR_FILE" "$TOMCAT_WEBAPPS/$APP_NAME.war"
if [ $? -ne 0 ]; then
    echo "ERREUR lors du deploiement"
    exit 1
fi
echo "OK: Application deployee"

echo "Demarrage de Tomcat 10..."
$TOMCAT_BIN/startup.sh 2>/dev/null
echo "Tomcat demarre"

echo "Attente du deploiement (15 secondes)..."
sleep 15

echo ""
echo "Deploiement termine!"
echo "URL: http://localhost:8080/$APP_NAME/demande-visa-long-sejour.html"
