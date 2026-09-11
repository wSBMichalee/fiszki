-- =======================================================
-- MIGRACJA 002: Dodanie kolumny "subject" (przedmiot) do decks
-- Uruchom w Supabase Dashboard -> SQL Editor -> Run
-- =======================================================

ALTER TABLE public.decks ADD COLUMN IF NOT EXISTS subject text;
