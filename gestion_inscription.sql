-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 08 fév. 2025 à 05:17
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_inscription`
--

-- --------------------------------------------------------

--
-- Structure de la table `audit_inscription`
--

DROP TABLE IF EXISTS `audit_inscription`;
CREATE TABLE IF NOT EXISTS `audit_inscription` (
  `id_audit` int NOT NULL AUTO_INCREMENT,
  `type_action` enum('ajout','modification','suppression') DEFAULT NULL,
  `date_mise_a_jour` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int DEFAULT NULL,
  `matricule` varchar(50) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `droit_ancien` decimal(10,2) DEFAULT NULL,
  `droit_nouv` decimal(10,2) DEFAULT NULL,
  `utilisateur` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_audit`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `audit_inscription`
--

INSERT INTO `audit_inscription` (`id_audit`, `type_action`, `date_mise_a_jour`, `id`, `matricule`, `nom`, `droit_ancien`, `droit_nouv`, `utilisateur`) VALUES
(1, 'ajout', '2025-02-07 18:50:15', 4, '1', '2', '4.00', '4.00', 'root@localhost'),
(2, 'ajout', '2025-02-07 18:50:55', 5, '12', '234', '23.00', '23.00', 'root@localhost'),
(3, 'modification', '2025-02-07 18:51:08', 4, '1', '2', '4.00', '4.00', 'root@localhost');

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

DROP TABLE IF EXISTS `inscription`;
CREATE TABLE IF NOT EXISTS `inscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricule` varchar(50) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `droit_inscription` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `inscription`
--

INSERT INTO `inscription` (`id`, `matricule`, `nom`, `droit_inscription`) VALUES
(5, '12', '234', '23.00'),
(4, '1', '2456', '4.00');

--
-- Déclencheurs `inscription`
--
DROP TRIGGER IF EXISTS `after_inscription_delete`;
DELIMITER $$
CREATE TRIGGER `after_inscription_delete` AFTER DELETE ON `inscription` FOR EACH ROW INSERT INTO audit_inscription (type_action, date_mise_a_jour,id,  matricule, nom, droit_ancien, droit_nouv, utilisateur)
VALUES ('suppression', NOW(),OLD.id, OLD.matricule, OLD.nom, OLD.droit_inscription, OLD.droit_inscription, USER())
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `after_inscription_insert`;
DELIMITER $$
CREATE TRIGGER `after_inscription_insert` AFTER INSERT ON `inscription` FOR EACH ROW INSERT INTO audit_inscription (type_action, date_mise_a_jour, id, matricule, nom, droit_ancien, droit_nouv, utilisateur)
VALUES ('ajout', NOW(), NEW.id, NEW.matricule, NEW.nom, NEW.droit_inscription, NEW.droit_inscription, USER())
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `after_inscription_update`;
DELIMITER $$
CREATE TRIGGER `after_inscription_update` AFTER UPDATE ON `inscription` FOR EACH ROW INSERT INTO audit_inscription (type_action, date_mise_a_jour, id, matricule, nom, droit_ancien, droit_nouv, utilisateur)
VALUES ('modification', NOW(),OLD.id, OLD.matricule, OLD.nom, OLD.droit_inscription, NEW.droit_inscription, USER())
$$
DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
