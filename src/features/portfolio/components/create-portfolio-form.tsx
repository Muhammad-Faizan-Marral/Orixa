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

export function CreatePortfolioForm() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
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

  const { available, checking } = usePortfolioSlugCheck(slug);

  const onSubmit = async (data: CreatePortfolioInput) => {
    setServerError("");

    if (available === false) {
      setServerError("Please choose another portfolio slug.");

      return;
    }

    const result = await createPortfolio(data);

    if (result?.success === false) {
      setServerError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Portfolio Title</label>

        <input
          id="title"
          {...register("title")}
          placeholder="My Developer Portfolio"
        />

        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="slug">Portfolio Slug</label>

        <input id="slug" {...register("slug")} placeholder="developer" />

        {checking && <p>Checking slug...</p>}

        {!checking && available === true && <p>Slug is available.</p>}

        {!checking && available === false && <p>Slug is already taken.</p>}

        {errors.slug && <p>{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="headline">Headline</label>

        <input
          id="headline"
          {...register("headline")}
          placeholder="Full Stack Developer"
        />

        {errors.headline && <p>{errors.headline.message}</p>}
      </div>

      <div>
        <label htmlFor="about">About</label>

        <textarea
          id="about"
          {...register("about")}
          placeholder="Tell people about this portfolio..."
        />

        {errors.about && <p>{errors.about.message}</p>}
      </div>

      <div>
        <label htmlFor="theme">Theme</label>

        <select id="theme" {...register("theme")}>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {serverError && <p>{serverError}</p>}

      <div>
        <button
          type="submit"
          disabled={isSubmitting || checking || available === false}
        >
          {isSubmitting ? "Creating..." : "Create Portfolio"}
        </button>

        <Link href="/dashboard/portfolios">Cancel</Link>
      </div>
    </form>
  );
}
