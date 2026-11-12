import type { ReactNode } from "react";
import { contributionFields, type Contribution } from "./model";
import { contributionLabels, MISSING, TRUTH_NOTE } from "./contribution";

/** Read-only contribution card. Empty fields stay visibly empty, never filled in. */
export function ContributionCard({
  contribution,
  audience,
  children,
}: {
  contribution: Contribution | undefined;
  audience: "candidate" | "employer";
  children?: ReactNode;
}) {
  return (
    <div className="contribution-card">
      <h3>Karta wkładu</h3>
      <p className="record-caption">
        {audience === "employer"
          ? contribution
            ? "Deklaracja kandydata z momentu aplikowania."
            : "Kandydat nie wypełnił karty wkładu przy tej aplikacji."
          : "Tak pracodawca widzi Twoją kartę wkładu."}
      </p>
      <dl className="contribution-list">
        {contributionFields.map((field) => {
          const value = contribution?.[field] ?? "";
          return (
            <div key={field} className="contribution-row" data-missing={!value || undefined}>
              <dt>{contributionLabels[field].card}</dt>
              <dd>{value || <span className="contribution-missing">{MISSING}</span>}</dd>
            </div>
          );
        })}
      </dl>
      {audience === "employer" && <p className="contribution-truth">{TRUTH_NOTE}</p>}
      {children}
    </div>
  );
}
