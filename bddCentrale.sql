CREATE TABLE evenements (
    id_evenement INT NOT NULL AUTO_INCREMENT, 
    nom VARCHAR(50), 
    date_creation DATE, 
    date_debut DATE, 
    date_fin DATE, 
    personnes_maximum INT, 
    lieu VARCHAR(250),
    PRIMARY KEY(id_evenement)
    );

CREATE TABLE inscriptions (
    id_inscription INT NOT NULL AUTO_INCREMENT,
    id_evenement INT,
    prenom VARCHAR(50),
    nom VARCHAR(50),
    date_inscription DATE,
    PRIMARY KEY(id_inscription)
);

ALTER TABLE inscriptions ADD FOREIGN KEY(id_evenement) REFERENCES evenements(id_evenement);

DELIMITER//
CREATE PROCEDURE creation_evenement(IN nom VARCHAR(50), IN date_creation DATE, IN date_debut DATE, IN date_fin DATE, IN personnes_maximum INT, IN lieu VARCHAR(250),)
BEGIN
INSERT INTO evenements VALUES(NULL, nom, date_creation, date_debut, date_fin, personnes_maximum, lieu);
END//

CREATE PROCEDURE inscription(IN id_evenement INT, IN prenom VARCHAR(50), IN nom VARCHAR(50), IN date_inscription DATE)
BEGIN
INSERT INTO inscriptions VALUES(NULL, id_evenement, prenom, nom, date_inscription);
END//

CREATE PROCEDURE desinscription()
BEGIN
DELETE ;
END//

CREATE PROCEDURE supp_evenement()
BEGIN
DELETE ;
END//

CREATE PROCEDURE modif_dateEvenement()
BEGIN
UPDATE ;
END//

DELIMITER;