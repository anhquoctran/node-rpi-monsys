-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 16, 2017 at 08:32 AM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rpi-monsys`
--
CREATE DATABASE IF NOT EXISTS `rpi-monsys` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `rpi-monsys`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `procGetActivities`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetActivities` (IN `username` VARCHAR(24))  BEGIN
	SELECT U.id ID,
		   U.username,
           V.isverified Verified,
           V.createdAt CreatedAt,
           V.verifiedAt VerifiedAt,
           V.firstLoginAt FirstLoginAt,
           V.firstVisitedDashboard FirstVisitedDashboard,
           V.hasUploadedAvatar HasFirstAvatar
    FROM rpi_user U
    LEFT JOIN rpi_verification V
    ON V.idUser = U.id
    WHERE U.username = username COLLATE utf8_general_ci;
END$$

DROP PROCEDURE IF EXISTS `procGetAllUsers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetAllUsers` ()  SELECT U.id ID, 
	   U.username Username,
       U.fullname Fullname,
       U.email Email, 
       U.birthdate Birthdate, 
       U.phone Phone, 
       U.hometown Hometown, 
       U.wherenow Live, 
       U.bio Bio, 
       U.description Description, 
       A.path AvatarPath,
       A.dateupload AvatarDateUpload,
       R.rolename Role, 
       R.description RoleDescription,
       V.isverified Verified
FROM rpi_user U 
LEFT JOIN rpi_avatar A 
ON U.id = A.userId 
LEFT JOIN rpi_roles R 
ON U.roleId = R.id
LEFT JOIN rpi_verification V
ON U.id = V.idUser
WHERE U.isdeleted = 0
AND A.inused = 1 
AND A.isdeleted = 0$$

DROP PROCEDURE IF EXISTS `procGetNotificationOfUser`$$
CREATE DEFINER=`root`@`%` PROCEDURE `procGetNotificationOfUser` (IN `username` VARCHAR(24))  BEGIN
	SELECT U.id ID, 
		   U.username Username, 
		   U.fullname Fullname,
           N.id IDNotification,
           N.content Content,
           N.datetime_activity NotiDateTime,
           N.isread IsRead
	FROM   rpi_user U
		   LEFT JOIN rpi_avatar A
		   ON U.id = A.userId
		   LEFT JOIN rpi_roles R
		   ON U.roleId = R.id
           LEFT JOIN rpi_notifications N
           ON U.id = N.idUser
    WHERE U.username = username COLLATE utf8_general_ci;
END$$

DROP PROCEDURE IF EXISTS `procGetOneUsers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetOneUsers` (IN `username` VARCHAR(24))  BEGIN
	SELECT U.id ID,
		   U.username Username, 
           U.fullname Fullname,
           U.email Email,
           U.birthdate Birthdate, 
           U.hometown HomeTown, 
           U.wherenow CurrentCity, 
           U.bio Bio, 
           U.description Description,
           U.phone Phone, 
           R.rolename Role, 
           A.path AvatarPath,
           A.dateupload AvatarDateUpload,
           V.isverified Verified,
           V.createdAt CreateAt,
           V.verifiedAt VerifiedAt,
           V.firstLoginAt FirstLogin,
           V.firstVisitedDashboard FirstVisitedDashBoard,
           V.hasUploadedAvatar HashUploadedAvatar
    FROM rpi_user U 
		LEFT JOIN rpi_roles R
		ON R.id = U.roleId
        LEFT JOIN rpi_avatar A
		ON A.userId = U.id
		LEFT JOIN rpi_verification V
		ON V.idUser = U.id
    WHERE U.username = username COLLATE utf8_unicode_ci;
END$$

DROP PROCEDURE IF EXISTS `procGetRelevantInformationOfUser`$$
CREATE DEFINER=`root`@`%` PROCEDURE `procGetRelevantInformationOfUser` (IN `username` VARCHAR(24))  BEGIN
	SELECT U.id ID, 
		   U.username Username, 
		   U.fullname Fullname, 
           A.path AvatarPath,
           R.rolename RoleName
	FROM   rpi_user U
		   RIGHT JOIN rpi_avatar A
		   ON A.userId = U.id
		   RIGHT JOIN rpi_roles R
		   ON R.id = U.roleId
    WHERE U.username = username;
END$$

DROP PROCEDURE IF EXISTS `procGetSessionFromDateToDate`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetSessionFromDateToDate` (IN `fromDate` DATE, IN `toDate` DATE)  BEGIN
	SELECT S.id ID, S.name SessionName, S.key_data KeyData, S.datetime DateTimeRequest, S.client IP, S.mac MacAddress 
    FROM rpi_sessions S
    WHERE datetime 
    between fromDate 
    and toDate;
END$$

DROP PROCEDURE IF EXISTS `procGetUserByUsernameOrEmail`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetUserByUsernameOrEmail` (IN `usernameOrEmail` VARCHAR(60), IN `password` VARCHAR(1024))  NO SQL
SELECT U.id ID,
	   U.username Username,
       U.email Email,
       U.fullname Fullname 
FROM rpi_user U
WHERE U.username 
LIKE usernameOrEmail
OR U.username
LIKE usernameOrEmail
AND U.password LIKE password
AND U.isdeleted = 0
AND U.isbanned = 0$$

DROP PROCEDURE IF EXISTS `procGetUserIfAdmin`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `procGetUserIfAdmin` ()  BEGIN
	SELECT U.id ID,
		   U.username Username, 
		   U.fullname Fullname,
		   U.email Email,
		   U.birthdate Birthdate,
		   U.wherenow Live, 
		   U.hometown Hometown, 
		   U.phone Phone, 
		   U.bio Bio, 
		   U.description Description, 
		   R.rolename Role,
		   A.path AvatarPath,
           A.dateupload AvatarDateUpload,
           V.isverified Verified
	FROM rpi_user U 
	LEFT JOIN rpi_roles R
	ON U.roleId = R.id
	LEFT JOIN rpi_avatar A
	ON U.id = A.id
    RIGHT JOIN rpi_verification V
    ON U.id = V.idUser
	WHERE U.roleId = 1;
