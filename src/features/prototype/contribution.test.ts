import { describe, expect, it } from "vitest";
import { initialState, stateSchema, transition, type State } from "./model";
import { contributionQuestions, normalizeContribution } from "./contribution";

const time = "2026-11-03T10:00:00.000Z";
const card = {
  project: "Asystent do zgłoszeń",
  ownPart: "Badania z 18 agentami i decyzja, że asystent tylko proponuje odpowiedź.",
  teamPart: "Dwóch inżynierów zbudowało integrację.",
  result: "Czas obsługi skrócił się o 30%.",
  evidence: "Raport analityczki po 8 tygodniach.",
};
function as(state: State, id: string) {
  return transition(state, { type: "select_person", id });
}
function submit(contribution?: typeof card) {
  const s = as(initialState(), "candidate-anna");
  return transition(
    s,
    {
      type: "submit",
      jobId: s.jobs[0].id,
      notes: "",
      generated: "",
      answer: "Approved application with sufficient context.",
      contribution,
      consent: true,
    },
    time,
    "application-anna",
  );
}

describe("contribution card", () => {
  it("stores the card as a submitted snapshot and keeps applications without a card valid", () => {
    const withCard = submit(card).applications.find((x) => x.id === "application-anna")!;
    expect(withCard.contribution).toEqual(card);
    const without = submit().applications.find((x) => x.id === "application-anna")!;
    expect(without.contribution).toBeUndefined();
    expect(initialState().applications[0].contribution).toBeUndefined();
  });

  it("accepts older saved state without the optional field", () => {
    const legacy = JSON.parse(JSON.stringify(initialState()));
    for (const a of legacy.applications) delete a.contribution;
    expect(() => stateSchema.parse(legacy)).not.toThrow();
  });

  it("treats an all-empty card as missing and trims values", () => {
    expect(
      normalizeContribution({ project: " ", ownPart: "", teamPart: "", result: "", evidence: "" }),
    ).toBeUndefined();
    expect(normalizeContribution({ ...card, project: "  Projekt  " })?.project).toBe("Projekt");
  });

  it("builds deterministic questions from the candidate's own words", () => {
    const [first, second] = contributionQuestions(card);
    expect(first).toContain("Badania z 18 agentami");
    expect(first).toContain("„Asystent do zgłoszeń”");
    expect(second).toContain("Raport analityczki po 8 tygodniach");
    expect(second).not.toContain(".”.");
    expect(contributionQuestions(card)).toEqual([first, second]);
  });

  it("asks about missing information instead of inventing it", () => {
    const [first, second] = contributionQuestions(undefined);
    expect(first).toContain("Karta nie mówi, co zrobiłeś(-aś) samodzielnie");
    expect(second).toContain("Jaki był mierzalny rezultat");
    const [, noEvidence] = contributionQuestions({ ...card, evidence: "" });
    expect(noEvidence).toContain("Skąd wiadomo");
  });

  it("lets the employer carry the questions into the invitation history", () => {
    let s = as(submit(card), "employer-brightlabs");
    s = transition(
      s,
      { type: "stage", applicationId: "application-anna", stage: "reviewed", note: "" },
      time,
    );
    const note = contributionQuestions(card).join("\n");
    s = transition(
      s,
      { type: "stage", applicationId: "application-anna", stage: "interview_invited", note },
      time,
    );
    const app = s.applications.find((x) => x.id === "application-anna")!;
    expect(app.stage).toBe("interview_invited");
    expect(app.events.at(-1)?.note).toContain("Badania z 18 agentami");
    expect(app.contribution).toEqual(card);
  });
});
