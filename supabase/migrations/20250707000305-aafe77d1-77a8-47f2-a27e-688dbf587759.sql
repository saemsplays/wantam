
-- Create verified_emails table for recommended email addresses
CREATE TABLE public.verified_emails (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email_address TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  trust_score INTEGER NOT NULL DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT DEFAULT 'general'
);

-- Enable Row Level Security
ALTER TABLE public.verified_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to verified emails
CREATE POLICY "Public read access to verified emails" 
ON public.verified_emails 
FOR SELECT 
USING (is_verified = true);

-- Insert some sample verified email addresses
INSERT INTO public.verified_emails (email_address, display_name, trust_score, category) VALUES
('clerk@parliament.go.ke', 'Parliament Clerk Office', 95, 'government'),
('info@treasury.go.ke', 'National Treasury', 90, 'government'),
('contact@caj.go.ke', 'Commission on Administrative Justice', 85, 'government'),
('info@eacc.go.ke', 'Ethics and Anti-Corruption Commission', 88, 'government'),
('media@nation.co.ke', 'Nation Media Group', 75, 'media');
