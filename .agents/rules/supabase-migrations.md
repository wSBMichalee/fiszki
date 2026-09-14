# Reguła: Migracje Supabase wymagają ręcznego potwierdzenia

## Kontekst

Integracja GitHub → Supabase **nie aplikuje migracji automatycznie**, jeśli
build na Vercelu padnie przy pierwszej próbie (nawet jeśli kolejny commit go
naprawia). Powtórzyło się to dwukrotnie w tej samej sesji i kosztowało 2h
debugowania błędu `PGRST204 "Could not find the column"`.

## Reguła obowiązkowa

**Za każdym razem, gdy sesja kończy się commitami zawierającymi nowy plik
migracji SQL (`supabase/migrations/NNN_*.sql`), na końcu odpowiedzi MUSISZ
umieścić widoczne przypomnienie w formacie:**

> ⚠️ **Migracja `NNN_nazwa.sql` wymaga ręcznego potwierdzenia.**
> Sprawdź w **Supabase Dashboard → Database → Migrations** czy widnieje jako
> zaaplikowana. Jeśli nie — wklej SQL ręcznie w **SQL Editor** w Dashboardzie.
> Integracja GitHub-Supabase może nie zadziałać, jeśli poprzedni build na
> Vercelu padł przy pierwszej próbie.

## Kiedy stosować

- Przy każdym commicie/pushu zawierającym nowy plik `supabase/migrations/`.
- Niezależnie od tego, czy build przeszedł za pierwszym razem, czy nie.
- Nawet jeśli integracja GitHub-Supabase jest skonfigurowana i "powinna"
  działać — traktuj ją jako "best-effort", nie jako gwarancję.
