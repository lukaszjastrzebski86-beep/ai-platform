import OpenAI from "openai";

type ModuleType =
  | "general"
  | "relationships"
  | "emotions"
  | "quiz"
  | "task";

type ResponseMode = "short" | "deep";

type QuizPayload = {
  title: string;
  intro: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
  }>;
  resultGuide: {
    mostlyA: string;
    mostlyB: string;
    mostlyC: string;
  };
};

type TaskPayload = {
  title: string;
  goal: string;
  duration: string;
  steps: string[];
  minimumVersion: string;
  reward: string;
};

type ProfilePreview = {
  displayName?: string;
  title?: string;
  aura?: string;
  accent?: string;
  avatar?: string;
  badge?: string;
  bio?: string;
  clan?: string;
  statusLine?: string;
  tags?: string[];
};

type ThemePreview = {
  themeName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  notice?: string;
  accentFrom?: string;
  accentTo?: string;
  badgeText?: string;
  seasonLabel?: string;
};

function normalizeModule(value: unknown): ModuleType {
  if (
    value === "general" ||
    value === "relationships" ||
    value === "emotions" ||
    value === "quiz" ||
    value === "task"
  ) {
    return value;
  }

  return "general";
}

function normalizeResponseMode(value: unknown): ResponseMode {
  return value === "deep" ? "deep" : "short";
}

function inferTopic(text: string) {
  const value = text.toLowerCase();

  if (
    value.includes("relac") ||
    value.includes("granic") ||
    value.includes("partner") ||
    value.includes("zwiazek") ||
    value.includes("ona") ||
    value.includes("on")
  ) {
    return "relacje";
  }

  if (
    value.includes("emoc") ||
    value.includes("chaos") ||
    value.includes("napi") ||
    value.includes("stres") ||
    value.includes("lek")
  ) {
    return "emocje";
  }

  if (
    value.includes("przeciaz") ||
    value.includes("zmecz") ||
    value.includes("za duzo")
  ) {
    return "przeciazenie";
  }

  return "ogolny";
}

function buildQuiz(topic: string): QuizPayload {
  if (topic === "relacje") {
    return {
      title: "Quiz premium-light // relacja",
      intro:
        "Odpowiedz szybko i intuicyjnie. To psychoedukacyjne spojrzenie na sygnaly, nie diagnoza.",
      questions: [
        {
          id: "q1",
          question: "Po kontakcie z ta osoba czujesz glownie:",
          options: [
            "A) Ulge lub spokoj",
            "B) Mieszane sygnaly",
            "C) Napiecie albo wine",
          ],
        },
        {
          id: "q2",
          question: "Gdy mowisz o granicach, druga strona:",
          options: [
            "A) Slucha i respektuje",
            "B) Reaguje roznie",
            "C) Naciska lub bagatelizuje",
          ],
        },
        {
          id: "q3",
          question: "Na ile mozesz byc soba bez nadmiernego dopasowania?",
          options: ["A) W duzym stopniu", "B) Czescowo", "C) Raczej nie"],
        },
      ],
      resultGuide: {
        mostlyA:
          "Przewaga A: relacja daje wiecej spokoju, ale nadal warto obserwowac fakty i komunikacje.",
        mostlyB:
          "Przewaga B: sytuacja jest mieszana. Najbardziej przyda sie doprecyzowanie granic.",
        mostlyC:
          "Przewaga C: widac sygnaly mocnego tarcia. Wroc do faktow, bezpieczenstwa i prostych granic.",
      },
    };
  }

  if (topic === "emocje" || topic === "przeciazenie") {
    return {
      title: "Quiz premium-light // stan emocjonalny",
      intro:
        "Ten quiz pomaga zobaczyc, czy jestes blizej rownowagi, wahania czy przeciazenia.",
      questions: [
        {
          id: "q1",
          question: "Jak wyglada dzisiaj napiecie w ciele?",
          options: ["A) Niskie", "B) Falujace", "C) Wysokie"],
        },
        {
          id: "q2",
          question: "Jak szybko wracasz do spokoju po trudnym momencie?",
          options: [
            "A) Dosyc szybko",
            "B) Potrzebuje chwili",
            "C) Bardzo trudno",
          ],
        },
        {
          id: "q3",
          question: "Czy wiesz, czego najbardziej potrzebujesz dzisiaj?",
          options: ["A) Tak", "B) Tylko troche", "C) Raczej nie"],
        },
      ],
      resultGuide: {
        mostlyA:
          "Przewaga A: jestes blisko rownowagi. Warto chronic rytm i nie dokladac sobie presji.",
        mostlyB:
          "Przewaga B: to stan mieszany. Pomoga Ci prosty journal i jedno zadanie minimum.",
        mostlyC:
          "Przewaga C: widac sygnaly przeciazenia. Zaczynaj od oddechu, nazwania stanu i mikrokroku.",
      },
    };
  }

  return {
    title: "Quiz premium-light // check-in",
    intro:
      "Krotki test psychoedukacyjny do uporzadkowania stanu i kolejnego ruchu.",
    questions: [
      {
        id: "q1",
        question: "Ile masz dzisiaj jasnosci?",
        options: ["A) Duzo", "B) Troche", "C) Malo"],
      },
      {
        id: "q2",
        question: "Jak oceniasz swoja energie?",
        options: ["A) Stabilna", "B) Nierowna", "C) Niska"],
      },
      {
        id: "q3",
        question: "Czy widzisz jeden kolejny krok?",
        options: ["A) Tak", "B) Zarys", "C) Jeszcze nie"],
      },
    ],
    resultGuide: {
      mostlyA:
        "Przewaga A: mozesz isc w konkret. Najlepiej wykorzystac ten moment na zamkniecie jednej rzeczy.",
      mostlyB:
        "Przewaga B: potrzebujesz doprecyzowania. Journal i plan minimum beda teraz najcenniejsze.",
      mostlyC:
        "Przewaga C: najpierw spokoj i odciazenie, dopiero potem wieksze decyzje.",
    },
  };
}

