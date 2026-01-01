CREATE TABLE `anonymous_patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anonymousId` varchar(10) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`hasUsedFreeSession` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `anonymous_patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `anonymous_patients_anonymousId_unique` UNIQUE(`anonymousId`),
	CONSTRAINT `anonymous_patients_phoneNumber_unique` UNIQUE(`phoneNumber`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`resourceType` varchar(100) NOT NULL,
	`resourceId` int,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consent_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`consentType` enum('recording','privacy_policy','terms_of_service') NOT NULL,
	`consentGiven` boolean NOT NULL,
	`consentVersion` varchar(20) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consent_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctor_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`licenseNumber` varchar(100) NOT NULL,
	`bio` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`sessionRate` decimal(10,2) NOT NULL,
	`availableSlots` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doctor_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `doctor_profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `doctor_profiles_licenseNumber_unique` UNIQUE(`licenseNumber`)
);
--> statement-breakpoint
CREATE TABLE `intake_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionText` text NOT NULL,
	`questionType` enum('single_choice','multi_select') NOT NULL,
	`options` json NOT NULL,
	`category` varchar(100) NOT NULL,
	`order` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`questionId` int NOT NULL,
	`selectedOptions` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`patientId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'EGP',
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`stripeChargeId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_sessionId_unique` UNIQUE(`sessionId`),
	CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`),
	CONSTRAINT `payments_stripeChargeId_unique` UNIQUE(`stripeChargeId`)
);
--> statement-breakpoint
CREATE TABLE `recording_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`recordingKey` varchar(500) NOT NULL,
	`recordingUrl` varchar(500) NOT NULL,
	`fileSize` int,
	`duration` int,
	`encryptionKey` text,
	`retentionDays` int NOT NULL DEFAULT 90,
	`deleteScheduledAt` datetime,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recording_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `recording_metadata_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int,
	`doctorId` int,
	`subject` varchar(255) NOT NULL,
	`description` longtext NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `therapy_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`sessionType` enum('free','paid') NOT NULL,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`scheduledAt` datetime NOT NULL,
	`startedAt` datetime,
	`endedAt` datetime,
	`duration` int,
	`sessionNotes` longtext,
	`recordingConsent` boolean NOT NULL DEFAULT false,
	`recordingUrl` varchar(500),
	`recordingKey` varchar(500),
	`aiSummary` longtext,
	`diagnosis` text,
	`followUpPoints` longtext,
	`doctorReviewedAiSummary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `therapy_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','doctor') NOT NULL DEFAULT 'user';