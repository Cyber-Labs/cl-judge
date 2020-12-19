CREATE DATABASE  IF NOT EXISTS `cl_judge` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cl_judge`;
-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: localhost    Database: cl_judge
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contests`
--

DROP TABLE IF EXISTS `contests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `show_leaderboard` tinyint NOT NULL DEFAULT '0',
  `public` tinyint NOT NULL DEFAULT '1',
  `creator` varchar(45) NOT NULL,
  `name` text NOT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `about` text,
  `rules` text,
  `prizes` text,
  `confidential_questions` tinyint DEFAULT '0',
  `participants_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_contests_users_idx` (`creator`),
  CONSTRAINT `fk_contests_users` FOREIGN KEY (`creator`) REFERENCES `users` (`username`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contests_groups`
--

DROP TABLE IF EXISTS `contests_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contest_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contests_groups` (`contest_id`,`group_id`),
  KEY `fk_contests_groups1_idx` (`contest_id`),
  KEY `fk_contests_groups_2_idx` (`group_id`),
  CONSTRAINT `fk_contests_groups_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contests_groups_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contests_moderators`
--

DROP TABLE IF EXISTS `contests_moderators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests_moderators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contest_id` int NOT NULL,
  `moderator` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contests_moderators` (`contest_id`,`moderator`),
  KEY `fk_contests_moderators_1_idx` (`contest_id`),
  KEY `fk_contests_moderators_2_idx` (`moderator`),
  CONSTRAINT `fk_contests_moderators_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contests_moderators_2` FOREIGN KEY (`moderator`) REFERENCES `users` (`username`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contests_participants`
--

DROP TABLE IF EXISTS `contests_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contest_id` int NOT NULL,
  `participant` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contests_participants` (`contest_id`,`participant`),
  KEY `fk_contests_participants_1_idx` (`contest_id`),
  KEY `fk_contests_participants_2_idx` (`participant`),
  CONSTRAINT `fk_contests_participants_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contests_participants_2` FOREIGN KEY (`participant`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contests_questions`
--

DROP TABLE IF EXISTS `contests_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `contest_id` int NOT NULL,
  `max_score` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contests_questions` (`contest_id`,`question_id`),
  KEY `fk_contests_questions_1_idx` (`contest_id`),
  KEY `fk_contests_questions_2_idx` (`question_id`),
  CONSTRAINT `fk_contests_questions_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contests_questions_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(45) NOT NULL,
  `confidential` tinyint NOT NULL,
  `creator` varchar(45) NOT NULL,
  `member_count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groups_fk_creator` (`creator`),
  CONSTRAINT `groups_fk_creator` FOREIGN KEY (`creator`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leaderboard`
--

DROP TABLE IF EXISTS `leaderboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaderboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `contest_id` int NOT NULL,
  `score` int NOT NULL,
  `total_time` timestamp NOT NULL,
  `attempted_count` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contests_users` (`username`,`contest_id`),
  KEY `fk_leaderboard_users_idx` (`username`),
  KEY `fk_leaderboard_contests_idx` (`contest_id`),
  CONSTRAINT `fk_leaderboard_contests` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_leaderboard_users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(110) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `creator` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_fk_creator` (`creator`),
  CONSTRAINT `notifications_fk_creator` FOREIGN KEY (`creator`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator` varchar(45) NOT NULL,
  `type` enum('mcq','subjective') DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `problem_statement` text NOT NULL,
  `input_format` text,
  `output_format` text,
  `constraints` text,
  `options` text,
  `correct` int DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_questions_creator_idx` (`creator`),
  CONSTRAINT `fk_questions_creator` FOREIGN KEY (`creator`) REFERENCES `users` (`username`) ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions_editors`
--

DROP TABLE IF EXISTS `questions_editors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions_editors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `editor` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_questions_editors` (`question_id`,`editor`),
  KEY `fk_questions_editors_1_idx` (`question_id`),
  KEY `fk_questions_editors_2_idx` (`editor`),
  CONSTRAINT `fk_questions_editors_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_questions_editors_2` FOREIGN KEY (`editor`) REFERENCES `users` (`username`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions_tags`
--

DROP TABLE IF EXISTS `questions_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_questions_tags` (`question_id`,`tag_id`),
  KEY `fk_questions_tags_1_idx` (`question_id`),
  KEY `fk_questions_tags_2_idx` (`tag_id`),
  CONSTRAINT `fk_questions_tags_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_questions_tags_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table 'mcq_submissions'
--

CREATE TABLE `mcq_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `contest_id` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `response` int NOT NULL,
  `submission_time` timestamp NOT NULL,
  `score` int DEFAULT '0',
  `judged` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_user_mcq_submission` (`username`,`contest_id`,`question_id`),  
  KEY `fk_mcq_submissions_questions_idx` (`question_id`),
  KEY `fk_mcq_submissions_contests_idx` (`contest_id`),
  KEY `fk_mcq_submissions_users_idx` (`username`),
  CONSTRAINT `fk_mcq_submissions_contests` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_mcq_submissions_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_mcq_submissions_users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table 'subjective_submissions'
--

CREATE TABLE `subjective_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `contest_id` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `response` int NOT NULL,
  `submission_time` timestamp NOT NULL,
  `score` int DEFAULT '0',
  `judged` tinyint DEFAULT '0',
  `feedback` varchar(110) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_user_subjective_submission` (`username`,`contest_id`,`question_id`),  
  KEY `fk_subjective_submissions_questions_idx` (`question_id`),
  KEY `fk_subjective_submissions_contests_idx` (`contest_id`),
  KEY `fk_subjective_submissions_users_idx` (`username`),
  CONSTRAINT `fk_subjective_submissions_contests` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_subjective_submissions_questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subjective_submissions_users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `group_id` int NOT NULL,
  `is_group_moderator` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_member` (`username`,`group_id`),
  KEY `user_groups_fk_username_idx` (`username`),
  KEY `user_groups_fk_group_id_idx` (`group_id`),
  CONSTRAINT `user_groups_fk_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_groups_fk_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_notifications`
--

DROP TABLE IF EXISTS `user_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `notification_id` int NOT NULL,
  `read` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_notification_map` (`username`,`notification_id`),
  KEY `user_notifications_fk_username_idx` (`username`),
  KEY `user_notifications_fk_notification_id_idx` (`notification_id`),
  CONSTRAINT `user_notifications_fk_notification_id` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_notifications_fk_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(45) NOT NULL,
  `secret` longtext NOT NULL,
  `full_name` varchar(45) NOT NULL,
  `admission_number` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `mobile` varchar(45) DEFAULT NULL,
  `is_admin` tinyint DEFAULT NULL,
  `otp` varchar(45) DEFAULT NULL,
  `otp_valid_upto` varchar(45) DEFAULT NULL,
  `verified` tinyint DEFAULT NULL,
  `department` int NOT NULL,
  `course` int NOT NULL,
  `bio` varchar(110) DEFAULT NULL,
  `profile_img` varchar(110) DEFAULT NULL,
  `admission_year` int NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-12 14:56:20