function buildTask(topic: string): TaskPayload {
  if (topic === "relacje") {
    return {
      title: "Task dnia // mapa sygnalow",
      goal: "Zobaczyc relacje bardziej przez fakty niz przez chaos i domysly.",
      duration: "10 minut",
      steps: [
        "Wypisz dwie sytuacje, po ktorych zostalo w Tobie napiecie.",
        "Dopisuj tylko fakty: co padlo, co sie wydarzylo, co poczules.",
        "Nazwij jedna granice, ktora w tej relacji jest dla Ciebie wazna.",
      ],
      minimumVersion:
        "Wypisz jedna sytuacje i jedno zdanie, ktore bylo dla Ciebie nie okej.",
      reward: "+1 analiza jutro lub +8 diamonds",
    };
  }

  if (topic === "emocje" || topic === "przeciazenie") {
    return {
      title: "Task dnia // reset napiecia",
      goal: "Zejsc z chaosu do mniejszego tarcia i jednego realnego kroku.",
      duration: "5 minut",
      steps: [
        "Nazwij jedna emocje bez oceniania jej.",
        "Zrob 10 spokojnych oddechow z dluzszym wydechem.",
        "Napisz, co jest Twoim jednym zadaniem minimum na dzisiaj.",
      ],
      minimumVersion: "Nazwij emocje i zrob 5 spokojnych oddechow.",
      reward: "+14 light i +10 XP",
    };
  }

  return {
    title: "Task dnia // plan minimum",
    goal: "Zamienic przeciazenie w maly, wykonalny ruch.",
    duration: "8-10 minut",
    steps: [
      "Wybierz jedna rzecz, ktora ma najwiekszy sens na teraz.",
      "Zmniejsz ja do kroku, ktory zajmie mniej niz 10 minut.",
      "Zrob go jeszcze dzisiaj i odhacz jako wygrana.",
    ],
    minimumVersion: "Zrob jeden ruch, ktory potrwa mniej niz 5 minut.",
    reward: "+12 light, +8 XP i lepszy streak",
  };
}

