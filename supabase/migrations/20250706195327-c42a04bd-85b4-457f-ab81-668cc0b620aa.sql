
-- Create templates table for shareable message templates
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  views_count INTEGER DEFAULT 0,
  uses_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public templates are viewable by all" ON public.templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own templates" ON public.templates
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create templates" ON public.templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON public.templates
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates" ON public.templates
  FOR DELETE USING (auth.uid() = created_by);

-- Create indexes for performance
CREATE INDEX idx_templates_slug ON public.templates(slug);
CREATE INDEX idx_templates_public ON public.templates(is_public);
CREATE INDEX idx_templates_created_by ON public.templates(created_by);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.templates 
  SET uses_count = uses_count + 1 
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment template views
CREATE OR REPLACE FUNCTION increment_template_views(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.templates 
  SET views_count = views_count + 1 
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
