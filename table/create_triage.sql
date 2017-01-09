CREATE DATABASE `triage_manager`;
CREATE TABLE `triage_manager`.`triage` ( 
  `activity_id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(45) NOT NULL, 
  `deadline` DATETIME NOT NULL, 
  `description` VARCHAR(500) NULL,
  PRIMARY KEY (`activity_id`) 
);
GRANT ALL PRIVILEGES ON triage_manager.* To 'electron_triager'@'localhost' IDENTIFIED BY 'tr1@g34lyf3';