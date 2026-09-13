-- Dodanie tablicy tekstowej przechowującej adresy publiczne oryginalnych obrazków
ALTER TABLE public.decks 
ADD COLUMN source_image_urls TEXT[] DEFAULT '{}';
