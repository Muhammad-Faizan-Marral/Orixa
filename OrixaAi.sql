-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  username text NOT NULL UNIQUE CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  full_name text,
  headline text,
  bio text,
  location text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_premium boolean NOT NULL DEFAULT false,
  premium_until timestamp with time zone,
  polar_customer_id text,
  polar_subscription_id text,
  referral_code text,
  referred_by uuid,
  successful_referrals integer NOT NULL DEFAULT 0,
  referral_credited_at timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.portfolios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
  current_version integer NOT NULL DEFAULT 1,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT portfolios_pkey PRIMARY KEY (id),
  CONSTRAINT portfolios_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.portfolio_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL UNIQUE,
  headline text,
  about text,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  certificates jsonb NOT NULL DEFAULT '[]'::jsonb,
  resume_url text,
  theme text DEFAULT 'minimal'::text,
  animations boolean NOT NULL DEFAULT true,
  component_selection jsonb NOT NULL DEFAULT '{}'::jsonb,
  design_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  prompt text,
  avatar_url text,
  phone text,
  linkedin_url text,
  github_url text,
  CONSTRAINT portfolio_data_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_data_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);
CREATE TABLE public.portfolio_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL,
  version integer NOT NULL,
  config_json jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_versions_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_versions_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT social_links_pkey PRIMARY KEY (id),
  CONSTRAINT social_links_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  language text NOT NULL DEFAULT 'en'::text,
  timezone text DEFAULT 'UTC'::text,
  public_profile boolean NOT NULL DEFAULT true,
  email_notifications boolean NOT NULL DEFAULT true,
  theme_mode text DEFAULT 'system'::text CHECK (theme_mode = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id),
  CONSTRAINT settings_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.portfolio_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL,
  country text,
  city text,
  browser text,
  device text,
  os text,
  referrer text,
  ip_hash text,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_views_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_views_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread'::text CHECK (status = ANY (ARRAY['unread'::text, 'read'::text, 'replied'::text, 'archived'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id),
  CONSTRAINT contact_messages_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);
CREATE TABLE public.uploads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['avatar'::text, 'project-image'::text, 'resume'::text])),
  url text,
  mime_type text,
  size bigint NOT NULL,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['reserved'::text, 'active'::text, 'deleting'::text, 'deleted'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  bucket text NOT NULL,
  storage_path text NOT NULL,
  CONSTRAINT uploads_pkey PRIMARY KEY (id),
  CONSTRAINT uploads_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.ai_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid,
  request_type text NOT NULL,
  model text NOT NULL,
  input_tokens integer DEFAULT 0,
  output_tokens integer DEFAULT 0,
  total_tokens integer DEFAULT (input_tokens + output_tokens),
  estimated_cost numeric DEFAULT 0,
  latency_ms integer,
  status text DEFAULT 'success'::text CHECK (status = ANY (ARRAY['success'::text, 'failed'::text, 'cancelled'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_requests_pkey PRIMARY KEY (id),
  CONSTRAINT ai_requests_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);
CREATE TABLE public.portfolio_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL,
  event_type text NOT NULL,
  label text,
  referrer text,
  country text,
  ip_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_events_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_events_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id)
);