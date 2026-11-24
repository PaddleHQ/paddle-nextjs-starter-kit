CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text,
	"reference_id" text NOT NULL,
	"paddle_customer_id" text NOT NULL,
	"paddle_subscription_id" text NOT NULL,
	"paddle_transaction_id" text,
	"status" text NOT NULL,
	"price_id" text,
	"quantity" integer DEFAULT 1,
	"period_start" timestamp,
	"period_end" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"scheduled_change" text,
	"last_event_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_paddle_subscription_id_unique" UNIQUE("paddle_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "paddle_customer_id" text;