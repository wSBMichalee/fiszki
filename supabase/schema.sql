-- =======================================================
-- SCHEMAT BAZY DANYCH DLA FISZKI (SUPABASE POSTGRESQL)
-- Wklej tę treść w Supabase Dashboard -> SQL Editor -> Run
-- =======================================================

-- 1. Tabela zestawów fiszek (decks)
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  subject text,
  source_image_urls text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dla istniejących baz danych uruchom migrację:
-- ALTER TABLE public.decks ADD COLUMN IF NOT EXISTS subject text;

-- 2. Tabela pojedynczych kart / pytań (cards)
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.decks(id) on delete cascade not null,
  question text not null,
  answer text not null,
  learned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Włączenie Row Level Security (RLS)
alter table public.decks enable row level security;
alter table public.cards enable row level security;

-- 4. Polityki bezpieczeństwa dla tabeli decks (użytkownik widzi i edytuje tylko swoje zestawy)
create policy "Użytkownicy mogą przeglądać swoje zestawy"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Użytkownicy mogą tworzyć swoje zestawy"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Użytkownicy mogą edytować swoje zestawy"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Użytkownicy mogą usuwać swoje zestawy"
  on public.decks for delete
  using (auth.uid() = user_id);

-- 5. Polityki bezpieczeństwa dla tabeli cards (użytkownik ma dostęp tylko do kart ze swoich zestawów)
create policy "Użytkownicy mogą przeglądać karty ze swoich zestawów"
  on public.cards for select
  using (
    exists (
      select 1 from public.decks
      where public.decks.id = public.cards.deck_id
      and public.decks.user_id = auth.uid()
    )
  );

create policy "Użytkownicy mogą dodawać karty do swoich zestawów"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.decks
      where public.decks.id = public.cards.deck_id
      and public.decks.user_id = auth.uid()
    )
  );

create policy "Użytkownicy mogą aktualizować karty w swoich zestawach"
  on public.cards for update
  using (
    exists (
      select 1 from public.decks
      where public.decks.id = public.cards.deck_id
      and public.decks.user_id = auth.uid()
    )
  );

create policy "Użytkownicy mogą usuwać karty ze swoich zestawów"
  on public.cards for delete
  using (
    exists (
      select 1 from public.decks
      where public.decks.id = public.cards.deck_id
      and public.decks.user_id = auth.uid()
    )
  );

-- Indeks dla zapytań o karty z danego zestawu (uniknięcie seq scan)
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
