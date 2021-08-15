/*
  Warnings:

  - You are about to alter the column `model` on the `_fivem_vehicles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cuid]` on the table `_fivem_characters` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cuid` on table `_fivem_characters` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_ibfk_1`;

-- AlterTable
ALTER TABLE `_fivem_account_transactions` MODIFY `date` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `_fivem_characters` MODIFY `cuid` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `_fivem_phones` ADD COLUMN `burner` INTEGER DEFAULT 0,
    ADD COLUMN `burner_number` VARCHAR(255) DEFAULT '0';

-- AlterTable
ALTER TABLE `_fivem_phones_conversations` MODIFY `last_message` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `_fivem_phones_messages` MODIFY `message_timestamp` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `_fivem_vehicles` MODIFY `model` INTEGER;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `VerificationRequest`;

-- CreateTable
CREATE TABLE `_mdt_criminals` (
    `criminalid` INTEGER NOT NULL AUTO_INCREMENT,
    `character_uid` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `date_of_birth` VARCHAR(255),
    `image` VARCHAR(255),

    INDEX `character_uid`(`character_uid`),
    PRIMARY KEY (`criminalid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_pdm_vehicles` (
    `name` VARCHAR(50) NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `costs` DECIMAL(10, 0) NOT NULL DEFAULT 0,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `category` VARCHAR(50) NOT NULL,
    `selling` INTEGER DEFAULT 1
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_annoucments` (
    `annoucmentid` INTEGER NOT NULL AUTO_INCREMENT,
    `annoucment_title` VARCHAR(255),
    `annocument_body` LONGTEXT,
    `annoucment_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`annoucmentid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_booked_charges` (
    `booked_charge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER,
    `charge_id` INTEGER,
    `charge_count` INTEGER,

    INDEX `FK__mdt_booked_charges__mdt_bookings_bookingid`(`booking_id`),
    INDEX `FK__mdt_booked_charges__mdt_charges_chargeid`(`charge_id`),
    PRIMARY KEY (`booked_charge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_bookings` (
    `bookingid` INTEGER NOT NULL AUTO_INCREMENT,
    `officer_id` INTEGER,
    `criminal_id` INTEGER,
    `report_id` INTEGER,
    `date` DATETIME(0),
    `for_warrant` BOOLEAN,
    `booking_plea` VARCHAR(255),
    `booking_reduction` INTEGER,

    INDEX `FK__mdt_bookings__mdt_criminals_criminalid`(`criminal_id`),
    INDEX `FK__mdt_bookings__mdt_officers_officerid`(`officer_id`),
    PRIMARY KEY (`bookingid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_charges` (
    `chargeid` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER,
    `name` VARCHAR(500),
    `description` LONGTEXT,
    `time` INTEGER,
    `fine` INTEGER,
    `class` VARCHAR(255),

    INDEX `FK__mdt_charges_category_id`(`category_id`),
    PRIMARY KEY (`chargeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_charges_categories` (
    `categoryid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),

    PRIMARY KEY (`categoryid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_criminal_flags` (
    `flagid` INTEGER NOT NULL AUTO_INCREMENT,
    `criminal_id` INTEGER,
    `type_id` INTEGER,

    INDEX `FK__mdt_criminal_flags_criminalid`(`criminal_id`),
    INDEX `FK__mdt_criminal_flags_type_id`(`type_id`),
    PRIMARY KEY (`flagid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_criminal_notes` (
    `noteid` INTEGER NOT NULL AUTO_INCREMENT,
    `criminal_id` INTEGER,
    `note_content` LONGTEXT,
    `note_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `note_author` INTEGER,

    INDEX `FK__mdt_criminal_notes_criminal_id`(`criminal_id`),
    INDEX `FK__mdt_criminal_notes_note_author`(`note_author`),
    PRIMARY KEY (`noteid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_department_members` (
    `memberid` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER,
    `rank_id` INTEGER,
    `officer_id` INTEGER,

    INDEX `FK__mdt_department_members__mdt_departments_departmentid`(`department_id`),
    INDEX `FK__mdt_department_members_officer_id`(`officer_id`),
    INDEX `FK__mdt_department_members_rank_id`(`rank_id`),
    PRIMARY KEY (`memberid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_department_ranks` (
    `rankid` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_id` INTEGER,
    `administrator_level` INTEGER,
    `name` VARCHAR(50),

    INDEX `FK__mdt_department_ranks__mdt_departments_departmentid`(`dept_id`),
    PRIMARY KEY (`rankid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_departments` (
    `departmentid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50),

    PRIMARY KEY (`departmentid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_dispatch` (
    `recordid` INTEGER NOT NULL AUTO_INCREMENT,
    `officer_id` INTEGER,
    `clock_in_date` DATETIME(0),
    `clock_out_date` DATETIME(0),

    PRIMARY KEY (`recordid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_flag_types` (
    `typeid` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(255),
    `type_color` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`typeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_officers` (
    `officerid` INTEGER NOT NULL AUTO_INCREMENT,
    `officeruid` VARCHAR(255) DEFAULT (uuid()),
    `character_id` VARCHAR(255),
    `username` VARCHAR(255),
    `password` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `call_sign` INTEGER,
    `blacklisted` INTEGER,

    PRIMARY KEY (`officerid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_reports` (
    `reportid` INTEGER NOT NULL AUTO_INCREMENT,
    `filing_officer_id` INTEGER,
    `title` VARCHAR(255),
    `content` LONGTEXT,
    `draft` BOOLEAN,
    `date` DATETIME(0),

    INDEX `FK__mdt_reports__mdt_officers_officerid`(`filing_officer_id`),
    PRIMARY KEY (`reportid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_reports_images` (
    `imageid` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER,
    `image_description` VARCHAR(255),
    `image_url` VARCHAR(500),

    INDEX `FK__mdt_report_images__mdt_reports_reportid`(`report_id`),
    PRIMARY KEY (`imageid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_reports_involved` (
    `involvedid` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER,
    `officer_id` INTEGER,

    INDEX `FK__mdt_report_involved__mdt_officers_officerid`(`officer_id`),
    INDEX `FK__mdt_report_involved__mdt_reports_reportid`(`report_id`),
    PRIMARY KEY (`involvedid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_warrants` (
    `warrantid` INTEGER NOT NULL AUTO_INCREMENT,
    `requesting_officer_id` INTEGER,
    `report_id` INTEGER,
    `booking_id` INTEGER,
    `approved` BOOLEAN DEFAULT false,
    `start` DATETIME(0),
    `end` DATETIME(0),
    `served` TINYINT DEFAULT 0,

    INDEX `FK__mdt_warrants__mdt_bookings_bookingid`(`booking_id`),
    INDEX `FK__mdt_warrants__mdt_officers_officerid`(`requesting_officer_id`),
    INDEX `FK__mdt_warrants__mdt_reports_reportid`(`report_id`),
    PRIMARY KEY (`warrantid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_bookings_new` (
    `bookingId` INTEGER NOT NULL AUTO_INCREMENT,
    `filingOfficerId` INTEGER NOT NULL,
    `criminalId` INTEGER NOT NULL,
    `reportId` INTEGER NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `forWarrant` BOOLEAN,
    `bookingPlea` VARCHAR(255),
    `bookingReduction` INTEGER,
    `bookingOverride` INTEGER,

    INDEX `criminalId`(`criminalId`),
    INDEX `filingOfficerId`(`filingOfficerId`),
    INDEX `reportId`(`reportId`),
    PRIMARY KEY (`bookingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_reports_new` (
    `reportid` INTEGER NOT NULL AUTO_INCREMENT,
    `filingOfficerId` INTEGER NOT NULL,
    `title` VARCHAR(255),
    `content` LONGTEXT,
    `draft` BOOLEAN,
    `date` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `filingOfficerId`(`filingOfficerId`),
    PRIMARY KEY (`reportid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mdt_booked_charges_new` (
    `bookedChargeId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `chargeId` INTEGER NOT NULL,
    `chargeCount` INTEGER NOT NULL,

    INDEX `bookingId`(`bookingId`),
    INDEX `chargeId`(`chargeId`),
    PRIMARY KEY (`bookedChargeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `_fivem_characters.cuid_unique` ON `_fivem_characters`(`cuid`);

-- CreateIndex
CREATE INDEX `cuid` ON `_fivem_characters`(`cuid`);
