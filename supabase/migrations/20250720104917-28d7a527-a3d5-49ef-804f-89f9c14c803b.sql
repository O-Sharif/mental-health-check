-- Create table for mental reset entries
CREATE TABLE public.mental_reset_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  activities TEXT[] NOT NULL,
  custom_activity TEXT,
  control_answer TEXT,
  not_my_job_answer TEXT,
  five_days_answer TEXT,
  next_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mental_reset_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own mental reset entries" 
ON public.mental_reset_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mental reset entries" 
ON public.mental_reset_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mental reset entries" 
ON public.mental_reset_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mental reset entries" 
ON public.mental_reset_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mental_reset_entries_updated_at
BEFORE UPDATE ON public.mental_reset_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();