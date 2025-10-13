-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  typical_cycle_length INTEGER DEFAULT 28,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create cycles table for period tracking
CREATE TABLE public.cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  cycle_length INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;

-- Cycles policies
CREATE POLICY "Users can view own cycles"
  ON public.cycles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles"
  ON public.cycles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles"
  ON public.cycles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycles"
  ON public.cycles FOR DELETE
  USING (auth.uid() = user_id);

-- Create symptom_logs table
CREATE TABLE public.symptom_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  mood TEXT,
  cramps_severity INTEGER CHECK (cramps_severity >= 0 AND cramps_severity <= 10),
  flow_intensity TEXT CHECK (flow_intensity IN ('none', 'spotting', 'light', 'medium', 'heavy')),
  fatigue_level INTEGER CHECK (fatigue_level >= 0 AND fatigue_level <= 10),
  acne_severity INTEGER CHECK (acne_severity >= 0 AND acne_severity <= 10),
  bloating_level INTEGER CHECK (bloating_level >= 0 AND bloating_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 0 AND sleep_quality <= 10),
  pcos_hair_growth BOOLEAN DEFAULT false,
  pcos_hair_loss BOOLEAN DEFAULT false,
  pcos_weight_change NUMERIC(5,2),
  insulin_notes TEXT,
  other_symptoms TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

-- Symptom logs policies
CREATE POLICY "Users can view own symptom logs"
  ON public.symptom_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom logs"
  ON public.symptom_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom logs"
  ON public.symptom_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom logs"
  ON public.symptom_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at
  BEFORE UPDATE ON public.cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symptom_logs_updated_at
  BEFORE UPDATE ON public.symptom_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();