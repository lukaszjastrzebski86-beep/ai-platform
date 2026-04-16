Dobra — teraz błąd jest już bardzo konkretny:

```txt
app/layout.tsx
Type error: File '/vercel/path0/app/layout.tsx' is not a module.
```

To znaczy prawie zawsze jedno z 3:

1. `app/layout.tsx` jest pusty
2. `app/layout.tsx` nie ma `export default`
3. wkleił się tam tekst, ale nie jest poprawnym komponentem

## Naprawa

Podmień **cały** plik `app/layout.tsx` na to:

```tsx id="uznq2e"
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heavenly AI Portal",
  description:
    "AI portal for relationships, emotions, quizzes, rewards and games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
```

## Co zrobić dokładnie

### 1.

W VS Code kliknij:
`app` → `layout.tsx`

### 2.

Usuń wszystko z tego pliku

### 3.

Wklej kod wyżej

### 4.

Zapisz:

```text
Ctrl + S
```

## 5. Potem w terminalu

Wpisz po kolei:

```bash id="xnb5n2"
git add app/layout.tsx
git commit -m "Fix app layout module"
git push
```

---

## Jeśli chcesz sprawdzić przed pushem

Plik `app/layout.tsx` musi:

* **nie być pusty**
* mieć:

```tsx
export default function RootLayout(...)
```

* importować:

```tsx
import "./globals.css";
```

---

## Jeśli po tym dalej wywali

To wtedy następny kandydat to:

* plik zapisany w złym kodowaniu
* jakiś ukryty śmieć na początku pliku
* albo `globals.css` ma tak zły błąd składni, że layout się sypie przy imporcie

Ale najpierw zrób ten fix, bo to jest główny problem.

Jak zapiszesz i wypchniesz, pokaż następny log z Vercela.

1 - 1
