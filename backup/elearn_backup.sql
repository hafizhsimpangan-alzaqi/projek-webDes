-- MySQL dump 10.13  Distrib 9.7.0, for Linux (x86_64)
--
-- Host: localhost    Database: elearn
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '8aa1a982-61bb-11f1-9691-36dc40b10974:1-26';

--
-- Table structure for table `course_members`
--

DROP TABLE IF EXISTS `course_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `course_members_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `course_members_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_members`
--

LOCK TABLES `course_members` WRITE;
/*!40000 ALTER TABLE `course_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,1,'Pemrograman Web','Belajar HTML CSS dan JavaScript',NULL,'2026-06-08 10:08:42','2026-06-08 10:08:42'),(2,1,'Basis Data','Belajar MySQL dan SQL',NULL,'2026-06-08 10:08:42','2026-06-08 10:08:42'),(3,1,'Node.js Native','Belajar Backend Tanpa Express',NULL,'2026-06-09 06:37:42','2026-06-09 06:37:42');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `module_id` bigint NOT NULL,
  `title` varchar(200) NOT NULL,
  `type` enum('TEXT','VIDEO','FILE') NOT NULL,
  `content` longtext,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,1,'Apa itu HTML','TEXT','HTML adalah bahasa markup',NULL,'2026-06-08 10:09:36'),(2,2,'Video CSS Dasar','VIDEO','https://youtube.com/example',NULL,'2026-06-08 10:09:36'),(3,3,'Modul Database','FILE','/uploads/database.pdf',NULL,'2026-06-08 10:09:36'),(4,1,'Modul HTML PDF','FILE',NULL,'/uploads/html-dasar.pdf','2026-06-08 16:40:31'),(5,1,'Video HTML Dasar','VIDEO','https://youtube.com/watch?v=xxxxx',NULL,'2026-06-08 16:41:00'),(6,5,'Apa itu Node.js','TEXT','Node.js adalah JavaScript Runtime',NULL,'2026-06-09 06:49:34');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `order_no` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (1,1,'Pengenalan HTML','Dasar HTML',1),(2,1,'Pengenalan CSS','Dasar CSS',2),(3,2,'Pengenalan Database','Dasar Database',1),(4,1,'JavaScript Dasar','Dasar JavaScript',3),(5,3,'Pengenalan Node.js','Dasar Node.js',1);
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('teacher','student') NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `identity_number` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrator','admin@mail.com','123456','teacher',NULL,NULL,'2026-06-06 16:28:05','2026-06-19 17:17:54','NIP001','Informatika'),(5,'Budi Santoso','budi@mail.com','123456','teacher',NULL,NULL,'2026-06-08 10:07:37','2026-06-08 10:07:37',NULL,NULL),(6,'Andi Wijaya','andi@mail.com','123456','student',NULL,NULL,'2026-06-08 10:07:37','2026-06-08 10:07:37',NULL,NULL),(7,'Muhammad Hafizh Alzaqi','hafizh@mail.com','123456','student',NULL,NULL,'2026-06-19 17:18:01','2026-06-19 17:18:01','H1D025001','Informatika'),(8,'Dr. Eddy Maryanto','eddy@infolearn.mhacore.id','123456','teacher',NULL,'Dosen Teknik Komputer','2026-06-22 07:46:38','2026-06-22 07:46:38','NIP1985001','Teknik Komputer'),(9,'Ir. Siti Rahmawati','siti@infolearn.mhacore.id','123456','teacher',NULL,'Dosen Sistem Informasi','2026-06-22 07:46:38','2026-06-22 07:46:38','NIP1985002','Sistem Informasi'),(10,'Muhammad Hafizh Alzaqi','hafizh@infolearn.mhacore.id','123456','student',NULL,'Mahasiswa Informatika','2026-06-22 07:46:38','2026-06-22 07:46:38','H1D025001','Informatika'),(11,'Muhammad Akbar Nur Fauzi','nur@infolearn.mhacore.id','123456','student',NULL,'Mahasiswa Informatika','2026-06-22 07:46:38','2026-06-22 07:46:38','H1D025002','Informatika'),(12,'Sahid Wisnu Sanjaya','sahid@infolearn.mhacore.id','123456','student',NULL,'Mahasiswa Teknik Komputer','2026-06-22 07:46:38','2026-06-22 07:46:38','H1H025174','Teknik Komputer'),(13,'Aldhi Nano','aldhi@gmail.com','123456','student',NULL,'Peserta Umum','2026-06-22 07:46:38','2026-06-22 07:46:38',NULL,'Umum');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22  8:46:26
