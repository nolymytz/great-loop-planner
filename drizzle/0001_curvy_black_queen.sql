CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`waypointId` int,
	`userId` int NOT NULL,
	`title` varchar(255),
	`content` text,
	`todoItems` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pois` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('marina','anchorage','fuel_dock','restaurant','museum','attraction') NOT NULL,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`address` text,
	`description` text,
	`phone` varchar(32),
	`website` varchar(512),
	`rating` double,
	`imageUrl` varchar(512),
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pois_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('planning','active','paused','completed') NOT NULL DEFAULT 'planning',
	`startDate` timestamp,
	`endDate` timestamp,
	`bannerColor` varchar(32) DEFAULT '#1e3a5f',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vessel_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`boatName` varchar(255),
	`boatType` varchar(128),
	`draft` double,
	`airDraft` double,
	`cruisingSpeed` double,
	`fuelRange` double,
	`lengthOverall` double,
	`beam` double,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vessel_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vessel_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `waypoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`plannedDate` timestamp,
	`dateTbd` boolean NOT NULL DEFAULT true,
	`notes` text,
	`category` varchar(64) DEFAULT 'stop',
	`poiId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waypoints_id` PRIMARY KEY(`id`)
);
