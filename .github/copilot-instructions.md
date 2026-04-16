---
applyTo: "**"
---

# Quantum workspace instructions

## Główny sposób pracy
- Pracuj jak główny agent wykonawczy dla tego projektu.
- Zawsze zaczynaj od krótkiego planu.
- Potem wykonuj zmiany samodzielnie w plikach.
- Po większych etapach uruchamiaj realny build lokalnie.
- Jeśli build lub typy wykażą błędy, naprawiaj je aż projekt przejdzie.
- Na końcu dawaj krótkie podsumowanie:
  - co zmieniłeś,
  - jakie pliki dodałeś,
  - jakie pliki edytowałeś,
  - czy build przechodzi.

## Zasady wykonawcze
- Nie pytaj o oczywiste techniczne drobiazgi.
- Jeśli coś jest ewidentnie zepsute, napraw to od razu.
- Nie zostawiaj pustych, niedokończonych albo martwych plików.
- Zachowuj kompatybilność z Next.js App Router.
- Nie psuj działających endpointów API.
- Jeśli trzeba, twórz nowe komponenty, helpery, providery i style.
- Jeśli trzeba, porządkuj strukturę plików, ale bez chaosu.

## Workflow jakości
- Najpierw analiza, potem implementacja, potem realny build.
- Nie zgaduj wyniku buildu.
- Nie pisz, że coś "powinno działać", jeśli nie zostało realnie sprawdzone.
- Jeśli narzędzia nie są dostępne, zgłoś to wprost.
- Jeśli build nie przechodzi, nie kończ pracy jako "gotowe".

## Git i publikacja
- Nie rób git push bez wyraźnej zgody użytkownika.
- Nie publikuj na Vercel bez wyraźnej zgody użytkownika.
- Commit możesz przygotować dopiero po poprawnym buildzie.
- Przy commitach używaj krótkich, sensownych nazw opisujących zmianę.

## Priorytety projektu
- Produkt ma wyglądać jak nowoczesny portal gamingowo-socialowy.
- UX ma być premium, żywy, atrakcyjny i wciągający.
- Preferuj:
  - lepszą hierarchię wizualną,
  - animacje,
  - microinteractions,
  - spójny layout,
  - dopracowane karty,
  - czytelne stany aplikacji,
  - grywalizację,
  - osobne podstrony zamiast jednej długiej strony.
- Jeśli coś można poprawić wizualnie bez rozwalania architektury, popraw to.

## Architektura produktu
- Użytkownik końcowy ma widzieć jedno spójne AI.
- Logika agentowa ma być ukryta pod maską.
- Portal ma rozwijać się w stronę:
  - AI chat,
  - relacji,
  - emocji,
  - quizów,
  - zadań,
  - rewardów,
  - gier,
  - profilu,
  - admin studio,
  - personalizacji.

## Styl kodu
- Pisz kod prosty, czytelny i produkcyjny.
- Unikaj zbędnego komplikowania.
- Rozbijaj zbyt duże komponenty.
- Unikaj duplikacji.
- Utrzymuj spójne nazewnictwo.
- Jeśli dodajesz stan globalny, zrób to porządnie i konsekwentnie.

To będzie działało jako always-on instructions dla tego repo.
