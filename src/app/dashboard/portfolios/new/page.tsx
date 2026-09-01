import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { CreatePortfolioForm } from "@/features/portfolio/components/create-portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard/portfolios"
        className="text-small mb-6 inline-flex items-center gap-2 hover:text-foreground"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to portfolios
      </Link>

      <div className="mb-8">
        <p className="text-caption text-accent">New portfolio</p>

        <h1 className="text-h1 mt-2">
          Create your portfolio
        </h1>

        <p className="text-body mt-2 text-muted-foreground">
          Give it a title and a URL — you can add projects, experience and the
          rest once it&rsquo;s created.
        </p>
      </div>

      <div className="surface-card p-6 md:p-8">
        <CreatePortfolioForm />
      </div>
    </div>
  );
}

