import { notFound } from "next/navigation";
import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

import { PortfolioEditor } from "@/features/portfolio/components/portfolio-editor";
import { FileUpload } from "@/features/profile/components/file-upload";

type EditPortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(portfolioId, profile.id);

  if (!result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolioId}`}
          className="text-small mb-4 inline-flex items-center gap-1 hover:text-foreground"
        >
          ← {result.portfolio.title}
        </Link>
        <h1 className="text-h1">Edit portfolio</h1>
        <p className="text-body mt-1 text-muted-foreground">
          Manage your portfolio content, design and SEO.
        </p>
      </div>

      <PortfolioEditor portfolio={result.portfolio} data={result.data} />

      <section className="surface-card space-y-4 p-6">
        <div>
          <h2 className="text-h3">Assets</h2>
          <p className="text-small mt-1">
            Upload images or your resume — paste the resulting URL into the relevant section above.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FileUpload
            type="project-image"
            portfolioId={portfolioId}
            accept="image/jpeg,image/png,image/webp,image/gif"
            label="Upload project image"
          />
          <FileUpload
            type="resume"
            portfolioId={portfolioId}
            accept="application/pdf"
            label="Upload resume"
          />
        </div>
      </section>
    </div>
  );
}
