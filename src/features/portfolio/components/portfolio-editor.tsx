"use client";

import { useState, useTransition } from "react";

import { updatePortfolioData } from "@/actions/portfolio/update-portfolio-data";

type Project = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

type Skill = {
  id: string;
  name: string;
  level?: string;
};

type Education = {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type Certificate = {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
};

type PortfolioEditorProps = {
  portfolio: {
    id: string;
    title: string;
    slug: string;
  };

  data: {
    headline: string | null;
    about: string | null;
    projects: Project[] | null;
    experience: Experience[] | null;
    skills: Skill[] | null;
    education: Education[] | null;
    certificates: Certificate[] | null;
    resumeUrl: string | null;
    theme: string | null;
    animations: boolean;
    componentSelection: Record<string, unknown> | null;
    designPreferences: Record<string, unknown> | null;
    seo: Record<string, unknown> | null;
  } | null;
};

function createId() {
  return crypto.randomUUID();
}

export function PortfolioEditor({ portfolio, data }: PortfolioEditorProps) {
  const [isPending, startTransition] = useTransition();

  const [headline, setHeadline] = useState(data?.headline ?? "");

  const [about, setAbout] = useState(data?.about ?? "");

  const [projects, setProjects] = useState<Project[]>(data?.projects ?? []);

  const [experience, setExperience] = useState<Experience[]>(
    data?.experience ?? [],
  );

  const [skills, setSkills] = useState<Skill[]>(data?.skills ?? []);

  const [education, setEducation] = useState<Education[]>(
    data?.education ?? [],
  );

  const [certificates, setCertificates] = useState<Certificate[]>(
    data?.certificates ?? [],
  );

  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl ?? "");

  const [theme, setTheme] = useState(data?.theme ?? "minimal");

  const [animations, setAnimations] = useState(data?.animations ?? true);

  const [message, setMessage] = useState("");
  const [componentSelection, setComponentSelection] = useState({
    showHero: data?.componentSelection?.showHero !== false,

    showAbout: data?.componentSelection?.showAbout !== false,

    showSkills: data?.componentSelection?.showSkills !== false,

    showExperience: data?.componentSelection?.showExperience !== false,

    showProjects: data?.componentSelection?.showProjects !== false,

    showEducation: data?.componentSelection?.showEducation !== false,

    showCertificates: data?.componentSelection?.showCertificates !== false,

    showContact: data?.componentSelection?.showContact !== false,
  });

  const [designPreferences, setDesignPreferences] = useState({
    layout: data?.designPreferences?.layout ?? "standard",

    accentColor: data?.designPreferences?.accentColor ?? "#000000",

    fontFamily: data?.designPreferences?.fontFamily ?? "Inter",

    borderRadius: data?.designPreferences?.borderRadius ?? "medium",

    cardStyle: data?.designPreferences?.cardStyle ?? "bordered",
  });

  const [seo, setSeo] = useState({
    title: data?.seo?.title ?? portfolio.title,

    description: data?.seo?.description ?? "",

    keywords: data?.seo?.keywords ?? [],

    ogImage: data?.seo?.ogImage ?? "",

    canonicalUrl: data?.seo?.canonicalUrl ?? "",

    noIndex: data?.seo?.noIndex ?? false,
  });

  function updateProject(
    id: string,
    field: keyof Project,
    value: string | string[],
  ) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );
  }

  function addProject() {
    setProjects((current) => [
      ...current,
      {
        id: createId(),
        title: "",
        description: "",
        url: "",
        technologies: [],
        imageUrl: "",
      },
    ]);
  }

  function removeProject(id: string) {
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  function updateExperience(
    id: string,
    field: keyof Experience,
    value: string | boolean,
  ) {
    setExperience((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addExperience() {
    setExperience((current) => [
      ...current,
      {
        id: createId(),
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  }

  function removeExperience(id: string) {
    setExperience((current) => current.filter((item) => item.id !== id));
  }

  function updateSkill(id: string, field: keyof Skill, value: string) {
    setSkills((current) =>
      current.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              [field]: value,
            }
          : skill,
      ),
    );
  }

  function addSkill() {
    setSkills((current) => [
      ...current,
      {
        id: createId(),
        name: "",
        level: "",
      },
    ]);
  }

  function removeSkill(id: string) {
    setSkills((current) => current.filter((skill) => skill.id !== id));
  }

  function updateEducation(id: string, field: keyof Education, value: string) {
    setEducation((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addEducation() {
    setEducation((current) => [
      ...current,
      {
        id: createId(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  }

  function removeEducation(id: string) {
    setEducation((current) => current.filter((item) => item.id !== id));
  }

  function updateCertificate(
    id: string,
    field: keyof Certificate,
    value: string,
  ) {
    setCertificates((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addCertificate() {
    setCertificates((current) => [
      ...current,
      {
        id: createId(),
        name: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
      },
    ]);
  }

  function removeCertificate(id: string) {
    setCertificates((current) => current.filter((item) => item.id !== id));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    startTransition(async () => {
      const result = await updatePortfolioData({
        portfolioId: portfolio.id,

        headline,
        about,

        projects,
        experience,
        skills,
        education,
        certificates,

        resumeUrl,

        theme,
        animations,

        componentSelection,
        designPreferences,
        seo,
      });

      if (!result.success) {
        setMessage(result.message ?? "Unable to save portfolio.");

        return;
      }

      setMessage("Portfolio saved successfully.");
    });
  }
  function toggleComponent(component: keyof typeof componentSelection) {
    setComponentSelection((current) => ({
      ...current,
      [component]: !current[component],
    }));
  }

  function updateDesignPreference(
    field: keyof typeof designPreferences,
    value: string,
  ) {
    setDesignPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSEO(
    field: keyof typeof seo,
    value: string | boolean | string[],
  ) {
    setSeo((current) => ({
      ...current,
      [field]: value,
    }));
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* BASIC CONTENT */}

      <section className="space-y-4 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">Basic Content</h2>

          <p className="text-sm text-gray-500">
            Main information shown on your portfolio.
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

      {/* PROJECTS */}

      <section className="space-y-4 rounded border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Projects</h2>

            <p className="text-sm text-gray-500">Showcase your best work.</p>
          </div>

          <button
            type="button"
            onClick={addProject}
            className="rounded border px-3 py-2 text-sm"
          >
            + Add Project
          </button>
        </div>

        {projects.length === 0 && (
          <p className="text-sm text-gray-500">No projects added yet.</p>
        )}

        {projects.map((project, index) => (
          <div key={project.id} className="space-y-4 rounded border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Project {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-sm"
              >
                Remove
              </button>
            </div>

            <input
              value={project.title}
              onChange={(event) =>
                updateProject(project.id, "title", event.target.value)
              }
              placeholder="Project title"
              className="w-full rounded border px-3 py-2"
            />

            <textarea
              value={project.description ?? ""}
              onChange={(event) =>
                updateProject(project.id, "description", event.target.value)
              }
              placeholder="Project description"
              rows={4}
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={project.url ?? ""}
              onChange={(event) =>
                updateProject(project.id, "url", event.target.value)
              }
              placeholder="Project URL"
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={project.technologies?.join(", ") ?? ""}
              onChange={(event) =>
                updateProject(
                  project.id,
                  "technologies",
                  event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                )
              }
              placeholder="React, Next.js, PostgreSQL"
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={project.imageUrl ?? ""}
              onChange={(event) =>
                updateProject(project.id, "imageUrl", event.target.value)
              }
              placeholder="Project image URL"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        ))}
      </section>

      {/* EXPERIENCE */}

      <section className="space-y-4 rounded border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Experience</h2>

            <p className="text-sm text-gray-500">
              Add your professional experience.
            </p>
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="rounded border px-3 py-2 text-sm"
          >
            + Add Experience
          </button>
        </div>

        {experience.map((item, index) => (
          <div key={item.id} className="space-y-4 rounded border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Experience {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeExperience(item.id)}
                className="text-sm"
              >
                Remove
              </button>
            </div>

            <input
              value={item.role}
              onChange={(event) =>
                updateExperience(item.id, "role", event.target.value)
              }
              placeholder="Software Engineer"
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={item.company}
              onChange={(event) =>
                updateExperience(item.id, "company", event.target.value)
              }
              placeholder="Company"
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={item.location ?? ""}
              onChange={(event) =>
                updateExperience(item.id, "location", event.target.value)
              }
              placeholder="Location"
              className="w-full rounded border px-3 py-2"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="date"
                value={item.startDate ?? ""}
                onChange={(event) =>
                  updateExperience(item.id, "startDate", event.target.value)
                }
                className="w-full rounded border px-3 py-2"
              />

              <input
                type="date"
                value={item.endDate ?? ""}
                disabled={item.current}
                onChange={(event) =>
                  updateExperience(item.id, "endDate", event.target.value)
                }
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.current ?? false}
                onChange={(event) =>
                  updateExperience(item.id, "current", event.target.checked)
                }
              />
              Currently working here
            </label>

            <textarea
              value={item.description ?? ""}
              onChange={(event) =>
                updateExperience(item.id, "description", event.target.value)
              }
              placeholder="Describe your work..."
              rows={4}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        ))}
      </section>

      {/* SKILLS */}

      <section className="space-y-4 rounded border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Skills</h2>
          </div>

          <button
            type="button"
            onClick={addSkill}
            className="rounded border px-3 py-2 text-sm"
          >
            + Add Skill
          </button>
        </div>

        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className="flex flex-col gap-3 rounded border p-4 sm:flex-row"
          >
            <input
              value={skill.name}
              onChange={(event) =>
                updateSkill(skill.id, "name", event.target.value)
              }
              placeholder={`Skill ${index + 1}`}
              className="flex-1 rounded border px-3 py-2"
            />

            <input
              value={skill.level ?? ""}
              onChange={(event) =>
                updateSkill(skill.id, "level", event.target.value)
              }
              placeholder="Expert / Intermediate"
              className="flex-1 rounded border px-3 py-2"
            />

            <button
              type="button"
              onClick={() => removeSkill(skill.id)}
              className="rounded border px-3 py-2 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* EDUCATION */}

      <section className="space-y-4 rounded border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Education</h2>
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="rounded border px-3 py-2 text-sm"
          >
            + Add Education
          </button>
        </div>

        {education.map((item, index) => (
          <div key={item.id} className="space-y-4 rounded border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Education {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeEducation(item.id)}
                className="text-sm"
              >
                Remove
              </button>
            </div>

            <input
              value={item.institution}
              onChange={(event) =>
                updateEducation(item.id, "institution", event.target.value)
              }
              placeholder="Institution"
              className="w-full rounded border px-3 py-2"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={item.degree ?? ""}
                onChange={(event) =>
                  updateEducation(item.id, "degree", event.target.value)
                }
                placeholder="Degree"
                className="w-full rounded border px-3 py-2"
              />

              <input
                value={item.field ?? ""}
                onChange={(event) =>
                  updateEducation(item.id, "field", event.target.value)
                }
                placeholder="Field of study"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="date"
                value={item.startDate ?? ""}
                onChange={(event) =>
                  updateEducation(item.id, "startDate", event.target.value)
                }
                className="w-full rounded border px-3 py-2"
              />

              <input
                type="date"
                value={item.endDate ?? ""}
                onChange={(event) =>
                  updateEducation(item.id, "endDate", event.target.value)
                }
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <textarea
              value={item.description ?? ""}
              onChange={(event) =>
                updateEducation(item.id, "description", event.target.value)
              }
              placeholder="Additional information"
              rows={3}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        ))}
      </section>

      {/* CERTIFICATES */}

      <section className="space-y-4 rounded border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Certificates</h2>
          </div>

          <button
            type="button"
            onClick={addCertificate}
            className="rounded border px-3 py-2 text-sm"
          >
            + Add Certificate
          </button>
        </div>

        {certificates.map((item, index) => (
          <div key={item.id} className="space-y-4 rounded border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Certificate {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeCertificate(item.id)}
                className="text-sm"
              >
                Remove
              </button>
            </div>

            <input
              value={item.name}
              onChange={(event) =>
                updateCertificate(item.id, "name", event.target.value)
              }
              placeholder="Certificate name"
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={item.issuer ?? ""}
              onChange={(event) =>
                updateCertificate(item.id, "issuer", event.target.value)
              }
              placeholder="Issuing organization"
              className="w-full rounded border px-3 py-2"
            />

            <input
              type="date"
              value={item.issueDate ?? ""}
              onChange={(event) =>
                updateCertificate(item.id, "issueDate", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />

            <input
              value={item.credentialUrl ?? ""}
              onChange={(event) =>
                updateCertificate(item.id, "credentialUrl", event.target.value)
              }
              placeholder="Credential URL"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        ))}
      </section>

      {/* RESUME */}

      <section className="space-y-4 rounded border p-5">
        <h2 className="text-lg font-semibold">Resume</h2>

        <input
          value={resumeUrl}
          onChange={(event) => setResumeUrl(event.target.value)}
          placeholder="Resume URL"
          className="w-full rounded border px-3 py-2"
        />
      </section>

      {/* Compnents Selection */}
      <section className="space-y-5 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">Portfolio Sections</h2>

          <p className="text-sm text-gray-500">
            Choose which sections should appear on your public portfolio.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["showHero", "Hero"],
            ["showAbout", "About"],
            ["showSkills", "Skills"],
            ["showExperience", "Experience"],
            ["showProjects", "Projects"],
            ["showEducation", "Education"],
            ["showCertificates", "Certificates"],
            ["showContact", "Contact"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded border p-3"
            >
              <span className="text-sm">{label}</span>

              <input
                type="checkbox"
                checked={
                  componentSelection[key as keyof typeof componentSelection]
                }
                onChange={() =>
                  toggleComponent(key as keyof typeof componentSelection)
                }
              />
            </label>
          ))}
        </div>
      </section>

      {/* APPEARANCE */}

      <section className="space-y-4 rounded border p-5">
        <h2 className="text-lg font-semibold">Appearance</h2>

        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="minimal">Minimal</option>

          <option value="modern">Modern</option>

          <option value="professional">Professional</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={animations}
            onChange={(event) => setAnimations(event.target.checked)}
          />
          Enable animations
        </label>
      </section>

      {/* Design Prefrence */}
      <section className="space-y-5 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">Design Preferences</h2>

          <p className="text-sm text-gray-500">
            Customize the visual style of your portfolio.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Layout</label>

            <select
              value={designPreferences.layout}
              onChange={(event) =>
                updateDesignPreference("layout", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="standard">Standard</option>

              <option value="wide">Wide</option>

              <option value="centered">Centered</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Font</label>

            <select
              value={designPreferences.fontFamily}
              onChange={(event) =>
                updateDesignPreference("fontFamily", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="Inter">Inter</option>

              <option value="Geist">Geist</option>

              <option value="Roboto">Roboto</option>

              <option value="Poppins">Poppins</option>

              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Border Radius
            </label>

            <select
              value={designPreferences.borderRadius}
              onChange={(event) =>
                updateDesignPreference("borderRadius", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="none">None</option>

              <option value="small">Small</option>

              <option value="medium">Medium</option>

              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Card Style</label>

            <select
              value={designPreferences.cardStyle}
              onChange={(event) =>
                updateDesignPreference("cardStyle", event.target.value)
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="flat">Flat</option>

              <option value="bordered">Bordered</option>

              <option value="elevated">Elevated</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Accent Color
            </label>

            <div className="flex gap-3">
              <input
                type="color"
                value={designPreferences.accentColor}
                onChange={(event) =>
                  updateDesignPreference("accentColor", event.target.value)
                }
                className="h-10 w-14 rounded border"
              />

              <input
                value={designPreferences.accentColor}
                onChange={(event) =>
                  updateDesignPreference("accentColor", event.target.value)
                }
                className="flex-1 rounded border px-3 py-2"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </section>
      {/* SEO UI */}
      <section className="space-y-5 rounded border p-5">
        <div>
          <h2 className="text-lg font-semibold">SEO</h2>

          <p className="text-sm text-gray-500">
            Configure how your public portfolio appears in search engines and
            social previews.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="seo-title"
              className="mb-1 block text-sm font-medium"
            >
              SEO Title
            </label>

            <input
              id="seo-title"
              value={seo.title}
              maxLength={70}
              onChange={(event) => updateSEO("title", event.target.value)}
              placeholder="Faizan — Full Stack Developer"
              className="w-full rounded border px-3 py-2"
            />

            <p className="mt-1 text-xs text-gray-500">{seo.title.length}/70</p>
          </div>

          <div>
            <label
              htmlFor="seo-description"
              className="mb-1 block text-sm font-medium"
            >
              Meta Description
            </label>

            <textarea
              id="seo-description"
              value={seo.description}
              maxLength={160}
              onChange={(event) => updateSEO("description", event.target.value)}
              rows={4}
              placeholder="A short description of your portfolio..."
              className="w-full rounded border px-3 py-2"
            />

            <p className="mt-1 text-xs text-gray-500">
              {seo.description.length}/160
            </p>
          </div>

          <div>
            <label
              htmlFor="seo-keywords"
              className="mb-1 block text-sm font-medium"
            >
              Keywords
            </label>

            <input
              id="seo-keywords"
              value={seo.keywords.join(", ")}
              onChange={(event) =>
                updateSEO(
                  "keywords",
                  event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                )
              }
              placeholder="Next.js, React, TypeScript, Full Stack Developer"
              className="w-full rounded border px-3 py-2"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate keywords with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="og-image"
              className="mb-1 block text-sm font-medium"
            >
              Social Preview Image URL
            </label>

            <input
              id="og-image"
              value={seo.ogImage}
              onChange={(event) => updateSEO("ogImage", event.target.value)}
              placeholder="https://..."
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="canonical-url"
              className="mb-1 block text-sm font-medium"
            >
              Canonical URL
            </label>

            <input
              id="canonical-url"
              value={seo.canonicalUrl}
              onChange={(event) =>
                updateSEO("canonicalUrl", event.target.value)
              }
              placeholder="https://example.com/faizan"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={seo.noIndex}
              onChange={(event) => updateSEO("noIndex", event.target.checked)}
            />
            Prevent search engines from indexing this portfolio
          </label>
        </div>
      </section>

      {/* SAVE */}

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
