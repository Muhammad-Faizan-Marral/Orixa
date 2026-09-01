import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { PortfolioWizard } from "@/features/portfolio/components/portfolio-wizard";

type EditPortfolioPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id
  );

  if (!result) {
    notFound();
  }

  const isNew =
    result.portfolio.status === "draft" &&
    !result.data?.name &&
    !result.data?.headline &&
    !(
      result.data?.skills &&
      (result.data.skills as unknown[]).length
    ) &&
    !(
      result.data?.projects &&
      (result.data.projects as unknown[]).length
    );

  return (
    <div className="min-h-full">
      {/* Top navigation */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/portfolios/${portfolioId}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background transition-all group-hover:border-accent/40 group-hover:bg-accent/5">
              <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </span>

            <span>Back to portfolio</span>
          </Link>
        </div>
      </div>

      {/* Editor area */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Portfolio Editor
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isNew ? "Create your portfolio" : "Edit your portfolio"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {isNew
                  ? "Build your portfolio step by step. Add your profile, experience, projects, skills and more."
                  : "Update your portfolio content, design and information from the editor below."}
              </p>
            </div>

            {/* Status */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  result.portfolio.status === "published"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              <span className="capitalize text-muted-foreground">
                {result.portfolio.status}
              </span>
            </div>
          </div>
        </div>

        {/* Wizard container */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <PortfolioWizard
            portfolio={result.portfolio}
            data={result.data}
            isNew={isNew}
          />
        </div>
      </main>
    </div>
  );
}

