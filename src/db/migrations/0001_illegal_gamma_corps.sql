CREATE TABLE "portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"current_version" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_status_check" CHECK (status = ANY (
        ARRAY[
          'draft'::text,
          'published'::text,
          'archived'::text
        ]
      ))
);
--> statement-breakpoint
ALTER TABLE "portfolios" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"name" text,
	"prompt" text,
	"avatar_url" text,
	"phone" text,
	"linkedin_url" text,
	"github_url" text,
	"headline" text,
	"about" text,
	"projects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"experience" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"certificates" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"resume_url" text,
	"theme" text DEFAULT 'minimal',
	"animations" boolean DEFAULT true NOT NULL,
	"component_selection" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"design_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"seo" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_data_portfolio_id_key" UNIQUE("portfolio_id")
);
--> statement-breakpoint
ALTER TABLE "portfolio_data" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"country" text,
	"city" text,
	"browser" text,
	"device" text,
	"os" text,
	"referrer" text,
	"ip_hash" text,
	"visited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"config_json" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"timezone" text DEFAULT 'UTC',
	"public_profile" boolean DEFAULT true NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"theme_mode" text DEFAULT 'system',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "settings_profile_id_key" UNIQUE("profile_id"),
	CONSTRAINT "settings_theme_check" CHECK (
        theme_mode = ANY (
          ARRAY[
            'light'::text,
            'dark'::text,
            'system'::text
          ]
        )
      )
);
--> statement-breakpoint
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"type" text NOT NULL,
	"bucket" text NOT NULL,
	"storage_path" text NOT NULL,
	"url" text,
	"mime_type" text,
	"size" bigint NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "upload_status_check" CHECK (status = ANY (
        ARRAY[
          'reserved'::text,
          'active'::text,
          'deleting'::text,
          'deleted'::text
        ]
      )),
	CONSTRAINT "upload_type_check" CHECK (type = ANY (
        ARRAY[
          'avatar'::text,
          'project-image'::text,
          'resume'::text
        ]
      ))
);
--> statement-breakpoint
ALTER TABLE "uploads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid,
	"request_type" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer DEFAULT 0,
	"output_tokens" integer DEFAULT 0,
	"total_tokens" integer GENERATED ALWAYS AS ((input_tokens + output_tokens)) STORED,
	"estimated_cost" numeric(10, 6) DEFAULT '0',
	"latency_ms" integer,
	"status" text DEFAULT 'success',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_status_check" CHECK (
        status = ANY (
          ARRAY[
            'success'::text,
            'failed'::text,
            'cancelled'::text
          ]
        )
      )
);
--> statement-breakpoint
ALTER TABLE "ai_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"visitor_name" text NOT NULL,
	"visitor_email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contact_status_check" CHECK (
        status = ANY (
          ARRAY[
            'unread'::text,
            'read'::text,
            'replied'::text,
            'archived'::text
          ]
        )
      )
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"label" text,
	"referrer" text,
	"country" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "profiles_username_unique";--> statement-breakpoint
DROP INDEX "profiles_user_unique";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "username" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "full_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "headline" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "location" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_data" ADD CONSTRAINT "portfolio_data_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_views" ADD CONSTRAINT "portfolio_views_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_versions" ADD CONSTRAINT "portfolio_versions_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_requests" ADD CONSTRAINT "ai_requests_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_events" ADD CONSTRAINT "portfolio_events_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_slug_unique" ON "portfolios" USING btree ("profile_id","slug");--> statement-breakpoint
CREATE INDEX "portfolios_profile_idx" ON "portfolios" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "portfolios_status_idx" ON "portfolios" USING btree ("status");--> statement-breakpoint
CREATE INDEX "portfolio_data_portfolio_idx" ON "portfolio_data" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "portfolio_views_date_idx" ON "portfolio_views" USING btree ("visited_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "portfolio_views_portfolio_idx" ON "portfolio_views" USING btree ("portfolio_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_version_unique" ON "portfolio_versions" USING btree ("portfolio_id","version");--> statement-breakpoint
CREATE INDEX "portfolio_versions_portfolio_idx" ON "portfolio_versions" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "social_links_profile_idx" ON "social_links" USING btree ("profile_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "social_links_unique" ON "social_links" USING btree ("profile_id" uuid_ops,"platform" text_ops);--> statement-breakpoint
CREATE INDEX "uploads_profile_idx" ON "uploads" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uploads_bucket_path_unique" ON "uploads" USING btree ("bucket","storage_path");--> statement-breakpoint
CREATE INDEX "ai_requests_created_idx" ON "ai_requests" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ai_requests_portfolio_idx" ON "ai_requests" USING btree ("portfolio_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "contact_messages_portfolio_idx" ON "contact_messages" USING btree ("portfolio_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "portfolio_events_portfolio_idx" ON "portfolio_events" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "portfolio_events_type_idx" ON "portfolio_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "portfolio_events_created_idx" ON "portfolio_events" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_key" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_username_key" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "username_format" CHECK (username ~ '^[a-z0-9_]+$'::text);--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "username_length" CHECK (
        (char_length(username) >= 3)
        AND
        (char_length(username) <= 30)
      );--> statement-breakpoint
CREATE POLICY "Users can view own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Owner manages portfolios" ON "portfolios" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM profiles
          WHERE profiles.id = portfolios.profile_id
          AND profiles.user_id = auth.uid()
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM profiles
          WHERE profiles.id = portfolios.profile_id
          AND profiles.user_id = auth.uid()
        )
      ));--> statement-breakpoint
CREATE POLICY "Public can view published portfolios" ON "portfolios" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Owner manages portfolio data" ON "portfolio_data" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_data.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_data.portfolio_id
          AND pr.user_id = auth.uid()
        )
      ));--> statement-breakpoint
CREATE POLICY "Anyone can insert portfolio views" ON "portfolio_views" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Owner can read analytics" ON "portfolio_views" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Owner manages portfolio_versions" ON "portfolio_versions" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_versions.portfolio_id
          AND pr.user_id = auth.uid()
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE p.id = portfolio_versions.portfolio_id
          AND pr.user_id = auth.uid()
        )
      ));--> statement-breakpoint
CREATE POLICY "Owner manages social_links" ON "social_links" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = social_links.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = social_links.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      ));--> statement-breakpoint
CREATE POLICY "Owner manages settings" ON "settings" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = settings.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE (
            pr.id = settings.profile_id
            AND pr.user_id = auth.uid()
          )
        )
      ));--> statement-breakpoint
CREATE POLICY "Owner manages uploads" ON "uploads" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = uploads.profile_id
          AND pr.user_id = auth.uid()
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM profiles pr
          WHERE pr.id = uploads.profile_id
          AND pr.user_id = auth.uid()
        )
      ));--> statement-breakpoint
CREATE POLICY "Owner manages ai_requests" ON "ai_requests" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = ai_requests.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = ai_requests.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      ));--> statement-breakpoint
CREATE POLICY "Owner manages contact_messages" ON "contact_messages" AS PERMISSIVE FOR ALL TO public USING ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = contact_messages.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      )) WITH CHECK ((
        EXISTS (
          SELECT 1
          FROM portfolios p
          JOIN profiles pr
            ON p.profile_id = pr.id
          WHERE (
            p.id = contact_messages.portfolio_id
            AND pr.user_id = auth.uid()
          )
        )
      ));--> statement-breakpoint
CREATE POLICY "Anyone can insert portfolio events" ON "portfolio_events" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Owner can read portfolio events" ON "portfolio_events" AS PERMISSIVE FOR SELECT TO public;