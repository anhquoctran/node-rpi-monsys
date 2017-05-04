SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rpi-monsys`
--
CREATE DATABASE IF NOT EXISTS `rpi-monsys` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `rpi-monsys`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetAllUsers` ()  NO SQL
SELECT U.id, U.username, U.fullname, U.email, U.email, U.birthdate, U.phone, U.hometown, U.wherenow, U.bio, U.description, A.path, R.name, R.description FROM rpi_user U LEFT JOIN rpi_avatar A ON U.avatarId = A.id LEFT JOIN rpi_roles R ON U.roleId = R.id WHERE A.isdeleted = 0 AND A.inused = 1 AND U.isdeleted = 0$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetUserByUsernameOrEmail` (IN `usernameOrEmail` VARCHAR(60), IN `password` VARCHAR(1024))  NO SQL
SELECT U.id,
	   U.username,
       U.email,
       U.fullname 
FROM rpi_user U
WHERE U.username 
LIKE usernameOrEmail
OR U.username
LIKE usernameOrEmail
AND U.password = password
AND U.isdeleted = 0
AND U.isbanned = 0$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rpi_avatar`
--

CREATE TABLE IF NOT EXISTS `rpi_avatar` (
  `id` int(11) NOT NULL,
  `filename` int(11) NOT NULL,
  `filesize` int(11) NOT NULL,
  `dateupload` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `isdeleted` tinyint(1) NOT NULL DEFAULT '0',
  `inused` tinyint(1) NOT NULL DEFAULT '0',
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rpi_roles`
--

CREATE TABLE IF NOT EXISTS `rpi_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rpi_sessions`
--

CREATE TABLE IF NOT EXISTS `rpi_sessions` (
  `id` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `key_data` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `datetime` date NOT NULL,
  `client` varchar(24) COLLATE utf8_unicode_ci NOT NULL,
  `mac` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rpi_user`
--

CREATE TABLE IF NOT EXISTS `rpi_user` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(24) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `fullname` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `birthdate` date DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `hometown` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `wherenow` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `avatarId` int(11) NOT NULL,
  `isbanned` tinyint(1) NOT NULL DEFAULT '0',
  `isdeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;