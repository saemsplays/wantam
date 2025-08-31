
-- 1. Drop overly permissive policies on user_counts and action_counts
DROP POLICY IF EXISTS "allow_function_access" ON public.user_counts;
DROP POLICY IF EXISTS "allow_function_access" ON public.action_counts;
DROP POLICY IF EXISTS "Allow internal inserts" ON public.action_counts;
DROP POLICY IF EXISTS "Allow internal updates" ON public.action_counts;

-- Keep only read access for these tables
CREATE POLICY "Public read only access" ON public.action_counts
  FOR SELECT USING (true);

-- 2. Add verification columns to email_templates
ALTER TABLE public.email_templates 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id);

-- 3. Update email_templates policies for security
DROP POLICY IF EXISTS "Allow public inserts" ON public.email_templates;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.email_templates;

-- Only verified templates are visible to public
CREATE POLICY "Public can view verified templates" ON public.email_templates
  FOR SELECT USING (is_verified = true);

-- Only authenticated users can create templates
CREATE POLICY "Authenticated users can create templates" ON public.email_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- Users can view and update their own templates
CREATE POLICY "Users can view their own templates" ON public.email_templates
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON public.email_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- 4. Update templates policies to require authentication
DROP POLICY IF EXISTS "Allow template creation for all users" ON public.templates;

CREATE POLICY "Authenticated users can create templates" ON public.templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- 5. Add verification to templates table
ALTER TABLE public.templates 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id);

-- Update templates public access to only verified content
DROP POLICY IF EXISTS "Public templates are viewable by all" ON public.templates;

CREATE POLICY "Public can view verified templates" ON public.templates
  FOR SELECT USING (is_public = true AND is_verified = true);

-- 6. Fix SECURITY DEFINER functions with proper search_path
CREATE OR REPLACE FUNCTION public.generate_slug(title_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  UPDATE public.templates 
  SET uses_count = uses_count + 1 
  WHERE id = template_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_template_views(template_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  UPDATE public.templates 
  SET views_count = views_count + 1 
  WHERE id = template_id;
END;
$function$;

-- 7. Add length constraints for data hygiene
ALTER TABLE public.email_templates 
ADD CONSTRAINT email_subject_length CHECK (char_length(subject) <= 300),
ADD CONSTRAINT template_name_length CHECK (char_length(template_name) <= 200);

ALTER TABLE public.templates
ADD CONSTRAINT template_title_length CHECK (char_length(title) <= 300);

-- 8. Create user roles system for future moderation
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. Add admin-only verification policies
CREATE POLICY "Admins can verify email templates" ON public.email_templates
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Admins can verify templates" ON public.templates
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

-- 10. Revoke direct table access for anon/authenticated on sensitive tables
REVOKE ALL ON public.user_actions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_counts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.action_counts FROM anon, authenticated;
