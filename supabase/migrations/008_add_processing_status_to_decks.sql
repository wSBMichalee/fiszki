-- Dodanie kolumn śledzących status asynchronicznego generowania fiszek
ALTER TABLE decks ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'completed';
ALTER TABLE decks ADD COLUMN IF NOT EXISTS processing_error TEXT;

-- Aktualizujemy obecne decki na 'completed', bo zostały już przetworzone synchronicznie
UPDATE decks SET processing_status = 'completed' WHERE processing_status IS NULL;
