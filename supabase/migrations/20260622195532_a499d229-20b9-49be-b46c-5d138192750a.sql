ALTER TABLE public.prescriptions
  ADD COLUMN IF NOT EXISTS chief_complaints text,
  ADD COLUMN IF NOT EXISTS examination text,
  ADD COLUMN IF NOT EXISTS allergies text;