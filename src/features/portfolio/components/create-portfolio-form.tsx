"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPortfolio } from "@/actions/portfolio/create-portfolio";
import { usePortfolioSlugCheck } from "@/features/portfolio/hooks/use-portfolio-slug-check";
import {
  createPortfolioSchema,
  type CreatePortfolioInput,
} from "@/validations/portfolio.schema";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Button } from "@/components/UI/Button";

const THEMES = [
  { value: "minimal", label: "Minimal", description: "Clean, editorial, content-first." },
];

export function CreatePortfolioForm() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePortfolioInput>({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: {
      title: "",
      slug: "",
      headline: "",
      about: "",
      theme: "minimal",
    },
  });

  const slug = watch("slug");
  const theme = watch("theme");

  const { available, checking } = usePortfolioSlugCheck(slug);

  const onSubmit = async (data: CreatePortfolioInput) => {
    setServerError("");

    if (available === false) {
      setServerError("Please choose another portfolio URL.");
      return;
    }

    const result = await createPortfolio(data);

    if (result?.success === false) {
      setServerError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="title"
        label="Portfolio title"
        {...register("title")}
        placeholder="My Developer Portfolio"
        error={errors.title?.message}
      />

      <div>
        <Input
          id="slug"
          label="Portfolio URL"
          {...register("slug")}
          placeholder="developer"
          error={errors.slug?.message}
          onChange={(e) =>
            setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"), {
              shouldValidate: true,
            })
          }
        />
        <div className="mt-1.5 text-small min-h-[1.1rem]">
          {slug && (
            <p className="text-subtle-foreground">
              orixa.ai/your-username/<span className="text-foreground">{slug}</span>
            </p>
          )}
          {checking && <p className="mt-1">Checking availability...</p>}
          {!checking && available === true && (
            <p className="mt-1 flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Available
            </p>
          )}
          {!checking && available === false && (
            <p className="mt-1 flex items-center gap-1.5 text-error">
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
              Already taken
            </p>
          )}
        </div>
      </div>

      <Input
        id="headline"
        label="Headline"
        {...register("headline")}
        placeholder="Full Stack Developer"
        error={errors.headline?.message}
      />

      <Textarea
        id="about"
        label="About"
        {...register("about")}
        placeholder="Tell people about this portfolio..."
        rows={4}
        error={errors.about?.message}
      />

      <div className="space-y-2">
        <p className="text-label">Theme</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue("theme", t.value, { shouldValidate: true })}
              className={
                "surface-panel space-y-1 p-3 text-left transition-colors " +
                (theme === t.value
                  ? "border-primary/40 bg-gradient-ion-soft"
                  : "hover:border-border-strong")
              }
            >
              <p className="text-label">{t.label}</p>
              <p className="text-small">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="gradient"
          loading={isSubmitting}
          disabled={isSubmitting || checking || available === false}
        >
          {isSubmitting ? "Creating..." : "Create portfolio"}
        </Button>
        <Link href="/dashboard/portfolios">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
