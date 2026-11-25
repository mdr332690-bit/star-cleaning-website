CREATE TYPE "customer_review_status" AS ENUM('pending', 'approved', 'rejected', 'deleted');--> statement-breakpoint
CREATE TABLE "review_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"scope" text NOT NULL,
	"job" text NOT NULL,
	"token_hash" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"redeemed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "review_moderation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"scope" text NOT NULL,
	"target_id" uuid NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_rate_limits" (
	"scope" text,
	"subject" text,
	"minute" integer,
	"attempts" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "review_rate_limits_pkey" PRIMARY KEY("scope","subject","minute")
);
--> statement-breakpoint
CREATE TABLE "review_photos" (
	"id" uuid PRIMARY KEY,
	"scope" text NOT NULL,
	"cleanup_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "customer_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"scope" text NOT NULL,
	"invitation_id" uuid NOT NULL UNIQUE,
	"status" "customer_review_status" DEFAULT 'pending'::"customer_review_status" NOT NULL,
	"name" text,
	"rating" integer NOT NULL,
	"experience" text,
	"language" text NOT NULL,
	"photo_id" uuid UNIQUE,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	CONSTRAINT "customer_review_rating_range" CHECK ("rating" between 1 and 5),
	CONSTRAINT "customer_review_language_check" CHECK ("language" in ('en', 'ar')),
	CONSTRAINT "customer_review_required_content" CHECK ("status" in ('rejected', 'deleted') or ("name" is not null and "experience" is not null))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "review_invitation_scope_job_unique" ON "review_invitations" ("scope","job");--> statement-breakpoint
CREATE INDEX "review_moderation_history_idx" ON "review_moderation_events" ("scope","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "review_rate_limit_expiry_idx" ON "review_rate_limits" ("scope","minute");--> statement-breakpoint
CREATE INDEX "review_photo_cleanup_idx" ON "review_photos" ("scope","cleanup_at");--> statement-breakpoint
CREATE INDEX "customer_review_publication_idx" ON "customer_reviews" ("scope","status","submitted_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_invitation_id_review_invitations_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "review_invitations"("id");--> statement-breakpoint
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_photo_id_review_photos_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "review_photos"("id");