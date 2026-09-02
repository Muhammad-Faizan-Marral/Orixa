"use client";

import { useEffect, useState, useTransition } from "react";

import { updatePortfolioData } from "@/actions/portfolio/update-portfolio-data";
import { uploadFile } from "@/actions/profile/upload-file";
import { deleteUpload } from "@/actions/profile/delete-upload";
import { getUploads } from "@/actions/profile/get-uploads";
import { generateAndAttachResume } from "@/actions/portfolio/generate-resume";
import { cn } from "@/lib/utils";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Select } from "@/components/UI/Select";
import { Switch } from "@/components/UI/Switch";
import { Button } from "@/components/UI/Button";

import { EditorNav, type EditorSectionId } from "./editor-nav";
import { RepeaterCard, AddButton } from "./repeater-card";
import { OptionCardGroup } from "./option-card-group";
import { AiAssistButton } from "./ai-assist-button";

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

type Skill = { id: string; name: string; level?: string };

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
  portfolio: { id: string; title: string; slug: string };
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

const SECTION_LABELS: Record<string, string> = {
  showHero: "Hero",
  showAbout: "About",
  showSkills: "Skills",
  showExperience: "Experience",
  showProjects: "Projects",
  showEducation: "Education",
  showCertificates: "Certificates",
  showContact: "Contact",
};

const ACCENT_PRESETS = [
  "#6c5cff",
  "#22d3ee",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f472b6",
  "#0e0f13",
];

const THEME_OPTIONS = [
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean, editorial, content-first.",
  },
  {
    value: "modern",
    label: "Modern",
    description: "Bolder type, more visual rhythm.",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Structured, resume-forward.",
  },
];

const LAYOUT_OPTIONS = [
  {
    value: "standard",
    label: "Standard",
    preview: (
      <div className="flex h-full w-full gap-1">
        <div className="h-full w-1/3 rounded-sm bg-border-strong" />
        <div className="h-full flex-1 rounded-sm bg-border" />
      </div>
    ),
  },
  {
    value: "wide",
    label: "Wide",
    preview: <div className="h-full w-full rounded-sm bg-border" />,
  },
  {
    value: "centered",
    label: "Centered",
    preview: (
      <div className="flex h-full w-full justify-center">
        <div className="h-full w-1/2 rounded-sm bg-border" />
      </div>
    ),
  },
];

const RADIUS_OPTIONS = [
  { value: "none", label: "None", radius: "0px" },
  { value: "small", label: "Small", radius: "4px" },
  { value: "medium", label: "Medium", radius: "10px" },
  { value: "large", label: "Large", radius: "18px" },
];

const CARD_STYLE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "bordered", label: "Bordered" },
  { value: "elevated", label: "Elevated" },
];

