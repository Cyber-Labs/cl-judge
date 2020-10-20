SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema cl_judge
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `cl_judge` ;

-- -----------------------------------------------------
-- Schema cl_judge
-- -----------------------------------------------------
CREATE DATABASE  IF NOT EXISTS `cl_judge` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `cl_judge` ;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;

CREATE TABLE IF NOT EXISTS `users` (
  `username` VARCHAR(45) NOT NULL,
  `secret` LONGTEXT NOT NULL,
  `full_name` VARCHAR(45) NOT NULL,
  `admission_number` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `mobile` VARCHAR(45) NULL DEFAULT NULL,
  `is_admin` TINYINT NULL DEFAULT NULL,
  `otp` VARCHAR(45) NULL DEFAULT NULL,
  `otp_valid_upto` VARCHAR(45) NULL DEFAULT NULL,
  `verified` TINYINT NULL DEFAULT NULL,
  `department` INT NOT NULL,
  `course` INT NOT NULL,
  `bio` VARCHAR(110) NULL DEFAULT NULL,
  `profile_img` VARCHAR(110) NULL DEFAULT NULL,
  `admission_year` INT NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)) 
  ENGINE = InnoDB 
  DEFAULT CHARACTER SET = utf8mb4 
  COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `groups`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `groups` ;

CREATE TABLE IF NOT EXISTS `groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(45) NOT NULL,
  `confidential` TINYINT NOT NULL,
  `creator` VARCHAR(45) NOT NULL,
  `member_count` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groups_fk_creator` (`creator`),
  CONSTRAINT `groups_fk_creator` 
    FOREIGN KEY (`creator`) 
    REFERENCES `users` (`username`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE) 
    ENGINE = InnoDB 
    DEFAULT CHARACTER SET = utf8mb4 
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notifications` ;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `heading` VARCHAR(110) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)) 
  ENGINE = InnoDB 
  DEFAULT CHARACTER SET = utf8mb4 
  COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `user_groups`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user_groups` ;

CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `group_id` INT NOT NULL,
  `is_group_moderator` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_groups_fk_username_idx` (`username`),
  KEY `user_groups_fk_group_id_idx` (`group_id`),
  CONSTRAINT `user_groups_fk_group_id` 
    FOREIGN KEY (`group_id`) 
    REFERENCES `groups` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `user_groups_fk_username` 
    FOREIGN KEY (`username`) 
    REFERENCES `users` (`username`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  UNIQUE `unique_member`(`username`, `group_id`)) 
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `user_notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user_notifications` ;

CREATE TABLE IF NOT EXISTS `user_notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `notification_id` INT NOT NULL,
  `read` TINYINT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_notifications_fk_username_idx` (`username`),
  KEY `user_notifications_fk_notification_id_idx` (`notification_id`),
  CONSTRAINT `user_notifications_fk_notification_id` 
  FOREIGN KEY (`notification_id`) 
  REFERENCES `notifications` (`id`) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  CONSTRAINT `user_notifications_fk_username` 
  FOREIGN KEY (`username`) 
  REFERENCES `users` (`username`) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  UNIQUE `unique_notification_map`(`username`, `notification_id`)) 
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
