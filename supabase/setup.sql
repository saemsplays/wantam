
-- =============================================
-- CEKA APP DATABASE SETUP
-- =============================================

-- 1. PROFILES TABLE (extends auth.users)
-- Stores additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  county TEXT,
  constituency TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. LEGISLATIVE BILLS TABLE
-- Stores information about bills in the National Assembly
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_text TEXT,
  status TEXT NOT NULL CHECK (status IN ('First Reading', 'Second Reading', 'Committee Stage', 'Third Reading', 'Presidential Assent', 'Enacted', 'Withdrawn')),
  category TEXT NOT NULL CHECK (category IN ('Finance', 'Health', 'Education', 'Environment', 'Agriculture', 'Infrastructure', 'Security', 'Governance', 'Other')),
  bill_number TEXT UNIQUE,
  sponsor TEXT,
  date_introduced DATE,
  last_activity DATE DEFAULT CURRENT_DATE,
  parliament_url TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on bills
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bills
CREATE POLICY "Anyone can view bills" ON public.bills FOR SELECT USING (true);
CREATE POLICY "Only admins can manage bills" ON public.bills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 3. BILL FOLLOWS TABLE
-- Tracks which bills users are following
CREATE TABLE public.bill_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, bill_id)
);

-- Enable RLS on bill_follows
ALTER TABLE public.bill_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bill_follows
CREATE POLICY "Users can view their followed bills" ON public.bill_follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can follow bills" ON public.bill_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unfollow bills" ON public.bill_follows FOR DELETE USING (auth.uid() = user_id);

-- 4. USER CONTRIBUTIONS TABLE
-- Stores anonymous contributions about bills/legislation
CREATE TABLE public.user_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('URL', 'Document', 'Text')),
  url TEXT,
  file_url TEXT,
  ai_summary TEXT,
  ai_category TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_contributions
ALTER TABLE public.user_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_contributions
CREATE POLICY "Anyone can submit contributions" ON public.user_contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view approved contributions" ON public.user_contributions FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Admins can manage all contributions" ON public.user_contributions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 5. EDUCATIONAL RESOURCES TABLE
-- Stores civic education materials
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('Article', 'PDF', 'Video', 'Infographic', 'Quiz')),
  url TEXT,
  file_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Constitution', 'Governance', 'Rights', 'Participation', 'Budget', 'Elections', 'County Government')),
  tags TEXT[],
  is_downloadable BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 6. COMMUNITY DISCUSSIONS TABLE
-- Stores forum discussions
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('General', 'Bills Discussion', 'Civic Issues', 'Success Stories', 'Questions')),
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on discussions
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussions
CREATE POLICY "Anyone can view discussions" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON public.discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own discussions" ON public.discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own discussions or admins can delete any" ON public.discussions FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 7. DISCUSSION REPLIES TABLE
-- Stores replies to discussions
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on discussion_replies
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussion_replies
CREATE POLICY "Anyone can view replies" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.discussion_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies or admins can delete any" ON public.discussion_replies FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 8. VOLUNTEER OPPORTUNITIES TABLE
-- Stores volunteer opportunities
CREATE TABLE public.volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  location TEXT NOT NULL,
  county TEXT,
  type TEXT NOT NULL CHECK (type IN ('Local', 'Grassroots', 'Online', 'Hybrid')),
  commitment TEXT NOT NULL CHECK (commitment IN ('One-time', 'Short-term', 'Long-term', 'Ongoing')),
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  contact_email TEXT,
  contact_phone TEXT,
  external_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  applicants_count INTEGER DEFAULT 0,
  max_applicants INTEGER,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on volunteer_opportunities
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for volunteer_opportunities
CREATE POLICY "Anyone can view active opportunities" ON public.volunteer_opportunities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage opportunities" ON public.volunteer_opportunities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 9. VOLUNTEER APPLICATIONS TABLE
-- Tracks volunteer applications
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(opportunity_id, user_id)
);

-- Enable RLS on volunteer_applications
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for volunteer_applications
CREATE POLICY "Users can view their own applications" ON public.volunteer_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can apply for opportunities" ON public.volunteer_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can withdraw their applications" ON public.volunteer_applications FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'accepted'));
CREATE POLICY "Admins can manage all applications" ON public.volunteer_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 10. CIVIC EVENTS TABLE
-- Stores civic events and workshops
CREATE TABLE public.civic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Workshop', 'Training', 'Public Participation', 'Town Hall', 'Webinar', 'Conference')),
  location TEXT,
  venue TEXT,
  county TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  contact_email TEXT,
  contact_phone TEXT,
  organizer TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on civic_events
