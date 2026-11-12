import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationRecord } from "./application-record";
import { contributionQuestions } from "./contribution";
import { nextStages, stageLabels, type Application } from "./model";
import { usePrototype } from "./store";

export function RecruitingApplication({ application }: { application: Application }) {
  const { state, run } = usePrototype();
  const [note, setNote] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const statusRef = useRef<HTMLSpanElement>(null);
  const pendingFocus = useRef(false);
  const company = state.companies.find((item) => item.id === application.companyId);
  const availableStages = nextStages[application.stage];
  const questions = contributionQuestions(application.contribution);
  const questionsText = `Pytania na rozmowę (z karty wkładu):\n1. ${questions[0]}\n2. ${questions[1]}`;
  const questionsAdded = note.includes(questionsText);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (pendingFocus.current) {
      statusRef.current?.focus();
      pendingFocus.current = false;
    }
  }, [application.stage]);

  return (
    <>
      <ApplicationRecord
        application={application}
        companyName={company?.name ?? ""}
        audience="employer"
        history={application.events}
        statusRef={statusRef}
        contributionExtra={
          <section
            className="contribution-questions"
            aria-labelledby="contribution-questions-title"
          >
            <h3 id="contribution-questions-title">Dwa pytania na rozmowę</h3>
            <p className="record-caption">
              Złożone z szablonu na podstawie karty. To nie jest ocena ani odpowiedź modelu AI.
            </p>
            <ol>
              <li>{questions[0]}</li>
              <li>{questions[1]}</li>
            </ol>
            {availableStages.length > 0 && (
              <div className="record-actions">
                <Button
                  variant="outline"
                  disabled={questionsAdded}
                  onClick={() => {
                    setNote((current) =>
                      current.trim() ? `${current.trimEnd()}\n\n${questionsText}` : questionsText,
                    );
                    setAnnouncement("Dodano pytania do notatki rekrutacyjnej.");
                    noteRef.current?.focus();
                  }}
                >
                  {questionsAdded ? "Pytania są w notatce" : "Dodaj pytania do notatki"}
                </Button>
              </div>
            )}
          </section>
        }
        footer={
          availableStages.length > 0 ? (
            <>
              <p className="record-caption">Notatka zapisze się w historii po zmianie etapu.</p>
              <div className="record-actions">
                {availableStages.map((stage) => (
                  <Button
                    key={stage}
                    variant={stage === "rejected" ? "outline" : "default"}
                    onClick={() => {
                      if (run({ type: "stage", applicationId: application.id, stage, note })) {
                        setNote("");
                        setAnnouncement(`Zapisano etap: ${stageLabels[stage]}.`);
                        pendingFocus.current = true;
                      }
                    }}
                  >
                    {stageLabels[stage]}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="record-caption">
              {stageLabels[application.stage]}. Brak kolejnych działań w tym procesie.
            </p>
          )
        }
      >
        {availableStages.length > 0 ? (
          <>
            <h3>
              <label htmlFor="recruiting-note">Notatka rekrutacyjna</label>
            </h3>
            <p className="record-caption" id="recruiting-note-hint">
              Widoczna tylko pracodawcy w tym scenariuszu.
            </p>
            <Textarea
              ref={noteRef}
              id="recruiting-note"
              aria-label="Notatka rekrutacyjna (widoczna pracodawcy)"
              aria-describedby="recruiting-note-hint"
              maxLength={12000}
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Co warto sprawdzić w rozmowie?"
            />
          </>
        ) : null}
      </ApplicationRecord>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