END$$

DROP PROCEDURE IF EXISTS `procMarkAsRead`$$
CREATE DEFINER=`root`@`%` PROCEDURE `procMarkAsRead` (IN `id` INT)  BEGIN
	UPDATE rpi_notifications SET isread = 1 WHERE id = id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rpi_avatar`
--
-- Creation: May 10, 2017 at 09:35 AM
--

DROP TABLE IF EXISTS `rpi_avatar`;
CREATE TABLE IF NOT EXISTS `rpi_avatar` (
  `id` int(11) NOT NULL,
  `filename` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `filesize` int(11) NOT NULL,
  `dateupload` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `isdeleted` tinyint(1) NOT NULL DEFAULT '0',
  `inused` tinyint(1) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL,
  `rpi_user_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`rpi_user_id`),
  UNIQUE KEY `filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_avatar`:
--

-- --------------------------------------------------------

--
-- Table structure for table `rpi_menu`
--
-- Creation: May 10, 2017 at 09:35 AM
--

DROP TABLE IF EXISTS `rpi_menu`;
CREATE TABLE IF NOT EXISTS `rpi_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `idRole` int(11) NOT NULL,
  `rpi_roles_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`rpi_roles_id`),
  KEY `fk_rpi_menu_rpi_roles1_idx` (`rpi_roles_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_menu`:
--

-- --------------------------------------------------------

--
-- Table structure for table `rpi_notifications`
--
-- Creation: May 13, 2017 at 09:16 AM
--

DROP TABLE IF EXISTS `rpi_notifications`;
CREATE TABLE IF NOT EXISTS `rpi_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `datetime_activity` datetime NOT NULL,
  `idUser` int(11) NOT NULL,
  `isread` tinyint(1) NOT NULL DEFAULT '0',
  `rpi_user_id` int(10) UNSIGNED NOT NULL,
  `rpi_user_rpi_roles_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`rpi_user_id`,`rpi_user_rpi_roles_id`),
  KEY `fk_rpi_notifications_rpi_user1_idx` (`rpi_user_id`,`rpi_user_rpi_roles_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_notifications`:
--

-- --------------------------------------------------------

--
-- Table structure for table `rpi_roles`
--
-- Creation: May 06, 2017 at 03:27 AM
--

DROP TABLE IF EXISTS `rpi_roles`;
CREATE TABLE IF NOT EXISTS `rpi_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_roles`:
--

--
-- Dumping data for table `rpi_roles`
--

INSERT INTO `rpi_roles` (`id`, `rolename`, `description`) VALUES
(1, 'Admin', 'Administrator'),
(2, 'User', 'User');

-- --------------------------------------------------------

--
-- Table structure for table `rpi_sessions`
--
-- Creation: May 04, 2017 at 02:27 PM
--

DROP TABLE IF EXISTS `rpi_sessions`;
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

--
-- RELATIONS FOR TABLE `rpi_sessions`:
--

-- --------------------------------------------------------

--
-- Table structure for table `rpi_settings`
--
-- Creation: May 15, 2017 at 06:44 AM
--

DROP TABLE IF EXISTS `rpi_settings`;
CREATE TABLE IF NOT EXISTS `rpi_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lang` char(2) NOT NULL,
  `notification` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELATIONS FOR TABLE `rpi_settings`:
--

-- --------------------------------------------------------

--
-- Table structure for table `rpi_user`
--
-- Creation: May 04, 2017 at 03:50 PM
--

DROP TABLE IF EXISTS `rpi_user`;
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
  `isbanned` tinyint(1) NOT NULL DEFAULT '0',
  `isdeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_user`:
--

--
-- Dumping data for table `rpi_user`
--

INSERT INTO `rpi_user` (`id`, `username`, `password`, `fullname`, `email`, `birthdate`, `phone`, `hometown`, `wherenow`, `bio`, `description`, `roleId`, `isbanned`, `isdeleted`) VALUES
(1, 'anhquoctran', 'E3142133E67A1E73802DE2502FCDABAB9BBF0D79C6DE4BD9F76201F42955DEEA6C7A3AC88CDCFF2C9733E6651F5A34D1F22CEB9EF7A6CC8D4CB5F89703046309', 'Anh Quoc Tran', 'aquoc.hue@outlook.com', '1996-08-19', '0918910735', 'Hue, Vietnam', 'Hue, Vietnam', 'Nothing to describe', NULL, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rpi_verification`
--
-- Creation: May 13, 2017 at 09:55 AM
--

DROP TABLE IF EXISTS `rpi_verification`;
CREATE TABLE IF NOT EXISTS `rpi_verification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `isverified` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verifiedAt` datetime NOT NULL,
  `firstLoginAt` datetime NOT NULL,
  `firstVisitedDashboard` datetime NOT NULL,
  `hasUploadedAvatar` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idUser_UNIQUE` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELATIONS FOR TABLE `rpi_verification`:
--

--
-- Dumping data for table `rpi_verification`
--

INSERT INTO `rpi_verification` (`id`, `idUser`, `isverified`, `createdAt`, `verifiedAt`, `firstLoginAt`, `firstVisitedDashboard`, `hasUploadedAvatar`) VALUES
(1, 1, 1, '2017-05-15 02:37:49', '2017-05-14 00:00:00', '2017-05-14 18:14:31', '2017-05-14 19:31:13', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