ALTER TABLE public.civic_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for civic_events
CREATE POLICY "Anyone can view active events" ON public.civic_events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage events" ON public.civic_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 11. EVENT REGISTRATIONS TABLE
-- Tracks event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.civic_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all registrations" ON public.event_registrations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 12. NOTIFICATIONS TABLE
-- Stores user notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bill_update', 'event_reminder', 'discussion_reply', 'general')),
  related_id UUID, -- Can reference bills, events, discussions, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON public.discussion_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON public.volunteer_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_civic_events_updated_at BEFORE UPDATE ON public.civic_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update discussion reply count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count + 1,
        last_activity_at = now()
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count - 1,
        last_activity_at = now()
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update reply count
CREATE TRIGGER update_discussion_reply_count_trigger
  AFTER INSERT OR DELETE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION update_discussion_reply_count();

-- Function to update volunteer application count
CREATE OR REPLACE FUNCTION update_volunteer_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.volunteer_opportunities 
    SET applicants_count = applicants_count + 1
    WHERE id = NEW.opportunity_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.volunteer_opportunities 
    SET applicants_count = applicants_count - 1
    WHERE id = OLD.opportunity_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update application count
CREATE TRIGGER update_volunteer_application_count_trigger
  AFTER INSERT OR DELETE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION update_volunteer_application_count();

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample bills
INSERT INTO public.bills (title, summary, status, category, bill_number, sponsor, date_introduced) VALUES 
('Finance Bill 2025', 'A bill to amend various tax laws and introduce new fiscal measures for the 2025/2026 financial year.', 'Second Reading', 'Finance', 'Bill No. 19 of 2025', 'National Treasury', '2025-04-01'),
('Public Health Amendment Bill 2025', 'A bill to strengthen the public health system and improve healthcare delivery.', 'Committee Stage', 'Health', 'Bill No. 12 of 2025', 'Ministry of Health', '2025-03-15'),
('Education Technology Bill 2025', 'A bill to integrate technology in education and establish digital learning frameworks.', 'First Reading', 'Education', 'Bill No. 8 of 2025', 'Ministry of Education', '2025-04-10');

-- Insert sample resources
INSERT INTO public.resources (title, description, type, category, url) VALUES 
('Understanding Your Constitutional Rights', 'A comprehensive guide to the rights guaranteed under the Constitution of Kenya 2010.', 'Article', 'Constitution', '/resources/constitutional-rights'),
('How to Participate in Public Participation', 'Step-by-step guide on how citizens can participate in government decision-making.', 'PDF', 'Participation', '/resources/public-participation-guide.pdf'),
('County Government Functions Explained', 'An infographic showing the roles and responsibilities of county governments.', 'Infographic', 'County Government', '/resources/county-functions.png');

-- Insert sample volunteer opportunities
INSERT INTO public.volunteer_opportunities (title, organization, description, location, type, commitment, start_date, contact_email) VALUES 
('Civic Education Volunteer', 'CEKA Foundation', 'Help educate communities about their civic rights and responsibilities.', 'Nairobi', 'Local', 'Ongoing', '2025-05-01', 'volunteers@ceka.org'),
('Digital Literacy Trainer', 'Kenya ICT Board', 'Train citizens on digital skills and online civic participation.', 'Mombasa', 'Local', 'Short-term', '2025-06-01', 'training@ictboard.go.ke'),
('Online Content Creator', 'Transparency International Kenya', 'Create content about governance and transparency.', 'Remote', 'Online', 'Long-term', '2025-05-15', 'content@tikenya.org');

-- Insert sample events
INSERT INTO public.civic_events (title, description, event_type, location, start_date, end_date, organizer) VALUES 
('Understanding the Finance Bill 2025', 'A public forum to discuss the implications of the Finance Bill 2025.', 'Public Participation', 'KICC, Nairobi', '2025-05-20 09:00:00+03', '2025-05-20 17:00:00+03', 'National Assembly'),
('Civic Education Workshop', 'Learn about your rights and how to engage with government.', 'Workshop', 'Mombasa Technical Training Institute', '2025-06-05 10:00:00+03', '2025-06-05 16:00:00+03', 'CEKA Foundation'),
('Youth Leadership Training', 'Empowering young people to become civic leaders.', 'Training', 'University of Nairobi', '2025-06-15 08:00:00+03', '2025-06-17 18:00:00+03', 'Youth Leadership Network');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Enable realtime for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bills;
