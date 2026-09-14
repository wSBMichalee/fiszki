-- Dodanie opcjonalnej kolumny topic do tabeli decks, która pomaga AI lepiej zrozumieć kontekst
ALTER TABLE public.decks ADD COLUMN IF NOT EXISTS topic text;
