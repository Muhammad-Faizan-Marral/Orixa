"use client";

import { useState, useTransition } from "react";

import { updatePortfolioData } from "@/actions/portfolio/update-portfolio-data";

type PortfolioEditorProps = {
  portfolio: {
    id: string;
    title: string;
    slug: string;
  };

  data: {
    headline: string | null;
    about: string | null;
    theme: string | null;
    animations: boolean;
  } | null;
};

export function PortfolioEditor({ portfolio, data }: PortfolioEditorProps) {
  const [isPending, startTransition] = useTransition();

  const [headline, setHeadline] = useState(data?.headline ?? "");

  const [about, setAbout] = useState(data?.about ?? "");

  const [theme, setTheme] = useState(data?.theme ?? "minimal");

  const [animations, setAnimations] = useState(data?.animations ?? true);

  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    startTransition(async () => {
      const result = await updatePortfolioData({
        portfolioId: portfolio.id,

        headline,

        about,

        projects: [],

        experience: [],

        skills: [],

        education: [],

        certificates: [],

        resumeUrl: "",

        theme,

        animations,

        componentSelection: {},

        designPreferences: {},

        seo: {},
      });

      if (!result.success) {
        setMessage(result.message ?? "Unable to save portfolio.");

        return;
      }

      setMessage("Portfolio saved successfully.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">Basic Content</h2>

          <p className="text-sm text-gray-500">
            Update the main content of your portfolio.
          </p>
        </div>

        <div>
          <label htmlFor="headline" className="mb-1 block text-sm font-medium">
            Headline
          </label>

          <input
            id="headline"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            placeholder="Full Stack Developer"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="about" className="mb-1 block text-sm font-medium">
            About
          </label>

          <textarea
            id="about"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            rows={8}
            placeholder="Tell people about yourself..."
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>

        <div>
          <label htmlFor="theme" className="mb-1 block text-sm font-medium">
            Theme
          </label>

          <select
            id="theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="minimal">Minimal</option>

            <option value="modern">Modern</option>

            <option value="professional">Professional</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={animations}
            onChange={(event) => setAnimations(event.target.checked)}
          />

          <span className="text-sm">Enable animations</span>
        </label>
      </section>

      <section className="space-y-4 rounded border p-5">
        <h2 className="text-lg font-semibold">Coming Sections</h2>

        <p className="text-sm text-gray-500">
          Projects, experience, skills, education, certificates, resume, SEO and
          design preferences will be managed here.
        </p>
      </section>

      {message && <p className="text-sm">{message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded border px-5 py-2"
      >
        {isPending ? "Saving..." : "Save Portfolio"}
      </button>
    </form>
  );
}
