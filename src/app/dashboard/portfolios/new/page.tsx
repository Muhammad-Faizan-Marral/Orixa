import { CreatePortfolioForm } from "@/features/portfolio/components/create-portfolio-form";


export default function NewPortfolioPage() {
  return (
    <main>
      <h1>Create Portfolio</h1>

      <p>
        Create a new portfolio for your profile.
      </p>

      <CreatePortfolioForm />
    </main>
  );
}