export function PortfolioEditor({ portfolio, data }: PortfolioEditorProps) {
  const [activeSection, setActiveSection] =
    useState<EditorSectionId>("overview");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [attachUploadedResume, setAttachUploadedResume] = useState(
    Boolean(data?.resumeUrl),
  );
  const [autoGenerateResume, setAutoGenerateResume] = useState(
    !Boolean(data?.resumeUrl),
  );
  const [isResumeBusy, setIsResumeBusy] = useState(false);

  const [theme, setTheme] = useState(data?.theme ?? "minimal");
  const [animations, setAnimations] = useState(data?.animations ?? true);

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
    layout: (data?.designPreferences?.layout as string) ?? "standard",
    accentColor: (data?.designPreferences?.accentColor as string) ?? "#6c5cff",
    fontFamily: (data?.designPreferences?.fontFamily as string) ?? "Inter",
    borderRadius: (data?.designPreferences?.borderRadius as string) ?? "medium",
    cardStyle: (data?.designPreferences?.cardStyle as string) ?? "bordered",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await getUploads({
          type: "resume",
          portfolioId: portfolio.id,
        });

        if (cancelled || !result.success) return;

        const current = data?.resumeUrl
          ? result.data.find((item) => item.url === data.resumeUrl)
          : null;
        const latest = current ?? result.data[0] ?? null;

        if (!latest) return;

        setUploadedResumeId(latest.id);
        setUploadedResumeUrl(latest.url);
        setHasUploadedResume(true);

        if (data?.resumeUrl && latest.url === data.resumeUrl) {
          setAttachUploadedResume(true);
          setAutoGenerateResume(false);
        }
      } catch (error) {
        console.error("load editor resumes:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [portfolio.id, data?.resumeUrl]);

  const [seo, setSeo] = useState({
    title: (data?.seo?.title as string) ?? portfolio.title,
    description: (data?.seo?.description as string) ?? "",
    keywords: (data?.seo?.keywords as string[]) ?? [],
    ogImage: (data?.seo?.ogImage as string) ?? "",
    canonicalUrl: (data?.seo?.canonicalUrl as string) ?? "",
    noIndex: (data?.seo?.noIndex as boolean) ?? false,
  });

  function updateProject(
    id: string,
    field: keyof Project,
    value: string | string[],
  ) {
    setProjects((current) =>
      current.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
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
    setProjects((current) => current.filter((p) => p.id !== id));
  }

  function updateExperience(
    id: string,
    field: keyof Experience,
    value: string | boolean,
  ) {
    setExperience((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
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
      current.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  }
  function addSkill() {
    setSkills((current) => [
      ...current,
      { id: createId(), name: "", level: "" },
    ]);
  }
  function removeSkill(id: string) {
    setSkills((current) => current.filter((s) => s.id !== id));
  }

  function updateEducation(id: string, field: keyof Education, value: string) {
    setEducation((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
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
        item.id === id ? { ...item, [field]: value } : item,
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
    setDesignPreferences((current) => ({ ...current, [field]: value }));
  }
  function updateSEO(
    field: keyof typeof seo,
    value: string | boolean | string[],
  ) {
    setSeo((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsResumeBusy(autoGenerateResume || attachUploadedResume);

    startTransition(async () => {
      try {
        let finalResumeUrl = (data?.resumeUrl ?? resumeUrl ?? "").trim();

        if (autoGenerateResume) {
          finalResumeUrl = "";
        } else if (attachUploadedResume) {
          finalResumeUrl = (uploadedResumeUrl || resumeUrl || "").trim();
        }

        const result = await updatePortfolioData({
          portfolioId: portfolio.id,
          headline,
          about,
          projects,
          experience,
          skills,
          education,
          certificates,
          resumeUrl: finalResumeUrl,
          theme,
          animations,
          componentSelection,
          designPreferences,
          seo,
        });

        if (!result.success) {
          setMessage({
            type: "error",
            text: result.message ?? "Unable to save portfolio.",
          });
          return;
        }

        if (autoGenerateResume) {
          const generated = await generateAndAttachResume(
            portfolio.id,
            data?.resumeUrl ?? resumeUrl,
          );

          if (!generated.success || !generated.data?.resumeUrl) {
            throw new Error(
              generated.message ?? "Portfolio saved, but resume generation failed.",
            );
          }

          setResumeUrl(generated.data.resumeUrl);
          setAutoGenerateResume(false);
          setAttachUploadedResume(false);
        } else if (attachUploadedResume && uploadedResumeUrl) {
          setResumeUrl(uploadedResumeUrl);
          setAttachUploadedResume(false);
        }

        setMessage({ type: "success", text: "Portfolio saved successfully." });
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Unable to save portfolio.",
        });
      } finally {
        setIsResumeBusy(false);
      }
    });
  }

  function handleResumeUpload(file: File | null, input: HTMLInputElement) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "resume");
    formData.append("portfolioId", portfolio.id);

    setIsResumeBusy(true);
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await uploadFile(formData);

        if (!result.success || !result.data?.url) {
          throw new Error(result.message ?? "Unable to upload resume.");
        }

        setUploadedResumeId(result.data.id);
        setUploadedResumeUrl(result.data.url);
        setHasUploadedResume(true);
        setAttachUploadedResume(false);
        setAutoGenerateResume(false);
        setMessage({ type: "success", text: "Resume uploaded. Enable attach to use it." });
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Unable to upload resume.",
        });
      } finally {
        setIsResumeBusy(false);
        input.value = "";
      }
    });
  }

  function handleRemoveUploadedResume() {
    if (!uploadedResumeId) return;

    setIsResumeBusy(true);
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await deleteUpload(uploadedResumeId);
        if (!result.success) throw new Error(result.message ?? "Unable to delete resume.");

        const removedCurrent = uploadedResumeUrl && resumeUrl === uploadedResumeUrl;
        setUploadedResumeId(null);
        setUploadedResumeUrl(null);
        setHasUploadedResume(false);
        setAttachUploadedResume(false);
        if (removedCurrent) setResumeUrl("");
        setAutoGenerateResume(true);
        setMessage({ type: "success", text: "Uploaded resume removed." });
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Unable to delete resume.",
        });
      } finally {
        setIsResumeBusy(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[220px_1fr]"
    >
      <div className="lg:sticky lg:top-24 lg:self-start">
        <EditorNav active={activeSection} onChange={setActiveSection} />
      </div>

      <div className="space-y-6">
        {activeSection === "overview" && (
          <section className="surface-card space-y-5 p-6">
            <div>
              <h2 className="text-h3">Overview</h2>
              <p className="text-small mt-1">
                Main information shown on your portfolio.
              </p>
            </div>

            <Input
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Full Stack Developer"
            />
            <AiAssistButton
              portfolioId={portfolio.id}
              field="headline"
              currentText={headline}
              onAccept={setHeadline}
              label="Suggest a headline"
            />

            <Textarea
              label="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={8}
              placeholder="Tell people about yourself..."
            />
            <AiAssistButton
              portfolioId={portfolio.id}
              field="about"
              currentText={about}
              onAccept={setAbout}
              label="Improve this section"
            />
          </section>
        )}

        {activeSection === "projects" && (
          <section className="surface-card space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h3">Projects</h2>
                <p className="text-small mt-1">Showcase your best work.</p>
              </div>
            </div>

            {projects.length === 0 && (
              <p className="text-small">No projects added yet.</p>
            )}

            <div className="space-y-4">
              {projects.map((project, index) => (
                <RepeaterCard
                  key={project.id}
                  title={`Project ${index + 1}`}
                  onRemove={() => removeProject(project.id)}
                >
                  <Input
                    value={project.title}
                    onChange={(e) =>
                      updateProject(project.id, "title", e.target.value)
                    }
                    placeholder="Project title"
                  />
                  <Textarea
                    value={project.description ?? ""}
                    onChange={(e) =>
                      updateProject(project.id, "description", e.target.value)
                    }
                    rows={4}
                    placeholder="Project description"
                  />
                  <AiAssistButton
                    portfolioId={portfolio.id}
                    field="project_description"
                    currentText={project.description ?? ""}
                    context={project.title}
                    onAccept={(text) =>
                      updateProject(project.id, "description", text)
                    }
                  />
                  <Input
                    value={project.url ?? ""}
                    onChange={(e) =>
                      updateProject(project.id, "url", e.target.value)
                    }
                    placeholder="Project URL"
                  />
                  <Input
                    value={project.technologies?.join(", ") ?? ""}
                    onChange={(e) =>
                      updateProject(
                        project.id,
                        "technologies",
                        e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="React, Next.js, PostgreSQL"
                  />
                  <Input
                    value={project.imageUrl ?? ""}
                    onChange={(e) =>
                      updateProject(project.id, "imageUrl", e.target.value)
                    }
                    placeholder="Project image URL"
                  />
                </RepeaterCard>
              ))}
            </div>

            <AddButton label="Add project" onClick={addProject} />
          </section>
        )}

        {activeSection === "experience" && (
          <section className="surface-card space-y-4 p-6">
            <div>
              <h2 className="text-h3">Experience</h2>
              <p className="text-small mt-1">
                Add your professional experience.
              </p>
            </div>

            <div className="space-y-4">
              {experience.map((item, index) => (
                <RepeaterCard
                  key={item.id}
                  title={`Experience ${index + 1}`}
                  onRemove={() => removeExperience(item.id)}
                >
                  <Input
                    value={item.role}
                    onChange={(e) =>
                      updateExperience(item.id, "role", e.target.value)
                    }
                    placeholder="Software Engineer"
                  />
                  <Input
                    value={item.company}
                    onChange={(e) =>
                      updateExperience(item.id, "company", e.target.value)
                    }
                    placeholder="Company"
                  />
                  <Input
                    value={item.location ?? ""}
                    onChange={(e) =>
                      updateExperience(item.id, "location", e.target.value)
                    }
                    placeholder="Location"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="date"
                      value={item.startDate ?? ""}
                      onChange={(e) =>
                        updateExperience(item.id, "startDate", e.target.value)
                      }
                    />
                    <Input
                      type="date"
                      value={item.endDate ?? ""}
                      disabled={item.current}
                      onChange={(e) =>
                        updateExperience(item.id, "endDate", e.target.value)
                      }
                    />
                  </div>
                  <Switch
                    checked={item.current ?? false}
                    onChange={(value) =>
                      updateExperience(item.id, "current", value)
                    }
                    label="Currently working here"
                  />
                  <Textarea
                    value={item.description ?? ""}
                    onChange={(e) =>
                      updateExperience(item.id, "description", e.target.value)
                    }
                    rows={4}
                    placeholder="Describe your work..."
                  />
                  <AiAssistButton
                    portfolioId={portfolio.id}
                    field="experience_description"
                    currentText={item.description ?? ""}
                    context={`${item.role} at ${item.company}`}
                    onAccept={(text) =>
                      updateExperience(item.id, "description", text)
                    }
                  />
                </RepeaterCard>
              ))}
            </div>

            <AddButton label="Add experience" onClick={addExperience} />
          </section>
        )}

        {activeSection === "skills" && (
          <section className="surface-card space-y-4 p-6">
            <h2 className="text-h3">Skills</h2>

            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <Input
                    value={skill.name}
                    onChange={(e) =>
                      updateSkill(skill.id, "name", e.target.value)
                    }
                    placeholder={`Skill ${index + 1}`}
                    className="flex-1"
                  />
                  <Input
                    value={skill.level ?? ""}
                    onChange={(e) =>
                      updateSkill(skill.id, "level", e.target.value)
                    }
                    placeholder="Expert / Intermediate"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <AddButton label="Add skill" onClick={addSkill} />
          </section>
        )}

        {activeSection === "education" && (
          <section className="surface-card space-y-4 p-6">
            <h2 className="text-h3">Education</h2>

            <div className="space-y-4">
              {education.map((item, index) => (
                <RepeaterCard
                  key={item.id}
                  title={`Education ${index + 1}`}
                  onRemove={() => removeEducation(item.id)}
                >
                  <Input
                    value={item.institution}
                    onChange={(e) =>
                      updateEducation(item.id, "institution", e.target.value)
                    }
                    placeholder="Institution"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      value={item.degree ?? ""}
                      onChange={(e) =>
                        updateEducation(item.id, "degree", e.target.value)
                      }
                      placeholder="Degree"
                    />
                    <Input
                      value={item.field ?? ""}
                      onChange={(e) =>
                        updateEducation(item.id, "field", e.target.value)
                      }
                      placeholder="Field of study"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="date"
                      value={item.startDate ?? ""}
                      onChange={(e) =>
                        updateEducation(item.id, "startDate", e.target.value)
                      }
                    />
                    <Input
                      type="date"
                      value={item.endDate ?? ""}
                      onChange={(e) =>
                        updateEducation(item.id, "endDate", e.target.value)
                      }
                    />
                  </div>
                  <Textarea
                    value={item.description ?? ""}
                    onChange={(e) =>
                      updateEducation(item.id, "description", e.target.value)
                    }
                    rows={3}
                    placeholder="Additional information"
                  />
                </RepeaterCard>
              ))}
            </div>

            <AddButton label="Add education" onClick={addEducation} />
          </section>
        )}

        {activeSection === "certificates" && (
          <section className="surface-card space-y-4 p-6">
            <h2 className="text-h3">Certificates</h2>

            <div className="space-y-4">
              {certificates.map((item, index) => (
                <RepeaterCard
                  key={item.id}
                  title={`Certificate ${index + 1}`}
                  onRemove={() => removeCertificate(item.id)}
                >
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateCertificate(item.id, "name", e.target.value)
                    }
                    placeholder="Certificate name"
                  />
                  <Input
                    value={item.issuer ?? ""}
                    onChange={(e) =>
                      updateCertificate(item.id, "issuer", e.target.value)
                    }
                    placeholder="Issuing organization"
                  />
                  <Input
                    type="date"
                    value={item.issueDate ?? ""}
                    onChange={(e) =>
                      updateCertificate(item.id, "issueDate", e.target.value)
                    }
                  />
                  <Input
                    value={item.credentialUrl ?? ""}
                    onChange={(e) =>
                      updateCertificate(
                        item.id,
                        "credentialUrl",
                        e.target.value,
                      )
                    }
                    placeholder="Credential URL"
                  />
                </RepeaterCard>
              ))}
            </div>

            <AddButton label="Add certificate" onClick={addCertificate} />
          </section>
        )}

        {activeSection === "resume" && (
          <section className="surface-card space-y-5 p-6">
            <div>
              <h2 className="text-h3">Resume</h2>
              <p className="text-small mt-1 text-muted-foreground">
                Upload a resume, explicitly attach it, or create one from your
                portfolio form data.
              </p>
            </div>

            {resumeUrl && (
              <div className="space-y-2 rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-label">Current resume</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small break-all text-primary underline"
                >
                  View / download resume
                </a>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              <label className="surface-panel flex cursor-pointer flex-col gap-3 p-4">
                <div>
                  <p className="text-label">1. Upload resume</p>
                  <p className="text-small mt-1 text-muted-foreground">
                    PDF only · max 5MB. Uploading does not attach it yet.
                  </p>
                </div>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={isResumeBusy}
                  onChange={(e) => handleResumeUpload(e.target.files?.[0] ?? null, e.target)}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
                />
              </label>

              <div className="surface-panel flex flex-col justify-between gap-4 p-4">
                <div>
                  <p className="text-label">2. Attach uploaded resume</p>
                  <p className="text-small mt-1 text-muted-foreground">
                    Disabled until a device resume exists.
                  </p>
                </div>
                <Switch
                  checked={attachUploadedResume}
                  disabled={!hasUploadedResume || autoGenerateResume || isResumeBusy}
                  onChange={(value) => {
                    setAttachUploadedResume(value);
                    if (value) setAutoGenerateResume(false);
                  }}
                  label="Attach this resume to portfolio"
                />
              </div>

              <div className="surface-panel flex flex-col justify-between gap-4 p-4">
                <div>
                  <p className="text-label">3. Create resume from form data</p>
                  <p className="text-small mt-1 text-muted-foreground">
                    Generate and automatically attach a PDF from your saved form data.
                  </p>
                </div>
                <Switch
                  checked={autoGenerateResume}
                  disabled={isResumeBusy}
                  onChange={(value) => {
                    setAutoGenerateResume(value);
                    if (value) setAttachUploadedResume(false);
                  }}
                  label="Auto-generate resume from form data"
                />
              </div>
            </div>

            {hasUploadedResume && uploadedResumeUrl && (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-label">Uploaded resume</p>
                  <a
                    href={uploadedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small break-all text-primary underline"
                  >
                    View uploaded PDF
                  </a>
                </div>
                <button
                  type="button"
                  disabled={isResumeBusy}
                  onClick={handleRemoveUploadedResume}
                  className="shrink-0 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-destructive hover:text-destructive disabled:opacity-50"
                >
                  Remove uploaded resume
                </button>
              </div>
            )}
          </section>
        )}

        {activeSection === "design" && (
          <div className="space-y-6">
            <section className="surface-card space-y-5 p-6">
              <div>
                <h2 className="text-h3">Portfolio sections</h2>
                <p className="text-small mt-1">
                  Choose what appears on your public portfolio.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(componentSelection).map(([key, value]) => (
                  <div key={key} className="surface-panel px-4 py-3">
                    <Switch
                      checked={value}
                      onChange={() =>
                        toggleComponent(key as keyof typeof componentSelection)
                      }
                      label={SECTION_LABELS[key] ?? key}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-card space-y-5 p-6">
              <div>
                <h2 className="text-h3">Theme</h2>
                <p className="text-small mt-1">
                  The overall visual style of your published portfolio.
                </p>
              </div>

              <OptionCardGroup
                options={THEME_OPTIONS}
                value={theme}
                onChange={setTheme}
              />

              <div className="surface-panel px-4 py-3">
                <Switch
                  checked={animations}
                  onChange={setAnimations}
                  label="Motion"
                  description="Subtle entrance and hover animations on your public portfolio."
                />
              </div>
            </section>

            <section className="surface-card space-y-6 p-6">
              <div>
                <h2 className="text-h3">Design preferences</h2>
                <p className="text-small mt-1">
                  Customize the visual style of your portfolio.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-label">Layout</p>
                <OptionCardGroup
                  options={LAYOUT_OPTIONS}
                  value={designPreferences.layout}
                  onChange={(value) => updateDesignPreference("layout", value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-label">Corner radius</p>
                <OptionCardGroup
                  columns={4}
                  options={RADIUS_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                    preview: (
                      <div
                        className="h-full w-full bg-border-strong"
                        style={{ borderRadius: option.radius }}
                      />
                    ),
                  }))}
                  value={designPreferences.borderRadius}
                  onChange={(value) =>
                    updateDesignPreference("borderRadius", value)
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-label">Card style</p>
                <OptionCardGroup
                  options={CARD_STYLE_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                    preview: (
                      <div
                        className={cn(
                          "h-full w-full rounded-md",
                          option.value === "flat" && "bg-surface-3",
                          option.value === "bordered" &&
                            "border border-border-strong bg-transparent",
                          option.value === "elevated" &&
                            "shadow-elevated bg-surface-2",
                        )}
                      />
                    ),
                  }))}
                  value={designPreferences.cardStyle}
                  onChange={(value) =>
                    updateDesignPreference("cardStyle", value)
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-label">Font</p>
                <Select
                  value={designPreferences.fontFamily}
                  onChange={(e) =>
                    updateDesignPreference("fontFamily", e.target.value)
                  }
                >
                  <option value="Inter">Inter</option>
                  <option value="Geist">Geist</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Playfair Display">Playfair Display</option>
                </Select>
                <p
                  className="text-small"
                  style={{ fontFamily: designPreferences.fontFamily }}
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-label">Accent color</p>
                <div className="flex flex-wrap items-center gap-2">
                  {ACCENT_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        updateDesignPreference("accentColor", color)
                      }
                      aria-label={color}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-transform hover:scale-105",
                        designPreferences.accentColor === color
                          ? "border-foreground"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={designPreferences.accentColor}
                    onChange={(e) =>
                      updateDesignPreference("accentColor", e.target.value)
                    }
                    className="h-8 w-8 rounded-full border border-border bg-transparent"
                  />
                </div>
                <Input
                  value={designPreferences.accentColor}
                  onChange={(e) =>
                    updateDesignPreference("accentColor", e.target.value)
                  }
                  placeholder="#6c5cff"
                />
              </div>
            </section>
          </div>
        )}

        {activeSection === "seo" && (
          <section className="surface-card space-y-5 p-6">
            <div>
              <h2 className="text-h3">SEO</h2>
              <p className="text-small mt-1">
                Configure how your public portfolio appears in search and social
                previews.
              </p>
            </div>

            <Input
              label="SEO title"
              value={seo.title}
              maxLength={70}
              onChange={(e) => updateSEO("title", e.target.value)}
              placeholder="Faizan — Full Stack Developer"
              hint={`${seo.title.length}/70`}
            />

            <Textarea
              label="Meta description"
              value={seo.description}
              maxLength={160}
              onChange={(e) => updateSEO("description", e.target.value)}
              rows={4}
              placeholder="A short description of your portfolio..."
              hint={`${seo.description.length}/160`}
            />

            <Input
              label="Keywords"
              value={seo.keywords.join(", ")}
              onChange={(e) =>
                updateSEO(
                  "keywords",
                  e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                )
              }
              placeholder="Next.js, React, TypeScript, Full Stack Developer"
              hint="Separate keywords with commas."
            />

            <Input
              label="Social preview image URL"
              value={seo.ogImage}
              onChange={(e) => updateSEO("ogImage", e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Canonical URL"
              value={seo.canonicalUrl}
              onChange={(e) => updateSEO("canonicalUrl", e.target.value)}
              placeholder="https://example.com/faizan"
            />

            <div className="surface-panel px-4 py-3">
              <Switch
                checked={seo.noIndex}
                onChange={(value) => updateSEO("noIndex", value)}
                label="Prevent search engines from indexing this portfolio"
              />
            </div>
          </section>
        )}

        <div className="sticky bottom-4 flex items-center gap-4 rounded-xl border border-border bg-surface/90 p-4 shadow-elevated backdrop-blur-xl">
          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-small text-success"
                  : "text-small text-error"
              }
            >
              {message.text}
            </p>
          )}
          <Button
            type="submit"
            variant="gradient"
            loading={isPending}
            className="ml-auto"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