function localReply(
  topic: string,
  module: ModuleType,
  message: string,
  responseMode: ResponseMode
) {
  const insight =
    topic === "relacje"
      ? "Wyglada na to, ze najbardziej potrzebujesz odroznic fakty od interpretacji i zobaczyc, czy ta relacja daje spokoj, czy kosztuje Cie zbyt duzo energii."
      : topic === "emocje" || topic === "przeciazenie"
        ? "Najwazniejsze teraz jest zejsc z przeciazenia do prostszego kontaktu ze soba, zanim pojawia sie kolejne decyzje."
        : "Wyglada na to, ze potrzebujesz nie tyle kolejnej teorii, ile szybkiego uporzadkowania priorytetu.";

  const nowStep =
    module === "task"
      ? "Wybierz jedno male dzialanie na dzisiaj i daj mu 10 minut bez perfekcjonizmu."
      : module === "quiz"
        ? "Uruchom krotki test, nazwij wzorzec i potraktuj wynik jako punkt startu do refleksji."
        : "Nazwij jedna emocje, jeden fakt i jeden kolejny krok. To zwykle najszybciej zmniejsza chaos.";

  const nextStep =
    "Jesli chcesz, moge od razu przejsc w tryb relacje, emocje, quiz albo task i zbudowac Ci bardziej dopasowana odpowiedz.";

  const deepContext =
    topic === "relacje"
      ? "W relacjach najbardziej myli nas mieszanie sygnalow z nadzieja. Dlatego lepiej najpierw nazwac powtarzalne sytuacje i koszty, a dopiero potem wyciagac wieksze wnioski."
      : topic === "emocje" || topic === "przeciazenie"
        ? "Kiedy stan jest rozchwiany, zwykle nie potrzeba wiecej presji, tylko mniej tarcia. Najbardziej pomaga prosty rytm: nazwij stan, uspokoj cialo, wybierz mikrokrok."
        : "Jesli wszystko wydaje sie rozmyte, warto na chwile odsunac wielkie plany i zlapac jeden sensowny ruch. To odbudowuje sprawczosc szybciej niz probowanie ogarnac wszystko naraz.";

  const supportLine =
    message.toLowerCase().includes("nie daje rady") ||
    message.toLowerCase().includes("jest bardzo zle") ||
    message.toLowerCase().includes("nie mam sily") ||
    message.toLowerCase().includes("wszystko mnie przerasta")
      ? "\n\nJesli czujesz, ze potrzebujesz pilnego kontaktu z czlowiekiem, skorzystaj z realnego wsparcia zaufanej osoby lub specjalisty."
      : "";

  if (responseMode === "deep") {
    return `Wniosek:\n${insight}\n${deepContext}\n\nCo zrob teraz:\n${nowStep}\nJesli chcesz, ogranicz ten ruch do jednej rzeczy, ktora da sie wykonac jeszcze dzisiaj bez nadmiernego cisnienia.\n\nCo dalej:\n${nextStep}\nMozemy tez rozpisac to na spokojny plan minimum, prompt do journalu albo quiz dopasowany do Twojej sytuacji.${supportLine}`;
  }

  return `Wniosek:\n${insight}\n\nCo zrob teraz:\n${nowStep}\n\nCo dalej:\n${nextStep}${supportLine}`;
}

function pickPalette(prompt: string) {
  const lowered = prompt.toLowerCase();

  if (lowered.includes("zlot") || lowered.includes("amber")) {
    return { from: "#ffba6b", to: "#ff8d86", accent: "#ffba6b" };
  }

  if (lowered.includes("ziel") || lowered.includes("calm")) {
    return { from: "#7cf0c2", to: "#67d8ff", accent: "#7cf0c2" };
  }

  return { from: "#67d8ff", to: "#ffba6b", accent: "#67d8ff" };
}

function createProfilePreview(prompt: string): {
  preview: ProfilePreview;
  explanation: string;
} {
  const palette = pickPalette(prompt);
  const lowered = prompt.toLowerCase();

  let title = "Guardian of Calm";
  if (lowered.includes("social")) title = "Social Balance Lead";
  if (lowered.includes("spokoj")) title = "Guardian of Calm";
  if (lowered.includes("premium")) title = "Premium Support Guide";

  const avatar =
    lowered.includes("wilk")
      ? "WL"
      : lowered.includes("lis")
        ? "LS"
        : lowered.includes("orzel")
          ? "OR"
          : "PX";

  const preview: ProfilePreview = {
    title,
    accent: palette.accent,
    avatar,
    badge: lowered.includes("founder") ? "Founder badge" : "Daily glow",
    aura: lowered.includes("social")
      ? "Otwartosc, spokoj i nowoczesny social premium vibe."
      : "Lagodny, bezpieczny i wyrazny ton, ktory nie przebodzcowuje.",
    bio: "Ten profil buduje poczucie postepu, bezpieczenstwa i premium tozsamosci w calej aplikacji.",
    statusLine: lowered.includes("social")
      ? "Online now // social premium mode"
      : "Online now // calm premium mode",
    clan: lowered.includes("gold")
      ? "Golden Light Circle"
      : "Aurora Collective",
    tags: lowered.includes("social")
      ? ["social", "clarity", "support"]
      : ["calm", "growth", "premium support"],
  };

  return {
    preview,
    explanation:
      "Podglad podkresla bezpieczny, premium i nowoczesny charakter profilu: wyrazny tytul, spokojny status oraz bardziej lifestyle'owy albo bardziej wyciszony ton zaleznie od promptu.",
  };
}

