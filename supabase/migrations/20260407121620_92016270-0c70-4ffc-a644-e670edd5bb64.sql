
-- Create enum for medicine type
CREATE TYPE public.medicine_type AS ENUM ('TAB', 'CAP', 'SYR', 'INJ', 'OINT', 'DROP', 'OTHER');

-- Medicines master table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type medicine_type NOT NULL DEFAULT 'TAB',
  composition TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, type)
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Anyone can insert medicines" ON public.medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update medicines" ON public.medicines FOR UPDATE USING (true);

-- Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  patient_phone TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bp TEXT,
  pulse TEXT,
  spo2 TEXT,
  diagnosis TEXT,
  prescribed_tests TEXT,
  next_appointment DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prescriptions" ON public.prescriptions FOR SELECT USING (true);
CREATE POLICY "Anyone can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update prescriptions" ON public.prescriptions FOR UPDATE USING (true);

-- Prescription medicines junction table
CREATE TABLE public.prescription_medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  medicine_type medicine_type NOT NULL DEFAULT 'TAB',
  composition TEXT,
  dosage_morning INTEGER NOT NULL DEFAULT 0,
  dosage_afternoon INTEGER NOT NULL DEFAULT 0,
  dosage_night INTEGER NOT NULL DEFAULT 0,
  timing_freq_duration TEXT,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescription_medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prescription medicines" ON public.prescription_medicines FOR SELECT USING (true);
CREATE POLICY "Anyone can insert prescription medicines" ON public.prescription_medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update prescription medicines" ON public.prescription_medicines FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete prescription medicines" ON public.prescription_medicines FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
