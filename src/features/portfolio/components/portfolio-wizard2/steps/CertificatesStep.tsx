"use client";

import { Input } from "@/components/UI/Input";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { createId } from "../utils";
import type { Certificate, FieldErrors, Setter } from "../types";

type CertificatesStepProps = {
  certificates: Certificate[];
  setCertificates: Setter<Certificate[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

export function CertificatesStep({
  certificates,
  setCertificates,
  fieldErrors,
  clearFieldError,
}: CertificatesStepProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-h3">Certificates</h2>

      {certificates.map((item, index) => (
        <RepeaterCard
          key={item.id}
          title={`Certificate ${index + 1}`}
          onRemove={() => {
            setCertificates((c) => c.filter((e) => e.id !== item.id));
            clearFieldError(`cert-name-${item.id}`);
            clearFieldError(`cert-url-${item.id}`);
          }}
        >
          <Input
            label="Name"
            value={item.name}
            onChange={(e) => {
              setCertificates((c) =>
                c.map((x) =>
                  x.id === item.id ? { ...x, name: e.target.value } : x,
                ),
              );
              clearFieldError(`cert-name-${item.id}`);
            }}
            error={fieldErrors[`cert-name-${item.id}`]}
          />
          <Input
            label="Issuer"
            value={item.issuer ?? ""}
            onChange={(e) =>
              setCertificates((c) =>
                c.map((x) =>
                  x.id === item.id ? { ...x, issuer: e.target.value } : x,
                ),
              )
            }
          />
          <Input
            label="Issue date"
            value={item.issueDate ?? ""}
            onChange={(e) =>
              setCertificates((c) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, issueDate: e.target.value }
                    : x,
                ),
              )
            }
          />
          <Input
            label="Credential URL"
            value={item.credentialUrl ?? ""}
            onChange={(e) => {
              setCertificates((c) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, credentialUrl: e.target.value }
                    : x,
                ),
              );
              clearFieldError(`cert-url-${item.id}`);
            }}
            error={fieldErrors[`cert-url-${item.id}`]}
          />
        </RepeaterCard>
      ))}

      <AddButton
        label="Add certificate"
        onClick={() =>
          setCertificates((c) => [
            ...c,
            {
              id: createId(),
              name: "",
              issuer: "",
              issueDate: "",
              credentialUrl: "",
            },
          ])
        }
      />
    </section>
  );
}
