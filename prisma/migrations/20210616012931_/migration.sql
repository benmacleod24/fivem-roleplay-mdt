-- CreateTable
CREATE TABLE `_fivem_account_transactions` (
    `transactionid` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` VARCHAR(255),
    `receiver_id` VARCHAR(255),
    `amount` INTEGER,
    `description` VARCHAR(255),
    `date` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK__fivem_account_transactions__fivem_accounts_accountid`(`sender_id`),
    INDEX `FK__fivem_account_transactions__fivem_accounts_accountid_sender`(`receiver_id`),
    PRIMARY KEY (`transactionid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_account_types` (
    `typeid` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(255),

    PRIMARY KEY (`typeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_accounts` (
    `accountid` INTEGER NOT NULL AUTO_INCREMENT,
    `account_routing` INTEGER,
    `account_name` VARCHAR(255),
    `account_type` INTEGER,
    `account_amount` DECIMAL(30, 2) DEFAULT 5000.00,

    INDEX `FK__fivem_accounts__fivem_account_types`(`account_type`),
    PRIMARY KEY (`accountid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_accounts_access` (
    `accessid` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER,
    `account_id` INTEGER,
    `access_level` INTEGER,

    INDEX `FK__fivem_accounts_access__fivem_characters_id`(`character_id`),
    INDEX `FK__fivem_accounts_access_account_id`(`account_id`),
    PRIMARY KEY (`accessid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_apartments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cid` INTEGER,
    `stash` DECIMAL(20, 2) DEFAULT 0.00,
    `outfits` TEXT NOT NULL DEFAULT '{}',

    INDEX `FK_apartments_characters`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_characters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uId` INTEGER,
    `cuid` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `dob` VARCHAR(255),
    `cash` DECIMAL(20, 2) NOT NULL DEFAULT 500.00,
    `payslip` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `gender` BOOLEAN DEFAULT false,
    `deleted` BOOLEAN DEFAULT false,
    `ammo` MEDIUMTEXT,

    INDEX `FK_characters_uId`(`uId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_characters_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cid` INTEGER,
    `model` VARCHAR(255),
    `clothing` TEXT,
    `face_blend` TEXT,
    `tattoos` TEXT,
    `stats` VARCHAR(255) DEFAULT '{"health":200,"armor":0,"thirst":100.00,"hunger":100.00}',
    `stress` INTEGER DEFAULT 0,
    `bones` TEXT,

    INDEX `FK_character_details_characters_id`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_emotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cid` INTEGER,
    `emote1` VARCHAR(50) NOT NULL DEFAULT 'handsup',
    `emote2` VARCHAR(50) NOT NULL DEFAULT 'surrender',
    `emote3` VARCHAR(50) NOT NULL DEFAULT 'crossarms',
    `emote4` VARCHAR(50) NOT NULL DEFAULT 'crossarms2',
    `emote5` VARCHAR(50) NOT NULL DEFAULT 'lean',
    `emote6` VARCHAR(50) NOT NULL DEFAULT 'investigate',
    `emote7` VARCHAR(50) NOT NULL DEFAULT 'dancesilly9',
    `emote8` VARCHAR(50) NOT NULL DEFAULT 'winnerspov',
    `emote9` VARCHAR(50) NOT NULL DEFAULT 'cop',
    `emote10` VARCHAR(50) NOT NULL DEFAULT 'dab',
    `emote11` VARCHAR(50) NOT NULL DEFAULT 'facepalm',
    `emote12` VARCHAR(50) NOT NULL DEFAULT 'filmshocking',
    `emote13` VARCHAR(50) NOT NULL DEFAULT 'passout3',
    `emote14` VARCHAR(50) NOT NULL DEFAULT 'passout',
    `emote15` VARCHAR(50) NOT NULL DEFAULT 'gangsign',
    `emote16` VARCHAR(50) NOT NULL DEFAULT 'gangsign2',
    `emote17` VARCHAR(50) NOT NULL DEFAULT 'wait',
    `emote18` VARCHAR(50) NOT NULL DEFAULT 'wait2',
    `walk` VARCHAR(50) NOT NULL DEFAULT 'default',
    `mood` VARCHAR(50) NOT NULL DEFAULT 'default',

    INDEX `FK_emotes_characters_id`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NOT NULL DEFAULT '0',
    `inventory` VARCHAR(255) NOT NULL DEFAULT '0',
    `data` VARCHAR(500) NOT NULL DEFAULT '{}',
    `slot` SMALLINT NOT NULL DEFAULT 0,
    `creationDate` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_jail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cid` INTEGER,
    `jail_time` BIGINT,

    INDEX `FK_character_details_characters_id`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_licenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cid` INTEGER,
    `drivers` INTEGER DEFAULT 0,
    `pilots` INTEGER,
    `weapons` INTEGER,
    `hunting` INTEGER,
    `fishing` INTEGER,

    INDEX `cid`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_phones` (
    `phoneid` INTEGER NOT NULL AUTO_INCREMENT,
    `phone_owner` INTEGER,
    `phone_number` VARCHAR(255),

    UNIQUE INDEX `_fivem_phones.phone_number_unique`(`phone_number`),
    INDEX `FK__fivem_phones_phone_owner`(`phone_owner`),
    PRIMARY KEY (`phoneid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_phones_contacts` (
    `contactid` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_owner` INTEGER,
    `contact_name` VARCHAR(255),
    `contact_number` VARCHAR(255),

    INDEX `FK__fivem_phones_contacts_contact_owner`(`contact_owner`),
    PRIMARY KEY (`contactid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_phones_conversations` (
    `conversationid` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_number` VARCHAR(50),
    `conversation_number` VARCHAR(255),
    `read` BOOLEAN DEFAULT false,
    `last_message` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK__fivem_phones_conversations_conversation_owner`(`owner_number`),
    PRIMARY KEY (`conversationid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_phones_messages` (
    `messageid` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationid` INTEGER,
    `message_sender` VARCHAR(255),
    `message_content` MEDIUMTEXT,
    `message_timestamp` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK__fivem_phones_messages_conversation_id`(`conversationid`),
    PRIMARY KEY (`messageid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_properties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER,
    `ownerid` INTEGER,
    `street` VARCHAR(255),
    `interior` INTEGER DEFAULT 1,
    `disabled` BOOLEAN DEFAULT false,
    `repo` BOOLEAN DEFAULT false,

    INDEX `property_id`(`property_id`),
    INDEX `property_owner`(`ownerid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_properties_details` (
    `detailsid` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER,
    `stash` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `finance` TEXT,

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`detailsid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_properties_furniture` (
    `furnitureid` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER,
    `object` VARCHAR(255),
    `coords` VARCHAR(255),
    `rotation` VARCHAR(255),

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`furnitureid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_properties_keys` (
    `keysid` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER,
    `cid` INTEGER,

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`keysid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_properties_positions` (
    `positionsid` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER,
    `entry` VARCHAR(255),
    `backdoor` VARCHAR(255),
    `garage` VARCHAR(255),
    `exit` VARCHAR(255),
    `backexit` VARCHAR(255),
    `stash` VARCHAR(255),
    `logout` VARCHAR(255),

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`positionsid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255),
    `steamId` VARCHAR(255) NOT NULL DEFAULT '0',
    `license` VARCHAR(255) NOT NULL DEFAULT '0',
    `discord` VARCHAR(255) NOT NULL DEFAULT '0',
    `ip` VARCHAR(255) NOT NULL DEFAULT '0',
    `priority` INTEGER DEFAULT 0,
    `banned` BIGINT,
    `banned_reason` VARCHAR(255),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_vehicles` (
    `vehicleid` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleuid` VARCHAR(255) DEFAULT (uuid()),
    `ownerid` INTEGER,
    `plate` VARCHAR(255),
    `model` BIGINT,
    `name` VARCHAR(255),
    `gov` CHAR(1) DEFAULT '0',

    INDEX `FK__fivem_vehicles_characters_id`(`ownerid`),
    PRIMARY KEY (`vehicleid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_vehicles_details` (
    `detailsid` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleid` INTEGER,
    `details` TEXT,
    `finance` TEXT,
    `body` SMALLINT DEFAULT 1000,
    `engine` SMALLINT DEFAULT 1000,
    `degradation` TEXT,

    INDEX `FK__fivem_vehicles_details_vehicle_id`(`vehicleid`),
    PRIMARY KEY (`detailsid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_vehicles_illegals` (
    `illegalsid` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleid` INTEGER NOT NULL,
    `Injectors` INTEGER DEFAULT 0,
    `Filter` INTEGER DEFAULT 0,
    `Suspension` INTEGER DEFAULT 0,
    `Rollbars` INTEGER DEFAULT 0,
    `Bored` INTEGER DEFAULT 0,
    `Carbon` INTEGER DEFAULT 0,
    `Tires` INTEGER DEFAULT 0,
    `Steering` INTEGER DEFAULT 0,

    INDEX `vehicleid`(`vehicleid`),
    PRIMARY KEY (`illegalsid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_vehicles_logs` (
    `logid` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleid` INTEGER NOT NULL,
    `name` VARCHAR(50),
    `action` CHAR(10),
    `time` VARCHAR(255),

    PRIMARY KEY (`logid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_vehicles_status` (
    `statusid` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleid` INTEGER,
    `status` VARCHAR(50) DEFAULT 'Out',
    `garage` VARCHAR(255) DEFAULT 'Garage I',
    `wanted` INTEGER DEFAULT 0,
    `wantedr` VARCHAR(255),
    `impound` TEXT,

    INDEX `FK__fivem_vehicles_details_vehicle_id`(`vehicleid`),
    PRIMARY KEY (`statusid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_whitelist_characters_jobs` (
    `whitelistid` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` INTEGER,
    `character_id` INTEGER,
    `lvl` INTEGER,

    INDEX `FK_whitelist_characters_jobs_characters_id`(`character_id`),
    INDEX `FK_whitelist_characters_jobs_job_id`(`job_id`),
    PRIMARY KEY (`whitelistid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_fivem_whitelist_jobs` (
    `jobid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50),
    `displayName` VARCHAR(255),
    `payAmount` INTEGER,

    PRIMARY KEY (`jobid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `providerType` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191),
    `accessToken` VARCHAR(191),
    `accessTokenExpires` DATETIME(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Account.providerId_providerAccountId_unique`(`providerId`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session.sessionToken_unique`(`sessionToken`),
    UNIQUE INDEX `Session.accessToken_unique`(`accessToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `email` VARCHAR(191),
    `emailVerified` DATETIME(3),
    `image` VARCHAR(191),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationRequest` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationRequest.token_unique`(`token`),
    UNIQUE INDEX `VerificationRequest.identifier_token_unique`(`identifier`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_fivem_accounts` ADD FOREIGN KEY (`account_type`) REFERENCES `_fivem_account_types`(`typeid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_accounts_access` ADD FOREIGN KEY (`account_id`) REFERENCES `_fivem_accounts`(`accountid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_accounts_access` ADD FOREIGN KEY (`character_id`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_apartments` ADD FOREIGN KEY (`cid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_characters` ADD FOREIGN KEY (`uId`) REFERENCES `_fivem_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_characters_details` ADD FOREIGN KEY (`cid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_emotes` ADD FOREIGN KEY (`cid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_jail` ADD FOREIGN KEY (`cid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_licenses` ADD FOREIGN KEY (`cid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_phones` ADD FOREIGN KEY (`phone_owner`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_phones_contacts` ADD FOREIGN KEY (`contact_owner`) REFERENCES `_fivem_phones`(`phoneid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_phones_messages` ADD FOREIGN KEY (`conversationid`) REFERENCES `_fivem_phones_conversations`(`conversationid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_properties` ADD FOREIGN KEY (`ownerid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_properties_details` ADD FOREIGN KEY (`property_id`) REFERENCES `_fivem_properties`(`property_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_properties_furniture` ADD FOREIGN KEY (`property_id`) REFERENCES `_fivem_properties`(`property_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_properties_keys` ADD FOREIGN KEY (`property_id`) REFERENCES `_fivem_properties`(`property_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_properties_positions` ADD FOREIGN KEY (`property_id`) REFERENCES `_fivem_properties`(`property_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_vehicles` ADD FOREIGN KEY (`ownerid`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_vehicles_details` ADD FOREIGN KEY (`vehicleid`) REFERENCES `_fivem_vehicles`(`vehicleid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_vehicles_illegals` ADD FOREIGN KEY (`vehicleid`) REFERENCES `_fivem_vehicles`(`vehicleid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_vehicles_status` ADD FOREIGN KEY (`vehicleid`) REFERENCES `_fivem_vehicles`(`vehicleid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_whitelist_characters_jobs` ADD FOREIGN KEY (`character_id`) REFERENCES `_fivem_characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_fivem_whitelist_characters_jobs` ADD FOREIGN KEY (`job_id`) REFERENCES `_fivem_whitelist_jobs`(`jobid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
