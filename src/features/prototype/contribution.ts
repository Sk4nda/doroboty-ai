import { contributionFields, type Contribution, type ContributionField } from "./model";

export const contributionLabels: Record<ContributionField, { form: string; card: string }> = {
  project: {
    form: "Projekt z Twojej dotychczasowej pracy",
    card: "Projekt",
  },
  ownPart: {
    form: "Co zrobiłeś(-aś) samodzielnie?",
    card: "Część kandydata (deklaracja)",
  },
  teamPart: {
    form: "Kto jeszcze w nim pracował i co zrobił?",
    card: "Część zespołu",
  },
  result: {
    form: "Jaki był rezultat?",
    card: "Rezultat",
  },
  evidence: {
    form: "Skąd wiadomo o tym rezultacie?",
    card: "Skąd to wiadomo",
  },
};

export const MISSING = "brak informacji";

export const TRUTH_NOTE =
  "Karta nie sprawdza, czy kandydat mówi prawdę. Oddziela jego deklarację od pracy zespołu i daje rekruterowi pytania, którymi sprawdzi to na rozmowie.";

/** Returns undefined when the candidate left every field empty. */
export function normalizeContribution(value: Contribution): Contribution | undefined {
  const trimmed = Object.fromEntries(
    contributionFields.map((field) => [field, value[field].trim()]),
  ) as Contribution;
  return contributionFields.some((field) => trimmed[field]) ? trimmed : undefined;
}

function quote(value: string, max = 110) {
  const single = value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?]+$/, "");
  return single.length > max ? `${single.slice(0, max - 1).trimEnd()}…` : single;
}

/**
 * Two interview questions built from a fixed template and the candidate's own words.
 * Deterministic: no model is called and nothing is inferred beyond the card.
 */
export function contributionQuestions(card: Contribution | undefined): [string, string] {
  const c = card ?? { project: "", ownPart: "", teamPart: "", result: "", evidence: "" };
  const project = c.project ? `„${quote(c.project, 80)}”` : "z aplikacji";

  const first = c.ownPart
    ? `Piszesz, że Twoja część to: „${quote(c.ownPart)}”. Która decyzja w projekcie ${project} była Twoja i co zrobiłbyś(-abyś) inaczej, gdyby zespół się z nią nie zgodził?`
    : `Karta nie mówi, co zrobiłeś(-aś) samodzielnie. Opowiedz o projekcie ${project}: co było Twoją pracą, a co pracą zespołu${c.teamPart ? ` (${quote(c.teamPart, 60)})` : ""}?`;

  const second = c.result
    ? c.evidence
      ? `Rezultat „${quote(c.result, 80)}” potwierdza według Ciebie: „${quote(c.evidence, 80)}”. Kto to mierzył, względem czego i jaka część tego wyniku wynika z Twojej pracy?`
      : `Skąd wiadomo, że rezultat „${quote(c.result, 80)}” jest efektem tego projektu? Kto i jak to zmierzył?`
    : "Jaki był mierzalny rezultat tego projektu i jaką jego część przypisujesz swojej pracy?";

  return [first, second];
}