function createThemePreview(prompt: string): {
  preview: ThemePreview;
  explanation: string;
} {
  const palette = pickPalette(prompt);
  const lowered = prompt.toLowerCase();

  const preview: ThemePreview = {
    themeName: lowered.includes("social") ? "Glow Social" : "Calm Light Studio",
    heroTitle: lowered.includes("social")
      ? "Emocje.\nRelacje.\nCodzienny powrot."
      : "Spokoj.\nJasnosc.\nPremium psychoedukacja.",
    heroSubtitle:
      "Portal laczy AI, journaling, testy, taski, rewardy i mini-gry w jedna nowoczesna aplikacje premium.",
    notice:
      "To produkt psychoedukacyjny: wspiera refleksje i codzienny postep, ale nie zastepuje specjalisty i nie sluzy do diagnozy.",
    accentFrom: palette.from,
    accentTo: palette.to,
    badgeText: lowered.includes("growth")
      ? "Growth mode // conversion ready"
      : "Season live // calm premium",
    seasonLabel: lowered.includes("social")
      ? "Social season"
      : "Calm season",
  };

  return {
    preview,
    explanation:
      "Podglad motywu wzmacnia spokojne swiatlo, premium glow i bardziej konwersyjny hero bez odchodzenia od bezpiecznego, psychoedukacyjnego tonu.",
  };
}

async function generateOpenAIReply(
  message: string,
  module: ModuleType,
  topic: string,
  responseMode: ResponseMode
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Jestes premium AI do psychoedukacji, emocji, relacji i self-helpu.
Mow po polsku.
Nie obiecuj terapii, leczenia ani diagnozy.
Odpowiadaj zyczliwie, nowoczesnie i konkretnie.
Ton ma byc bezpieczny, cieply i premium.
Format odpowiedzi:
1. Wniosek
2. Co zrob teraz
3. Co dalej
Jesli tryb to deep, daj wiecej kontekstu i 5-7 zdan lacznie.
Jesli tryb to short, badz zgrabny i konkretny.
Temat: ${topic}
Modul: ${module}
Tryb: ${responseMode}`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    max_tokens: responseMode === "deep" ? 680 : 360,
  });

  return (
    completion.choices[0].message.content?.trim() ||
    localReply(topic, module, message, responseMode)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action =
      typeof body?.action === "string" ? body.action.toLowerCase() : "chat";

    if (action === "profile") {
      const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

      if (!prompt) {
        return Response.json(
          {
            ok: false,
            error: "NO_PROFILE_PROMPT",
            details: "Brakuje komendy do edycji profilu.",
          },
          { status: 400 }
        );
      }

      const { preview, explanation } = createProfilePreview(prompt);
      return Response.json({
        ok: true,
        preview,
        explanation,
      });
    }

    if (action === "admin") {
      const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

      if (!prompt) {
        return Response.json(
          {
            ok: false,
            error: "NO_ADMIN_PROMPT",
            details: "Brakuje komendy do edycji motywu.",
          },
          { status: 400 }
        );
      }

      const { preview, explanation } = createThemePreview(prompt);
      return Response.json({
        ok: true,
        preview,
        explanation,
      });
    }

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const module = normalizeModule(body?.module);
    const responseMode = normalizeResponseMode(body?.responseMode);

    if (!message) {
      return Response.json(
        {
          ok: false,
          error: "NO_VALID_MESSAGE",
          details: "Brakuje wiadomosci uzytkownika.",
        },
        { status: 400 }
      );
    }

    const topic = inferTopic(message);

    if (module === "quiz") {
      return Response.json({
        ok: true,
        type: "quiz",
        quiz: buildQuiz(topic),
      });
    }

    if (module === "task") {
      return Response.json({
        ok: true,
        type: "task",
        task: buildTask(topic),
      });
    }

    const reply = process.env.OPENAI_API_KEY
      ? await generateOpenAIReply(message, module, topic, responseMode)
      : localReply(topic, module, message, responseMode);

    return Response.json({
      ok: true,
      type: "text",
      reply,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "SYSTEM_CRASH",
        details:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
