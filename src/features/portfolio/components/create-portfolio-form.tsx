"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/UI/Button";

export function CreatePortfolioForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePortfolioInput>({
    resolver: zodResolver(createPortfolioSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      headline: "",
      about: "",
    },
  });

  const slug = watch("slug");
  const { available, checking } = usePortfolioSlugCheck(slug);

  const onSubmit = async (data: CreatePortfolioInput) => {
    setServerError("");

    if (available === false) {
      setServerError(
        "Please choose another portfolio URL. This slug is already taken.",
      );
      return;
    }

    const result = await createPortfolio(data);

    if (!result?.success) {
      setServerError(
        result?.message || "Failed to create portfolio. Please try again.",
      );
      return;
    }

    if (result.portfolioId) {
      router.push(`/dashboard/portfolios/${result.portfolioId}/edit`);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          label="Slug URL"
          {...register("slug")}
          placeholder="developer"
          error={errors.slug?.message}
          onChange={(e) =>
            setValue(
              "slug",
              e.target.value
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, ""),
              { shouldValidate: true },
            )
          }
        />
        <div className="mt-1.5 text-small min-h-[1.1rem]">
          {slug && (
            <p className="text-subtle-foreground">
              your-username/
              <span className="font-medium text-foreground">{slug}</span>
              /orixaai.me
            </p>
          )}
          {checking && (
            <p className="text-muted-foreground">Checking availability…</p>
          )}
          {!checking && available === true && slug.length >= 3 && (
            <p className="mt-1 flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Available
            </p>
          )}
          {!checking && available === false && (
            <p className="mt-1 flex items-center gap-1.5 text-error">
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
              Already taken — try another slug
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error"
        >
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