CREATE TABLE "journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tripId" integer NOT NULL,
	"waypointId" integer,
	"userId" integer NOT NULL,
	"title" varchar(255),
	"content" text,
	"todoItems" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pois" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(64) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"address" text,
	"description" text,
	"phone" varchar(32),
	"website" varchar(512),
	"rating" double precision,
	"imageUrl" varchar(512),
	"tags" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(32) DEFAULT 'planning' NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"bannerColor" varchar(32) DEFAULT '#1e3a5f',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" varchar(16) DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "vessel_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"boatName" varchar(255),
	"boatType" varchar(128),
	"draft" double precision,
	"airDraft" double precision,
	"cruisingSpeed" double precision,
	"fuelRange" double precision,
	"lengthOverall" double precision,
	"beam" double precision,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vessel_profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "waypoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"tripId" integer NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"plannedDate" timestamp,
	"dateTbd" boolean DEFAULT true NOT NULL,
	"notes" text,
	"category" varchar(64) DEFAULT 'stop',
	"poiId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
