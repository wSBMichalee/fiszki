-- 1. Tworzenie nowego bucketu na zdjęcia (public=true pozwala na bezproblemowe wyświetlanie obrazków w UI za pomocą publicznego URL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('deck-images', 'deck-images', true)
ON CONFLICT (id) DO NOTHING;

-- Upewnij się, że Row Level Security jest włączone dla obiektów w Storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. POLICY DLA ODCZYTU: Każdy może wyświetlić (pobrać) zdjęcia
CREATE POLICY "Publiczny dostęp do odczytu zdjęć" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'deck-images');

-- 3. POLICY DLA ZAPISU (UPLOAD): Tylko zalogowani użytkownicy mogą dodawać zdjęcia
CREATE POLICY "Tylko zalogowani mogą wgrywać zdjęcia" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'deck-images' 
  AND auth.role() = 'authenticated'
);

-- 4. POLICY DLA USUWANIA: Użytkownik może usunąć tylko plik, który sam wgrał
CREATE POLICY "Użytkownicy mogą usuwać własne zdjęcia" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'deck-images' 
  AND auth.uid() = owner
);

-- 5. POLICY DLA AKTUALIZACJI: Użytkownik może nadpisać tylko własny plik
CREATE POLICY "Użytkownicy mogą nadpisywać własne zdjęcia" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'deck-images' 
  AND auth.uid() = owner
);
