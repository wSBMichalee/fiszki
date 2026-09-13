-- Migracja dodająca kolumnę do śledzenia ostatniej nauki z zestawu

ALTER TABLE public.decks 
ADD COLUMN last_studied_at TIMESTAMP WITH TIME ZONE;
