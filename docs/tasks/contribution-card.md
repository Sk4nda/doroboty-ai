# Karta wkładu kandydata (P1)

## Intent and scope

Problem z discovery: rekruter przed rozmową nie wie, co kandydat zrobił sam, a co zespół (Match Score ≥ 85 przechodził dalej tylko w 17,9% rozmów). Prototyp sprawdza, czy rekruter bez wiedzy technicznej, mając kartę wkładu i dwa pytania, szybciej i pewniej zaprosi właściwą osobę na rozmowę.

- Kandydat przy aplikowaniu wypełnia opcjonalną kartę wkładu: projekt, moja część, część zespołu, rezultat, skąd wiadomo o rezultacie.
- Pracodawca w `/#/app/kandydaci/:id` widzi zakładkę „Karta wkładu”. Puste pole to jawne „brak informacji”, nigdy wymyślona wartość.
- Pracodawca widzi dwa pytania na rozmowę złożone z szablonu (deterministycznie, bez modelu AI) i może dodać je do notatki rekrutacyjnej. Notatka trafia do historii po zmianie etapu, tak jak dotąd.
- Kandydat widzi własną kartę w swojej aplikacji (bez pytań i notatek pracodawcy).

Poza zakresem: weryfikacja prawdziwości deklaracji, ranking, zmiana Match Score, prawdziwy model AI.

## Design and reuse

Bez nowej rodziny wizualnej. Formularz: istniejące `application-form-section`, `Field`, `Textarea`, `Input`. Szczegół: trzecia sekcja istniejącego `RecordSheet`, lista `<dl>` w typografii `record-reading`, przyciski `Button` w `record-actions`, podpis `record-caption`. Brak danych w stylu jak `pp-salary-missing` (wyciszony tekst). Kontur i tokeny z istniejących reguł.

Dane: `contribution` opcjonalne w aplikacji i szkicu (zgodność wstecz z zapisami i importem `version: 1`). Wysłana karta jest migawką jak odpowiedź i CV.

## Acceptance criteria

- Anna aplikuje na „AI Product Manager” z kartą; Karolina widzi kartę z pięcioma polami i dwoma pytaniami odnoszącymi się do treści karty.
- Aplikacja Marka (bez karty) pokazuje „brak informacji” we wszystkich polach i pytania dla braku danych.
- „Dodaj pytania do notatki” wstawia pytania do notatki; po „W przeglądzie” → „Zaproszenie na rozmowę” notatka z pytaniami jest w historii procesu.
- Aplikacja bez karty (pola puste) nadal się wysyła; istniejące etapy, notatki, CV i Match Score działają jak wcześniej.
- Na karcie widnieje zdanie: „Karta nie sprawdza, czy kandydat mówi prawdę. Oddziela jego deklarację od pracy zespołu i daje rekruterowi pytania, którymi sprawdzi to na rozmowie.”
- Szerokości 1280/390/320 bez poziomego przewijania; zakładki obsługiwane klawiaturą.
- `./scripts/verify` przechodzi albo różnice są opisane.

## Validation and review

2026-11-12, Windows, Node 24.22.1:

- Przejście w przeglądarce (dev server): Anna aplikuje z pełną kartą → Karolina otwiera „Karta wkładu” → „W przeglądzie” → „Dodaj pytania do notatki” → „Zaproszenie na rozmowę”. Wynik: etap `interview_invited`, notatka z dwoma pytaniami w historii. Marek bez karty: pięć razy „brak informacji” i pytania o brak danych. Widok kandydatki: karta bez pytań, bez notatek pracodawcy i bez zdania o prawdziwości. Brak poziomego przewijania przy 1280/390/320.
- Zakładka „Karta wkładu” jest trzecia (po „Odpowiedź” i „CV”), żeby zachować istniejącą nawigację strzałkami Odpowiedź → CV z testów e2e.
- `npm run lint`, `npm run typecheck`, `npm test` (33 testy, w tym 6 nowych w `contribution.test.ts`) i `npm run build` przechodzą.
- `npm run format:check`, `npm run design-system:check` i `npm run verify:packet` nie przechodzą w tym klonie: Git z `core.autocrlf=true` zapisał pliki z CRLF, a kontrole porównują format/sumy kontrolne plików, których ta zmiana nie dotyka (`git status` nie pokazuje zmian w `docs/design-system` ani `public/case`). Zmienione pliki są sformatowane Prettierem.
- `npm run test:e2e` nie uruchomione: brak zainstalowanej przeglądarki Playwright Chromium.
- Otwarte: osobny przegląd kodu; e2e po zainstalowaniu Chromium.
