@echo off
REM Script de démarrage pour Front Office et Back Office (Windows)
REM Usage: start-all.bat [option]
REM Options: bo (back office), fo (front office), all (défaut)

setlocal enabledelayedexpansion

REM Couleurs pour Windows 10+
set BO_DIR=%~dp0projet_2_visa_bo\app
set FO_DIR=%~dp0projet_2_visa_fo

set OPTION=%1
if "%OPTION%"=="" set OPTION=all

REM Titre
cls
color 0A
echo.
echo ================================
echo Integration Front Office Back Office
echo ================================
echo.

REM Vérifier Maven
where mvn >nul 2>&1
if errorlevel 1 (
    color 0C
    echo X Maven n'est pas installe
    echo.
    echo Installez Maven depuis : https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Vérifier Java
where java >nul 2>&1
if errorlevel 1 (
    color 0C
    echo X Java n'est pas installe
    echo.
    echo Installez Java 17+ depuis : https://adoptium.net/
    pause
    exit /b 1
)

echo + Maven trouve
echo + Java trouve
echo.

REM Démarrage selon l'option
if /i "%OPTION%"=="bo" (
    goto START_BO
) else if /i "%OPTION%"=="fo" (
    goto START_FO
) else if /i "%OPTION%"=="all" (
    goto START_ALL
) else (
    color 0C
    echo X Option invalide: %OPTION%
    echo.
    echo Usage: start-all.bat [bo^|fo^|all]
    echo.
    pause
    exit /b 1
)

:START_ALL
REM Lancer le Back Office
start "Back Office - Maven" cmd /k "cd /d "%BO_DIR%" && mvn spring-boot:run"
timeout /t 3 /nobreak

REM Lancer le Front Office
start "Front Office - Maven" cmd /k "cd /d "%FO_DIR%" && mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run"
goto DONE

:START_BO
start "Back Office - Maven" cmd /k "cd /d "%BO_DIR%" && mvn spring-boot:run"
goto DONE

:START_FO
start "Front Office - Maven" cmd /k "cd /d "%FO_DIR%" && mvn org.apache.tomcat.maven:tomcat7-maven-plugin:2.2:run"
goto DONE

:DONE
cls
color 0A
echo.
echo ================================
echo Demarrage termine
echo ================================
echo.
echo Back Office  : http://localhost:8080
echo Front Office : http://localhost:8081/projet_2_visa_fo
echo.
echo Les applications se lancent dans des fenetres separees...
echo.
echo Assurez-vous que :
echo 1. PostgreSQL est en cours d'execution
echo 2. Les deux fenetres sont demarrees sans erreur
echo 3. Attendez 30 secondes pour que les serveurs soient prets
echo.
pause
