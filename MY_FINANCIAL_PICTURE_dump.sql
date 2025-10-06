-- MySQL dump 10.13  Distrib 9.4.0, for macos26.0 (arm64)
--
-- Host: localhost    Database: MY_FINANCIAL_PICTURE
-- ------------------------------------------------------
-- Server version	9.4.0

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

--
-- Table structure for table `BUDGETS`
--

DROP TABLE IF EXISTS `BUDGETS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BUDGETS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `LIMIT_AMOUNT` varchar(50) NOT NULL,
  `START_DATE` varchar(50) NOT NULL,
  `END_DATE` varchar(50) NOT NULL,
  `DESCRIPTION_` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BUDGETS`
--

LOCK TABLES `BUDGETS` WRITE;
/*!40000 ALTER TABLE `BUDGETS` DISABLE KEYS */;
/*!40000 ALTER TABLE `BUDGETS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GOALS`
--

DROP TABLE IF EXISTS `GOALS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GOALS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `NAME_` varchar(50) DEFAULT NULL,
  `TARGET_AMOUNT` int NOT NULL,
  `DEADLINE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GOALS`
--

LOCK TABLES `GOALS` WRITE;
/*!40000 ALTER TABLE `GOALS` DISABLE KEYS */;
/*!40000 ALTER TABLE `GOALS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GOALSTL`
--

DROP TABLE IF EXISTS `GOALSTL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GOALSTL` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `NAME_` varchar(50) DEFAULT NULL,
  `TARGET_AMOUNT` int NOT NULL,
  `CURRENT_AMOUNT` int NOT NULL,
  `DEADLINE` varchar(50) DEFAULT NULL,
  `DESCRIPTION_` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `goalstl_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GOALSTL`
--

LOCK TABLES `GOALSTL` WRITE;
/*!40000 ALTER TABLE `GOALSTL` DISABLE KEYS */;
/*!40000 ALTER TABLE `GOALSTL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `INSTITUTIONS`
--

DROP TABLE IF EXISTS `INSTITUTIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `INSTITUTIONS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_V_ID` int NOT NULL,
  `NAME` varchar(50) DEFAULT NULL,
  `TYPE` varchar(50) DEFAULT NULL,
  `BALANCE` int DEFAULT NULL,
  `CURRENCY` varchar(50) DEFAULT NULL,
  `CREATED_AT` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_V_ID` (`USER_V_ID`),
  CONSTRAINT `institutions_ibfk_1` FOREIGN KEY (`USER_V_ID`) REFERENCES `USERS` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INSTITUTIONS`
--

LOCK TABLES `INSTITUTIONS` WRITE;
/*!40000 ALTER TABLE `INSTITUTIONS` DISABLE KEYS */;
/*!40000 ALTER TABLE `INSTITUTIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRANSACTIONS`
--

DROP TABLE IF EXISTS `TRANSACTIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRANSACTIONS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ACCOUNT_ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `CATEGORY_ID` int NOT NULL,
  `AMOUNT_` int DEFAULT NULL,
  `DESCRIPTION_` varchar(50) DEFAULT NULL,
  `DATE_` varchar(50) DEFAULT NULL,
  `TYPE_` varchar(50) DEFAULT NULL,
  `IS_RECURRING` varchar(50) DEFAULT NULL,
  `CREATED_AT` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `TRANSACTIONSTL` (`ID`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRANSACTIONS`
--

LOCK TABLES `TRANSACTIONS` WRITE;
/*!40000 ALTER TABLE `TRANSACTIONS` DISABLE KEYS */;
/*!40000 ALTER TABLE `TRANSACTIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRANSACTIONSTL`
--

DROP TABLE IF EXISTS `TRANSACTIONSTL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRANSACTIONSTL` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ACCOUNT_ID` int NOT NULL,
  `NAME_` varchar(50) DEFAULT NULL,
  `IS_CATEGORY` varchar(50) DEFAULT NULL,
  `DATE_` varchar(50) DEFAULT NULL,
  `TYPE_` varchar(50) DEFAULT NULL,
  `IS_RECURRING` varchar(50) DEFAULT NULL,
  `CREATED_AT` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRANSACTIONSTL`
--

LOCK TABLES `TRANSACTIONSTL` WRITE;
/*!40000 ALTER TABLE `TRANSACTIONSTL` DISABLE KEYS */;
/*!40000 ALTER TABLE `TRANSACTIONSTL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USERS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(50) NOT NULL,
  `PASSWORD_HASH` varchar(255) NOT NULL,
  `CREATED_AT` varchar(50) DEFAULT NULL,
  `LAST_LOGIN` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERS`
--

LOCK TABLES `USERS` WRITE;
/*!40000 ALTER TABLE `USERS` DISABLE KEYS */;
INSERT INTO `USERS` VALUES (1,'example@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$eG+t1TrHWKuVUgoh5Lz3ng$hEiG7v+bDOf+w3U63a37V1ASnKdDz0ojcK7Kd+L52z8','2025-09-29 12:59:09',NULL);
/*!40000 ALTER TABLE `USERS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 15:01:46
