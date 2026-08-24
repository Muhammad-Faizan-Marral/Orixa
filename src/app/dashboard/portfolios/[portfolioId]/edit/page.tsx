import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";

import { PortfolioEditor } from "../../../../../features/portfolio/components/portfolio-editor";
import { FileUpload } from "@/features/profile/components/file-upload";

type EditPortfolioPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const user = await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id,
  );

  if (!result) {
    notFound();
  }

  return (
    <main className="max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Portfolio</h1>

        <p className="text-sm text-gray-500">Manage your portfolio content.</p>
      </div>

      <PortfolioEditor portfolio={result.portfolio} data={result.data} />
      <FileUpload
        type="project-image"
        portfolioId={portfolioId}
        accept="image/jpeg,image/png,image/webp,image/gif"
        label="Upload Project Image"
      />
      <FileUpload
        type="resume"
        portfolioId={portfolioId}
        accept="application/pdf"
        label="Upload Resume"
      />
    </main>
  );
}
