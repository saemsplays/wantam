
-- Update RLS policies for templates table to allow anonymous template creation
-- while maintaining security for authenticated users

-- Drop the existing restrictive policy for inserts
DROP POLICY IF EXISTS "Authenticated users can create templates" ON public.templates;

-- Create a new policy that allows both authenticated and anonymous users to create templates
-- but ensures anonymous users can only create public templates
CREATE POLICY "Allow template creation for all users" 
ON public.templates 
FOR INSERT 
WITH CHECK (
  -- If user is authenticated, they must be the creator
  (auth.uid() IS NOT NULL AND auth.uid() = created_by) 
  OR 
  -- If user is anonymous, template must be public and created_by must be null
  (auth.uid() IS NULL AND created_by IS NULL AND is_public = true)
);

-- Update the insert policy to be more permissive for public templates
-- but maintain security for private templates
DROP POLICY IF EXISTS "Users can view their own templates" ON public.templates;

CREATE POLICY "Users can view their own templates" 
ON public.templates 
FOR SELECT 
USING (
  -- Public templates are viewable by everyone
  is_public = true 
  OR 
  -- Private templates only by their creators (if authenticated)
  (auth.uid() IS NOT NULL AND auth.uid() = created_by)
);
