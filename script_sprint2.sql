-- ============================================================================
-- VISA BO - SCRIPT SQL POSTGRESQL COMPLET
-- Généré à partir des entités JPA le 2026-04-27
-- Version 100% Compatible Hibernate/Spring Boot
-- ============================================================================

-- Nettoyage initial
DROP VIEW IF EXISTS v_avancement_demande CASCADE;
DROP TABLE IF EXISTS demande_piece CASCADE;
DROP TABLE IF EXISTS visa_passeport CASCADE;
DROP TABLE IF EXISTS piece_demande CASCADE;
DROP TABLE IF EXISTS demande CASCADE;
DROP TABLE IF EXISTS etat_civil CASCADE;
DROP TABLE IF EXISTS visa_transformable CASCADE;
DROP TABLE IF EXISTS visa CASCADE;
DROP TABLE IF EXISTS carte_resident CASCADE;
DROP TABLE IF EXISTS passeport CASCADE;
DROP TABLE IF EXISTS demandeur CASCADE;
DROP TABLE IF EXISTS piece CASCADE;
DROP TABLE IF EXISTS type_demande CASCADE;
DROP TABLE IF EXISTS status_dm CASCADE;
DROP TABLE IF EXISTS type_visa CASCADE;
DROP TABLE IF EXISTS situation_fam CASCADE;
DROP TABLE IF EXISTS nationalite CASCADE;
DROP TABLE IF EXISTS categorie_piece CASCADE;

-- Supprimer les séquences
DROP SEQUENCE IF EXISTS seq_categorie_piece;
DROP SEQUENCE IF EXISTS seq_carte_resident;
DROP SEQUENCE IF EXISTS seq_nationalite;
DROP SEQUENCE IF EXISTS seq_passeport;
DROP SEQUENCE IF EXISTS seq_piece;
DROP SEQUENCE IF EXISTS seq_situation_fam;
DROP SEQUENCE IF EXISTS seq_type_visa;
DROP SEQUENCE IF EXISTS seq_status_dm;
DROP SEQUENCE IF EXISTS seq_visa;
DROP SEQUENCE IF EXISTS seq_type_demande;
DROP SEQUENCE IF EXISTS seq_visa_transformable;
DROP SEQUENCE IF EXISTS seq_etat_civil;
DROP SEQUENCE IF EXISTS seq_demandeur;
DROP SEQUENCE IF EXISTS seq_demande;

-- ============================================================================
-- CRÉATION DES SÉQUENCES (pour les IDENTITY en PostgreSQL)
-- ============================================================================

CREATE SEQUENCE seq_categorie_piece START 1 INCREMENT 1;
CREATE SEQUENCE seq_carte_resident START 1 INCREMENT 1;
CREATE SEQUENCE seq_nationalite START 1 INCREMENT 1;
CREATE SEQUENCE seq_passeport START 1 INCREMENT 1;
CREATE SEQUENCE seq_piece START 1 INCREMENT 1;
CREATE SEQUENCE seq_situation_fam START 1 INCREMENT 1;
CREATE SEQUENCE seq_type_visa START 1 INCREMENT 1;
CREATE SEQUENCE seq_status_dm START 1 INCREMENT 1;
CREATE SEQUENCE seq_visa START 1 INCREMENT 1;
CREATE SEQUENCE seq_type_demande START 1 INCREMENT 1;
CREATE SEQUENCE seq_visa_transformable START 1 INCREMENT 1;
CREATE SEQUENCE seq_etat_civil START 1 INCREMENT 1;
CREATE SEQUENCE seq_demandeur START 1 INCREMENT 1;
CREATE SEQUENCE seq_demande START 10000 INCREMENT 1;

-- ============================================================================
-- TABLES DE RÉFÉRENCE (sans dépendances)
-- ============================================================================

