"use client";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Switch } from "@/components/UI/Switch";
import type { FieldErrors } from "../types";

type SeoStepProps = {
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  seoKeywords: string;
  setSeoKeywords: (v: string) => void;
  seoNoIndex: boolean;
  setSeoNoIndex: (v: boolean) => void;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

export function SeoStep({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  seoNoIndex,
  setSeoNoIndex,
  fieldErrors,
  clearFieldError,
}: SeoStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">SEO</h2>
        <p className="text-small text-muted-foreground mt-1">
          Title and metadata only.
        </p>
      </div>

      <Input
        id="seo-title"
        label="SEO title"
        value={seoTitle}
        onChange={(e) => {
          setSeoTitle(e.target.value);
          clearFieldError("seoTitle");
        }}
        placeholder="Max 70 characters"
        error={fieldErrors.seoTitle}
      />
      <Textarea
        id="seo-desc"
        label="Meta description"
        value={seoDescription}
        onChange={(e) => {
          setSeoDescription(e.target.value);
          clearFieldError("seoDescription");
        }}
        rows={3}
        placeholder="Max 160 characters"
        error={fieldErrors.seoDescription}
      />
      <Input
        id="seo-keywords"
        label="Keywords (comma separated)"
        value={seoKeywords}
        onChange={(e) => setSeoKeywords(e.target.value)}
        placeholder="developer, nextjs, portfolio"
      />
      <Switch
        checked={seoNoIndex}
        onChange={setSeoNoIndex}
        label="No index"
        description="Search engines ko index karne se roko"
      />
    </section>
  );
}
