-- Dodanie indeksu na klucz obcy (deck_id) w tabeli cards.
-- W PostgreSQL klucze obce nie tworzą automatycznie indeksów, a brak tego indeksu 
-- powoduje Sequential Scan (przeszukiwanie całej tabeli cards) przy pobieraniu fiszek dla danego zestawu.

CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