CREATE TABLE categorie_piece (
    id_categorie_piece BIGINT PRIMARY KEY DEFAULT nextval('seq_categorie_piece'),
    libelle VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE situation_fam (
    id_situation_fam BIGINT PRIMARY KEY DEFAULT nextval('seq_situation_fam'),
    situation_fam VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nationalite (
    id_nationalite BIGINT PRIMARY KEY DEFAULT nextval('seq_nationalite'),
    nationalite VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE type_visa (
    id_type_visa BIGINT PRIMARY KEY DEFAULT nextval('seq_type_visa'),
    libelle VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE type_demande (
    id_type_dm BIGINT PRIMARY KEY DEFAULT nextval('seq_type_demande'),
    nom_type_dm VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status_dm (
    id_status_dm BIGINT PRIMARY KEY DEFAULT nextval('seq_status_dm'),
    status_dm VARCHAR(50),
    observation VARCHAR(250),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE PIÈCE
-- ============================================================================

CREATE TABLE piece (
    id_piece BIGINT PRIMARY KEY DEFAULT nextval('seq_piece'),
    id_categorie_piece BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_piece_categorie_piece FOREIGN KEY (id_categorie_piece)
        REFERENCES categorie_piece(id_categorie_piece) ON DELETE RESTRICT
);

-- ============================================================================
-- TABLE DEMANDEUR (nœud central)
-- ============================================================================

CREATE TABLE demandeur (
    id_demandeur BIGINT PRIMARY KEY DEFAULT nextval('seq_demandeur'),
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50),
    date_naissance DATE,
    lieu_naissance VARCHAR(50),
    id_piece BIGINT,
    id_situation_fam BIGINT,
    id_nationalite BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_demandeur_piece FOREIGN KEY (id_piece)
        REFERENCES piece(id_piece) ON DELETE SET NULL,
    CONSTRAINT fk_demandeur_situation_fam FOREIGN KEY (id_situation_fam)
        REFERENCES situation_fam(id_situation_fam) ON DELETE SET NULL,
    CONSTRAINT fk_demandeur_nationalite FOREIGN KEY (id_nationalite)
        REFERENCES nationalite(id_nationalite) ON DELETE SET NULL
);

-- ============================================================================
-- TABLES DÉPENDANT DE DEMANDEUR
-- ============================================================================

CREATE TABLE passeport (
    id_passeport BIGINT PRIMARY KEY DEFAULT nextval('seq_passeport'),
    num_passeport INTEGER,
    date_expiration DATE,
    date_delivrance VARCHAR(50),
    id_demandeur BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_passeport_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE
);

CREATE TABLE carte_resident (
    id_carte_resident BIGINT PRIMARY KEY DEFAULT nextval('seq_carte_resident'),
    num INTEGER,
    id_demandeur BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carte_resident_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE
);

CREATE TABLE visa (
    id_visa BIGINT PRIMARY KEY DEFAULT nextval('seq_visa'),
    num_visa VARCHAR(50),
    date_delivrance DATE,
    date_expiration DATE,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50),
    reference VARCHAR(50),
    date_modification VARCHAR(50),
    id_type_visa BIGINT NOT NULL,
    id_demandeur BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visa_type_visa FOREIGN KEY (id_type_visa)
        REFERENCES type_visa(id_type_visa) ON DELETE RESTRICT,
    CONSTRAINT fk_visa_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE
);

CREATE TABLE visa_transformable (
    id_visa_transformable BIGINT PRIMARY KEY DEFAULT nextval('seq_visa_transformable'),
    num_visa VARCHAR(50),
    date_delivrance DATE,
    date_expiration DATE,
    id_passeport BIGINT NOT NULL,
    id_demandeur BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visa_transformable_passeport FOREIGN KEY (id_passeport)
        REFERENCES passeport(id_passeport) ON DELETE CASCADE,
    CONSTRAINT fk_visa_transformable_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE
);

CREATE TABLE etat_civil (
    id_etat_civil BIGINT PRIMARY KEY DEFAULT nextval('seq_etat_civil'),
    id_demandeur BIGINT NOT NULL UNIQUE,
    nom VARCHAR(255),
    prenoms VARCHAR(255),
    nom_jeune_fille VARCHAR(255),
    date_naissance DATE,
    situation_famille VARCHAR(100),
    nationalite VARCHAR(100),
    domicile_habituel VARCHAR(500),
    profession VARCHAR(255),
    employeur VARCHAR(255),
    adresse_employeur VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_etat_civil_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE DEMANDE
-- ============================================================================

CREATE TABLE demande (
    id_demande BIGINT PRIMARY KEY DEFAULT nextval('seq_demande'),
    created_at DATE,
    updated_at DATE,
    id_demandeur BIGINT NOT NULL,
    id_status_dm BIGINT NOT NULL,
    id_type_dm BIGINT NOT NULL,
    CONSTRAINT fk_demande_demandeur FOREIGN KEY (id_demandeur)
        REFERENCES demandeur(id_demandeur) ON DELETE CASCADE,
    CONSTRAINT fk_demande_status_dm FOREIGN KEY (id_status_dm)
        REFERENCES status_dm(id_status_dm) ON DELETE RESTRICT,
    CONSTRAINT fk_demande_type_demande FOREIGN KEY (id_type_dm)
        REFERENCES type_demande(id_type_dm) ON DELETE RESTRICT
);

-- ============================================================================
-- TABLES DE JONCTION (clés composées)
-- ============================================================================

CREATE TABLE piece_demande (
    id_type_dm BIGINT NOT NULL,
    id_categorie_piece BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_type_dm, id_categorie_piece),
    CONSTRAINT fk_piece_demande_type_demande FOREIGN KEY (id_type_dm)
        REFERENCES type_demande(id_type_dm) ON DELETE CASCADE,
    CONSTRAINT fk_piece_demande_categorie_piece FOREIGN KEY (id_categorie_piece)
        REFERENCES categorie_piece(id_categorie_piece) ON DELETE CASCADE
);

CREATE TABLE visa_passeport (
    id_visa BIGINT NOT NULL,
    id_passeport BIGINT NOT NULL,
    status_liaison VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_visa, id_passeport),
    CONSTRAINT fk_visa_passeport_visa FOREIGN KEY (id_visa)
        REFERENCES visa(id_visa) ON DELETE CASCADE,
    CONSTRAINT fk_visa_passeport_passeport FOREIGN KEY (id_passeport)
        REFERENCES passeport(id_passeport) ON DELETE CASCADE
);

CREATE TABLE demande_piece (
    id_demande BIGINT NOT NULL,
    id_categorie_piece BIGINT NOT NULL,
    is_provided BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_demande, id_categorie_piece),
    CONSTRAINT fk_demande_piece_demande FOREIGN KEY (id_demande)
        REFERENCES demande(id_demande) ON DELETE CASCADE,
    CONSTRAINT fk_demande_piece_categorie_piece FOREIGN KEY (id_categorie_piece)
        REFERENCES categorie_piece(id_categorie_piece) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_piece_categorie_piece ON piece(id_categorie_piece);
CREATE INDEX idx_demandeur_piece ON demandeur(id_piece);
CREATE INDEX idx_demandeur_situation_fam ON demandeur(id_situation_fam);
CREATE INDEX idx_demandeur_nationalite ON demandeur(id_nationalite);
CREATE INDEX idx_passeport_demandeur ON passeport(id_demandeur);
CREATE INDEX idx_carte_resident_demandeur ON carte_resident(id_demandeur);
CREATE INDEX idx_visa_type_visa ON visa(id_type_visa);
CREATE INDEX idx_visa_demandeur ON visa(id_demandeur);
CREATE INDEX idx_visa_transformable_passeport ON visa_transformable(id_passeport);
CREATE INDEX idx_visa_transformable_demandeur ON visa_transformable(id_demandeur);
CREATE INDEX idx_etat_civil_demandeur ON etat_civil(id_demandeur);
CREATE INDEX idx_demande_demandeur ON demande(id_demandeur);
CREATE INDEX idx_demande_status_dm ON demande(id_status_dm);
CREATE INDEX idx_demande_type_demande ON demande(id_type_dm);

-- ============================================================================
-- DONNÉES D'INITIALISATION
-- ============================================================================

INSERT INTO categorie_piece (libelle) VALUES
    ('Passeport'),
    ('Carte d''identité'),
    ('Carte de résident'),
    ('Visa'),
    ('Attestation d''emploi'),
    ('Relevé bancaire'),
    ('Certificat de naissance'),
    ('Acte de mariage');

INSERT INTO situation_fam (situation_fam) VALUES
    ('Célibataire'),
    ('Marié(e)'),
    ('Divorcé(e)'),
    ('Veuf/Veuve'),
    ('Pacsé(e)'),
    ('Concubinage');

INSERT INTO nationalite (nationalite) VALUES
    ('Française'),
    ('Suisse'),
    ('Belge'),
    ('Luxembourgeoise'),
    ('Allemande'),
    ('Italienne'),
    ('Espagnole'),
    ('Portugaise'),
    ('Néerlandaise'),
    ('Canadienne'),
    ('Américaine'),
    ('Britannique'),
    ('Australienne'),
    ('Japonaise'),
    ('Chinoise');

INSERT INTO type_visa (libelle) VALUES
    ('Visa de court séjour'),
    ('Visa de long séjour'),
    ('Visa étudiant'),
    ('Visa Travailleur'),
    ('Visa Investisseur');

INSERT INTO type_demande (nom_type_dm) VALUES
    ('Première demande'),
    ('Renouvellement'),
    ('Changement de statut'),
    ('Modification'),
    ('Transformation de visa');

INSERT INTO status_dm (status_dm, observation) VALUES
    ('En attente', 'Demande reçue, en cours de traitement'),
    ('En traitement', 'Demande en cours d''examen'),
    ('Acceptée', 'Demande approuvée'),
    ('Rejetée', 'Demande refusée'),
    ('En révision', 'Demande en révision'),
    ('Archivée', 'Demande archivée'),
    ('Suspendue', 'Demande temporairement suspendue');
