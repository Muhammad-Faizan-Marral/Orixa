"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePortfolioData } from "@/actions/portfolio/update-portfolio-data";
import { uploadFile } from "@/actions/profile/upload-file";
import { CreationModeSelect } from "@/features/portfolio/components/creation-mode-select";
import { WizardProgress } from "@/features/portfolio/components/wizard-progress";
import {
  CONTENT_STEPS,
  type WizardStepId,
} from "@/features/portfolio/wizard-steps";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { parseResumeAction } from "@/actions/portfolio/parse-resume";
import { finalizePortfolioAction } from "@/actions/portfolio/finalize-portfolio";
import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Button } from "@/components/UI/Button";
import { Switch } from "@/components/UI/Switch";
import { generateAndAttachResume } from "@/actions/portfolio/generate-resume";

/* ── Types ── */

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

type PortfolioWizardProps = {
  portfolio: { id: string; title: string; slug: string; status: string };
  data: {
    name: string | null;
    prompt: string | null;
    avatarUrl: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    headline: string | null;
    about: string | null;
    projects: Project[] | null;
    experience: Experience[] | null;
    skills: Skill[] | null;
    education: Education[] | null;
    certificates: Certificate[] | null;
    resumeUrl: string | null;
    theme: string | null;
    animations: boolean | null;
    componentSelection: Record<string, unknown> | null;
    designPreferences: Record<string, unknown> | null;
    seo: Record<string, unknown> | null;
  } | null;
  isNew?: boolean;
};

/* ── Field-level validation ── */

type FieldErrors = Record<string, string>;

type ValidationState = {
  name: string;
  headline: string;
  about: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  prompt: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
  seoTitle: string;
  seoDescription: string;
};

const URL_RE = /^https?:\/\/.+/i;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;
const SKILL_NAME_RE = /^[a-zA-Z0-9+#.\- ]+$/;

function validateStep(
  stepId: WizardStepId,
  state: ValidationState,
): FieldErrors {
  const errors: FieldErrors = {};

  if (stepId === "basics") {
    if (!state.name.trim() || state.name.trim().length < 2) {
      errors.name = "Full name required (min 2 chars). Example: Ali Khan";
    }
    if (state.headline.trim().length > 200) {
      errors.headline = "Headline max 200 characters.";
    }
    if (state.about.trim().length > 5000) {
      errors.about = "About max 5000 characters.";
    }
    if (state.phone.trim() && !PHONE_RE.test(state.phone.trim())) {
      errors.phone = "Invalid phone. Example: +92 300 1234567";
    }
    if (state.linkedinUrl.trim() && !URL_RE.test(state.linkedinUrl.trim())) {
      errors.linkedinUrl =
        "Must start with http:// or https://. Example: https://linkedin.com/in/ali";
    }
    if (state.githubUrl.trim() && !URL_RE.test(state.githubUrl.trim())) {
      errors.githubUrl =
        "Must start with http:// or https://. Example: https://github.com/ali";
    }
  }

  if (stepId === "skills") {
    state.skills.forEach((s, i) => {
      if (!s.name.trim() || s.name.trim().length < 2) {
        errors[`skill-${s.id}`] =
          `Skill #${i + 1}: name min 2 chars. Example: React`;
      } else if (!SKILL_NAME_RE.test(s.name.trim())) {
        errors[`skill-${s.id}`] =
          `Skill #${i + 1}: only letters, numbers, + # . - allowed`;
      }
    });
  }

  if (stepId === "experience") {
    state.experience.forEach((e, i) => {
      if (!e.company.trim()) {
        errors[`exp-company-${e.id}`] =
          `Experience #${i + 1}: company required`;
      }
      if (!e.role.trim()) {
        errors[`exp-role-${e.id}`] = `Experience #${i + 1}: role required`;
      }
    });
  }

  if (stepId === "projects") {
    state.projects.forEach((p, i) => {
      if (!p.title.trim() || p.title.trim().length < 2) {
        errors[`proj-title-${p.id}`] =
          `Project #${i + 1}: title min 2 chars. Example: E-commerce App`;
      }
      if (p.url?.trim() && !URL_RE.test(p.url.trim())) {
        errors[`proj-url-${p.id}`] =
          `Project #${i + 1}: URL must start with http:// or https://`;
      }
    });
  }

  if (stepId === "education") {
    state.education.forEach((e, i) => {
      if (!e.institution.trim()) {
        errors[`edu-inst-${e.id}`] =
          `Education #${i + 1}: institution required. Example: NUST`;
      }
    });
  }

  if (stepId === "certificates") {
    state.certificates.forEach((c, i) => {
      if (!c.name.trim()) {
        errors[`cert-name-${c.id}`] = `Certificate #${i + 1}: name required`;
      }
      if (c.credentialUrl?.trim() && !URL_RE.test(c.credentialUrl.trim())) {
        errors[`cert-url-${c.id}`] =
          `Certificate #${i + 1}: URL must start with http:// or https://`;
      }
    });
  }

  if (stepId === "seo") {
    if (state.seoTitle.length > 70) {
      errors.seoTitle = "SEO title max 70 characters.";
    }
    if (state.seoDescription.length > 160) {
      errors.seoDescription = "SEO description max 160 characters.";
    }
  }

  return errors;
}

function createId() {
  return crypto.randomUUID();
}

function isPortfolioEmpty(data: PortfolioWizardProps["data"]) {
  if (!data) return true;
  const hasContent =
    (data.name && data.name.trim()) ||
    (data.headline && data.headline.trim()) ||
    (data.about && data.about.trim()) ||
    (data.skills && data.skills.length > 0) ||
    (data.projects && data.projects.length > 0) ||
    (data.experience && data.experience.length > 0);
  return !hasContent;
}

export function PortfolioWizard({
  portfolio,
  data,
  isNew,
}: PortfolioWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showModeFirst = isNew ?? isPortfolioEmpty(data);

  const [step, setStep] = useState<WizardStepId>(
    showModeFirst ? "mode" : "basics",
  );

  const [mode, setMode] = useState<"resume" | "manual" | null>(
    showModeFirst ? null : "manual",
  );

  /* ── Form state ── */
  const [name, setName] = useState(data?.name ?? "");
  const [prompt, setPrompt] = useState(data?.prompt ?? "");
  const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl ?? "");
  const [phone, setPhone] = useState(data?.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(data?.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(data?.githubUrl ?? "");
  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [about, setAbout] = useState(data?.about ?? "");
  const [skills, setSkills] = useState<Skill[]>(data?.skills ?? []);
  const [parsing, setParsing] = useState(false);
  const [experience, setExperience] = useState<Experience[]>(
    data?.experience ?? [],
  );
  const [projects, setProjects] = useState<Project[]>(data?.projects ?? []);
  const [education, setEducation] = useState<Education[]>(
    data?.education ?? [],
  );
  const [certificates, setCertificates] = useState<Certificate[]>(
    data?.certificates ?? [],
  );
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl ?? "");
  const [autoGenerateResume, setAutoGenerateResume] = useState(false);

  const [seoTitle, setSeoTitle] = useState(
    (data?.seo?.title as string) ?? portfolio.title,
  );
  const [seoDescription, setSeoDescription] = useState(
    (data?.seo?.description as string) ?? "",
  );
  const [seoKeywords, setSeoKeywords] = useState(
    ((data?.seo?.keywords as string[]) ?? []).join(", "),
  );
  const [seoNoIndex, setSeoNoIndex] = useState(
    (data?.seo?.noIndex as boolean) ?? false,
  );

  /* ── Field-level errors ── */
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(key: string) {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const promptLocked = Boolean(data?.prompt && data.prompt.trim().length > 0);

  const contentStepIndex = useMemo(
    () => CONTENT_STEPS.findIndex((s) => s.id === step),
    [step],
  );

  function currentValidationState(): ValidationState {
    return {
      name,
      headline,
      about,
      phone,
      linkedinUrl,
      githubUrl,
      prompt,
      skills,
      experience,
      projects,
      education,
      certificates,
      seoTitle,
      seoDescription,
    };
  }

  function goNext() {
    if (step === "mode") return;

    const errors = validateStep(step, currentValidationState());
    console.log(
      `[PortfolioWizard] goNext from "${step}" — validation errors:`,
      errors,
    );
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage({
        type: "error",
        text: "Is step me errors hain — red text wale fields fix karo.",
      });
      return;
    }

    setMessage(null);
    const idx = CONTENT_STEPS.findIndex((s) => s.id === step);
    if (idx < CONTENT_STEPS.length - 1) {
      const nextStep = CONTENT_STEPS[idx + 1].id;
      console.log(`[PortfolioWizard] moving to step "${nextStep}"`);
      setStep(nextStep);
    }
  }

  function goBack() {
    if (step === "mode") return;
    const idx = CONTENT_STEPS.findIndex((s) => s.id === step);
    console.log(`[PortfolioWizard] goBack from "${step}"`);
    setFieldErrors({});
    if (idx > 0) {
      const prevStep = CONTENT_STEPS[idx - 1].id;
      console.log(`[PortfolioWizard] moving back to step "${prevStep}"`);
      setStep(prevStep);
      setMessage(null);
    } else if (showModeFirst && mode) {
      console.log("[PortfolioWizard] moving back to mode select");
      setStep("mode");
      setMode(null);
    }
  }

  function handleModeSelect(selected: "resume" | "manual") {
    console.log(`[PortfolioWizard] mode selected: ${selected}`);
    setMode(selected);
    setFieldErrors({});
    setStep(selected === "resume" ? "resume" : "basics");
  }

  /* ── Avatar upload (portfolio-scoped) ── */
  async function handleAvatarUpload(
    file: File | null,
    inputEl?: HTMLInputElement | null,
  ) {
    if (!file) return;
    console.log("[PortfolioWizard] handleAvatarUpload — file selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);
    // temporary: project-image type until portfolio-avatar type add
    formData.append("type", "project-image");
    formData.append("portfolioId", portfolio.id);

    try {
      const result = await uploadFile(formData);
      console.log("[PortfolioWizard] handleAvatarUpload — result:", result);

      if (result.success && result.data?.url) {
        setAvatarUrl(result.data.url);
      } else if (!result.success) {
        setMessage({
          type: "error",
          text: result.message ?? "Avatar upload failed.",
        });
      }
    } catch (err) {
      console.error(
        "[PortfolioWizard] handleAvatarUpload — unexpected error:",
        err,
      );
      setMessage({
        type: "error",
        text: "Unexpected error uploading avatar. Try again.",
      });
    } finally {
      // Reset input so re-selecting the same file re-triggers onChange
      if (inputEl) inputEl.value = "";
    }
  }

  /* ── Resume upload ── */
  async function handleResumeUpload(
    file: File | null,
    inputEl?: HTMLInputElement | null,
  ) {
    if (!file) return;

    setMessage(null);
    setFieldErrors({});

    // Client-side checks (foran feedback)
    const MAX = 5 * 1024 * 1024;
    if (file.size <= 0) {
      setMessage({
        type: "error",
        text: "File empty hai. Valid PDF select karo.",
      });
      if (inputEl) inputEl.value = "";
      return;
    }
    if (file.size > MAX) {
      setMessage({
        type: "error",
        text: `PDF max 5MB honi chahiye. Aap ki file ${(file.size / (1024 * 1024)).toFixed(1)}MB hai.`,
      });
      if (inputEl) inputEl.value = "";
      return;
    }
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setMessage({
        type: "error",
        text: "Sirf PDF allowed hai. Example: resume.pdf",
      });
      if (inputEl) inputEl.value = "";
      return;
    }

    setParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("portfolioId", portfolio.id);

      const result = await parseResumeAction(formData);

      if (!result.success) {
        setMessage({ type: "error", text: result.message });
        return;
      }

      const d = result.data;

      setName(d.name || name);
      setHeadline(d.headline || headline);
      setAbout(d.about || about);
      setPhone(d.phone || phone);
      setLinkedinUrl(d.linkedinUrl || linkedinUrl);
      setGithubUrl(d.githubUrl || githubUrl);
      if (d.skills?.length) setSkills(d.skills);
      if (d.experience?.length) setExperience(d.experience);
      if (d.projects?.length) setProjects(d.projects);
      if (d.education?.length) setEducation(d.education);
      if (d.certificates?.length) setCertificates(d.certificates);
      if (d.resumeUrl) setResumeUrl(d.resumeUrl);

      setMessage({
        type: "success",
        text: "Resume se data extract ho gaya. Fields check / edit kar lo.",
      });
      setStep("basics");
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Upload fail ho gaya. Network check karo ya chhoti PDF try karo (max 5MB).",
      });
    } finally {
      setParsing(false);
      if (inputEl) inputEl.value = "";
    }
  }

  /* ── Final submit ── */
  function handleSubmit() {
    setMessage(null);

    // Validate every content step before submitting, not just the review step
    const state = currentValidationState();
    const allErrors: FieldErrors = {};
    for (const s of CONTENT_STEPS) {
      Object.assign(allErrors, validateStep(s.id, state));
    }
    console.log(
      "[PortfolioWizard] handleSubmit — full validation errors:",
      allErrors,
    );
    setFieldErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstInvalidStep = CONTENT_STEPS.find(
        (s) => Object.keys(validateStep(s.id, state)).length > 0,
      );
      console.warn(
        "[PortfolioWizard] handleSubmit — blocked, first invalid step:",
        firstInvalidStep?.id,
      );
      setMessage({
        type: "error",
        text: "Is step me errors hain — red text wale fields fix karo.",
      });
      if (firstInvalidStep) setStep(firstInvalidStep.id);
      return;
    }

    startTransition(async () => {
      const keywords = seoKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const payload = {
        portfolioId: portfolio.id,
        name,
        prompt: (promptLocked ? (data?.prompt ?? prompt) : prompt).trim(),
        avatarUrl,
        phone,
        linkedinUrl,
        githubUrl,
        headline,
        about,
        skills,
        experience,
        projects,
        education,
        certificates,
        resumeUrl: autoGenerateResume ? "" : resumeUrl,
        theme: data?.theme ?? "minimal",
        animations: data?.animations ?? true,
        componentSelection: {},
        designPreferences: {},
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords,
          noIndex: seoNoIndex,
        },
      };

      console.log("[PortfolioWizard] handleSubmit — payload:", payload);

      try {
        const result = await finalizePortfolioAction(payload);

        if (!result.success) {
          const fe = (result as any).fieldErrors as
            | Record<string, string[] | undefined>
            | undefined;

          let detail = result.message ?? "Unable to save portfolio.";

          if (fe && typeof fe === "object") {
            const lines: string[] = [];
            const mappedErrors: FieldErrors = {};
            for (const [key, msgs] of Object.entries(fe)) {
              if (!msgs?.length) continue;
              lines.push(`${key}: ${msgs.join(", ")}`);
              // map server-side keys back onto the same fieldErrors state
              // used for inline field highlighting where the keys line up
              mappedErrors[key] = msgs[0];
            }
            if (lines.length) {
              detail = `Invalid fields:\n${lines.join("\n")}`;
              setFieldErrors((prev) => ({ ...prev, ...mappedErrors }));
              console.error("[finalize] fieldErrors", fe);
            }
          }

          setMessage({ type: "error", text: detail });
          return;
        }
        console.log(
          "[PortfolioWizard] handleSubmit — finalizePortfolioAction result:",
          result,
        );

        if (autoGenerateResume) {
          const gen = await generateAndAttachResume(portfolio.id);
          console.log(
            "[PortfolioWizard] handleSubmit — generateAndAttachResume result:",
            gen,
          );
          if (!gen.success) {
            setMessage({
              type: "error",
              text:
                (gen.message ?? "Resume generation failed.") +
                " (portfolio save ho chuka hai)",
            });
            // still redirect or stay
          }
        }
        if (result.designMeta?.usedAi) {
          setMessage({
            type: "success",
            text: "Portfolio saved. Gemini nay design / variants set kar diye.",
          });
        } else if (result.designMeta?.errorMessage) {
          setMessage({
            type: "error",
            text: `Portfolio save ho gaya, lekin design AI fail: ${result.designMeta.errorMessage}`,
          });
        } else {
          setMessage({
            type: "success",
            text: "Portfolio saved (random design — prompt empty tha).",
          });
        }

        router.push(`/dashboard/portfolios/${portfolio.id}`);
        router.refresh();
      } catch (err) {
        console.error(
          "[PortfolioWizard] handleSubmit — unexpected error:",
          err,
        );
        setMessage({
          type: "error",
          text: "Unexpected error saving portfolio. Try again.",
        });
      }
    });
  }

  /* ── Mode select screen ── */
  if (step === "mode") {
    return <CreationModeSelect onSelect={handleModeSelect} />;
  }

  const isLastStep = step === "review";

  return (
    <div className="mx-auto max-w-3xl space-y-8">

      <div>
        <p className="text-caption text-accent">{portfolio.title}</p>
        <h1 className="text-h1 mt-1">
          {showModeFirst ? "Build your portfolio" : "Edit portfolio"}
        </h1>
        {mode === "resume" && (
          <p className="text-small mt-1 text-muted-foreground">
            Started from resume · you can still edit every field
          </p>
        )}
      </div>
      
      {parsing && (
        <p className="text-small text-primary">Parsing resume with AI…</p>
      )}
      <WizardProgress currentStepId={step} />

      {message && (
        <p
          role="alert"
          className={
            "rounded-lg border px-3 py-2.5 text-sm whitespace-pre-wrap " +
            (message.type === "error"
              ? "border-error/20 bg-error/10 text-error"
              : "border-success/20 bg-success/10 text-success")
          }
        >
          {message.text}
        </p>
      )}

      <div className="surface-card space-y-6 p-6 md:p-8">
        {/* ════ BASICS ════ */}
        {step === "basics" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Basics</h2>
              <p className="text-small text-muted-foreground mt-1">
                Name, headline, contact links and your prompt for AI design.
              </p>
            </div>

            <Input
              id="name"
              label="Full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              placeholder="Ali Khan"
              error={fieldErrors.name}
            />

            <Input
              id="headline"
              label="Headline"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                clearFieldError("headline");
              }}
              placeholder="Full-stack developer · Next.js & Node"
              error={fieldErrors.headline}
            />

            <Textarea
              id="about"
              label="About"
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
                clearFieldError("about");
              }}
              placeholder="Short bio about yourself..."
              rows={4}
              error={fieldErrors.about}
            />

            <div className="space-y-2">
              <p className="text-label">Avatar / profile photo</p>
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover border border-border"
                />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  handleAvatarUpload(e.target.files?.[0] ?? null, e.target)
                }
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
              />
              <p className="text-small text-muted-foreground">
                Portfolio-specific photo (profile avatar se alag).
              </p>
            </div>

            <Input
              id="phone"
              label="Phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              placeholder="+92 300 1234567"
              error={fieldErrors.phone}
            />

            <Input
              id="linkedin"
              label="LinkedIn URL"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value);
                clearFieldError("linkedinUrl");
              }}
              placeholder="https://linkedin.com/in/..."
              error={fieldErrors.linkedinUrl}
            />

            <Input
              id="github"
              label="GitHub URL"
              value={githubUrl}
              onChange={(e) => {
                setGithubUrl(e.target.value);
                clearFieldError("githubUrl");
              }}
              placeholder="https://github.com/..."
              error={fieldErrors.githubUrl}
            />

            <div className="space-y-2">
              <Textarea
                id="prompt"
                label="Enter a prompt (for AI design)"
                value={prompt}
                onChange={(e) => {
                  if (!promptLocked) setPrompt(e.target.value);
                }}
                placeholder="Make it modern, dark theme, focus on full-stack projects..."
                rows={3}
                disabled={promptLocked}
              />
              {promptLocked && (
                <p className="text-small text-muted-foreground">
                  Prompt is locked after first save / publish.
                </p>
              )}
            </div>
          </section>
        )}

        {/* ════ SKILLS ════ */}
        {step === "skills" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Skills</h2>
              <p className="text-small text-muted-foreground mt-1">
                Add real skill names (min 2 characters). Invalid short text will
                be rejected on submit.
              </p>
            </div>

            {skills.map((skill) => (
              <RepeaterCard
                key={skill.id}
                onRemove={() => {
                  setSkills((c) => c.filter((s) => s.id !== skill.id));
                  clearFieldError(`skill-${skill.id}`);
                }}
              >
                <Input
                  label="Skill name"
                  value={skill.name}
                  onChange={(e) => {
                    setSkills((c) =>
                      c.map((s) =>
                        s.id === skill.id ? { ...s, name: e.target.value } : s,
                      ),
                    );
                    clearFieldError(`skill-${skill.id}`);
                  }}
                  placeholder="React"
                  error={fieldErrors[`skill-${skill.id}`]}
                />
                <Input
                  label="Level (optional)"
                  value={skill.level ?? ""}
                  onChange={(e) =>
                    setSkills((c) =>
                      c.map((s) =>
                        s.id === skill.id ? { ...s, level: e.target.value } : s,
                      ),
                    )
                  }
                  placeholder="Advanced"
                />
              </RepeaterCard>
            ))}

            <AddButton
              label="Add skill"
              onClick={() =>
                setSkills((c) => [
                  ...c,
                  { id: createId(), name: "", level: "" },
                ])
              }
            />
          </section>
        )}

        {/* ════ EXPERIENCE ════ */}
        {step === "experience" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Experience</h2>
            </div>

            {experience.map((item) => (
              <RepeaterCard
                key={item.id}
                onRemove={() => {
                  setExperience((c) => c.filter((e) => e.id !== item.id));
                  clearFieldError(`exp-company-${item.id}`);
                  clearFieldError(`exp-role-${item.id}`);
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Company"
                    value={item.company}
                    onChange={(e) => {
                      setExperience((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, company: e.target.value }
                            : x,
                        ),
                      );
                      clearFieldError(`exp-company-${item.id}`);
                    }}
                    error={fieldErrors[`exp-company-${item.id}`]}
                  />
                  <Input
                    label="Role"
                    value={item.role}
                    onChange={(e) => {
                      setExperience((c) =>
                        c.map((x) =>
                          x.id === item.id ? { ...x, role: e.target.value } : x,
                        ),
                      );
                      clearFieldError(`exp-role-${item.id}`);
                    }}
                    error={fieldErrors[`exp-role-${item.id}`]}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Start date"
                    value={item.startDate ?? ""}
                    onChange={(e) =>
                      setExperience((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, startDate: e.target.value }
                            : x,
                        ),
                      )
                    }
                    placeholder="01/2023"
                  />
                  <Input
                    label="End date"
                    value={item.endDate ?? ""}
                    onChange={(e) =>
                      setExperience((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, endDate: e.target.value }
                            : x,
                        ),
                      )
                    }
                    placeholder="Present"
                    disabled={item.current}
                  />
                </div>
                <Switch
                  checked={Boolean(item.current)}
                  onChange={(v) =>
                    setExperience((c) =>
                      c.map((x) =>
                        x.id === item.id
                          ? { ...x, current: v, endDate: v ? "" : x.endDate }
                          : x,
                      ),
                    )
                  }
                  label="Currently working here"
                />
                <Textarea
                  label="Description"
                  value={item.description ?? ""}
                  onChange={(e) =>
                    setExperience((c) =>
                      c.map((x) =>
                        x.id === item.id
                          ? { ...x, description: e.target.value }
                          : x,
                      ),
                    )
                  }
                  rows={3}
                />
              </RepeaterCard>
            ))}

            <AddButton
              label="Add experience"
              onClick={() =>
                setExperience((c) => [
                  ...c,
                  {
                    id: createId(),
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                  },
                ])
              }
            />
          </section>
        )}

        {/* ════ PROJECTS ════ */}
        {step === "projects" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Projects</h2>
              <p className="text-small text-muted-foreground mt-1">
                Image upload only here (per project).
              </p>
            </div>

            {projects.map((item) => (
              <RepeaterCard
                key={item.id}
                onRemove={() => {
                  setProjects((c) => c.filter((p) => p.id !== item.id));
                  clearFieldError(`proj-title-${item.id}`);
                  clearFieldError(`proj-url-${item.id}`);
                }}
              >
                <Input
                  label="Title"
                  value={item.title}
                  onChange={(e) => {
                    setProjects((c) =>
                      c.map((p) =>
                        p.id === item.id ? { ...p, title: e.target.value } : p,
                      ),
                    );
                    clearFieldError(`proj-title-${item.id}`);
                  }}
                  error={fieldErrors[`proj-title-${item.id}`]}
                />
                <Textarea
                  label="Description"
                  value={item.description ?? ""}
                  onChange={(e) =>
                    setProjects((c) =>
                      c.map((p) =>
                        p.id === item.id
                          ? { ...p, description: e.target.value }
                          : p,
                      ),
                    )
                  }
                  rows={3}
                />
                <Input
                  label="Live URL"
                  value={item.url ?? ""}
                  onChange={(e) => {
                    setProjects((c) =>
                      c.map((p) =>
                        p.id === item.id ? { ...p, url: e.target.value } : p,
                      ),
                    );
                    clearFieldError(`proj-url-${item.id}`);
                  }}
                  placeholder="https://..."
                  error={fieldErrors[`proj-url-${item.id}`]}
                />
                <Input
                  label="Technologies (comma separated)"
                  value={(item.technologies ?? []).join(", ")}
                  onChange={(e) =>
                    setProjects((c) =>
                      c.map((p) =>
                        p.id === item.id
                          ? {
                              ...p,
                              technologies: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            }
                          : p,
                      ),
                    )
                  }
                  placeholder="Next.js, Tailwind, Supabase"
                />
                <div className="space-y-2">
                  <p className="text-label">Project image</p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-24 w-40 rounded-md object-cover border border-border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      const inputEl = e.target;
                      if (!file) return;
                      console.log("[PortfolioWizard] project image selected:", {
                        projectId: item.id,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      });
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("type", "project-image");
                      fd.append("portfolioId", portfolio.id);
                      try {
                        const res = await uploadFile(fd);
                        console.log(
                          "[PortfolioWizard] project image upload result:",
                          res,
                        );
                        if (res.success && res.data?.url) {
                          setProjects((c) =>
                            c.map((p) =>
                              p.id === item.id
                                ? { ...p, imageUrl: res.data!.url! }
                                : p,
                            ),
                          );
                        } else if (!res.success) {
                          setMessage({
                            type: "error",
                            text: res.message ?? "Image upload failed.",
                          });
                        }
                      } catch (err) {
                        console.error(
                          "[PortfolioWizard] project image upload error:",
                          err,
                        );
                        setMessage({
                          type: "error",
                          text: "Unexpected error uploading image.",
                        });
                      } finally {
                        // Reset input so re-selecting the same file re-triggers onChange
                        inputEl.value = "";
                      }
                    }}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
                  />
                </div>
              </RepeaterCard>
            ))}

            <AddButton
              label="Add project"
              onClick={() =>
                setProjects((c) => [
                  ...c,
                  {
                    id: createId(),
                    title: "",
                    description: "",
                    url: "",
                    technologies: [],
                    imageUrl: "",
                  },
                ])
              }
            />
          </section>
        )}

        {/* ════ EDUCATION ════ */}
        {step === "education" && (
          <section className="space-y-5">
            <h2 className="text-h3">Education</h2>

            {education.map((item) => (
              <RepeaterCard
                key={item.id}
                onRemove={() => {
                  setEducation((c) => c.filter((e) => e.id !== item.id));
                  clearFieldError(`edu-inst-${item.id}`);
                }}
              >
                <Input
                  label="Institution"
                  value={item.institution}
                  onChange={(e) => {
                    setEducation((c) =>
                      c.map((x) =>
                        x.id === item.id
                          ? { ...x, institution: e.target.value }
                          : x,
                      ),
                    );
                    clearFieldError(`edu-inst-${item.id}`);
                  }}
                  error={fieldErrors[`edu-inst-${item.id}`]}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Degree"
                    value={item.degree ?? ""}
                    onChange={(e) =>
                      setEducation((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, degree: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                  <Input
                    label="Field"
                    value={item.field ?? ""}
                    onChange={(e) =>
                      setEducation((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, field: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Start date"
                    value={item.startDate ?? ""}
                    onChange={(e) =>
                      setEducation((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, startDate: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                  <Input
                    label="End date"
                    value={item.endDate ?? ""}
                    onChange={(e) =>
                      setEducation((c) =>
                        c.map((x) =>
                          x.id === item.id
                            ? { ...x, endDate: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                </div>
              </RepeaterCard>
            ))}

            <AddButton
              label="Add education"
              onClick={() =>
                setEducation((c) => [
                  ...c,
                  {
                    id: createId(),
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                  },
                ])
              }
            />
          </section>
        )}

        {/* ════ CERTIFICATES ════ */}
        {step === "certificates" && (
          <section className="space-y-5">
            <h2 className="text-h3">Certificates</h2>

            {certificates.map((item) => (
              <RepeaterCard
                key={item.id}
                onRemove={() => {
                  setCertificates((c) => c.filter((e) => e.id !== item.id));
                  clearFieldError(`cert-name-${item.id}`);
                  clearFieldError(`cert-url-${item.id}`);
                }}
              >
                <Input
                  label="Name"
                  value={item.name}
                  onChange={(e) => {
                    setCertificates((c) =>
                      c.map((x) =>
                        x.id === item.id ? { ...x, name: e.target.value } : x,
                      ),
                    );
                    clearFieldError(`cert-name-${item.id}`);
                  }}
                  error={fieldErrors[`cert-name-${item.id}`]}
                />
                <Input
                  label="Issuer"
                  value={item.issuer ?? ""}
                  onChange={(e) =>
                    setCertificates((c) =>
                      c.map((x) =>
                        x.id === item.id ? { ...x, issuer: e.target.value } : x,
                      ),
                    )
                  }
                />
                <Input
                  label="Issue date"
                  value={item.issueDate ?? ""}
                  onChange={(e) =>
                    setCertificates((c) =>
                      c.map((x) =>
                        x.id === item.id
                          ? { ...x, issueDate: e.target.value }
                          : x,
                      ),
                    )
                  }
                />
                <Input
                  label="Credential URL"
                  value={item.credentialUrl ?? ""}
                  onChange={(e) => {
                    setCertificates((c) =>
                      c.map((x) =>
                        x.id === item.id
                          ? { ...x, credentialUrl: e.target.value }
                          : x,
                      ),
                    );
                    clearFieldError(`cert-url-${item.id}`);
                  }}
                  error={fieldErrors[`cert-url-${item.id}`]}
                />
              </RepeaterCard>
            ))}

            <AddButton
              label="Add certificate"
              onClick={() =>
                setCertificates((c) => [
                  ...c,
                  {
                    id: createId(),
                    name: "",
                    issuer: "",
                    issueDate: "",
                    credentialUrl: "",
                  },
                ])
              }
            />
          </section>
        )}

        {/* ════ RESUME ════ */}
        {step === "resume" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Resume</h2>
              <p className="text-small text-muted-foreground mt-1">
                PDF upload karo (max 5MB). AI data extract karke form auto-fill
                kar degi.
              </p>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-primary underline"
              >
                View current resume
              </a>
            )}

            <div className="space-y-2">
              <p className="text-label">Upload resume (PDF only, max 5MB)</p>
              <input
                type="file"
                accept="application/pdf,.pdf"
                disabled={autoGenerateResume || parsing}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  handleResumeUpload(f, e.target);
                }}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary disabled:opacity-50"
              />
              <p className="text-small text-muted-foreground">
                Format: PDF only · Size: 1 byte – 5 MB · Example:
                Ali_Khan_Resume.pdf
              </p>
            </div>

            <Switch
              checked={autoGenerateResume}
              onChange={setAutoGenerateResume}
              label="Auto-create resume from form data"
              description="Form content se AI/generator resume banayega. Public visitors download kar sakenge."
            />

            <Button
              type="button"
              variant="secondary"
              disabled={isPending || parsing}
              onClick={async () => {
                setMessage(null);
                const gen = await generateAndAttachResume(portfolio.id);
                if (gen.success && gen.data?.resumeUrl) {
                  setResumeUrl(gen.data.resumeUrl);
                  setMessage({ type: "success", text: "Resume PDF ban gaya." });
                } else if (!gen.success) {
                  setMessage({ type: "error", text: gen.message });
                }
              }}
            >
              Generate resume now
            </Button>
          </section>
        )}

        {/* ════ SEO ════ */}
        {step === "seo" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">SEO</h2>
              <p className="text-small text-muted-foreground mt-1">
                Title and metadata only.
              </p>
            </div>

            <Input
              id="seo-title"
              label="SEO title"
              value={seoTitle}
              onChange={(e) => {
                setSeoTitle(e.target.value);
                clearFieldError("seoTitle");
              }}
              placeholder="Max 70 characters"
              error={fieldErrors.seoTitle}
            />
            <Textarea
              id="seo-desc"
              label="Meta description"
              value={seoDescription}
              onChange={(e) => {
                setSeoDescription(e.target.value);
                clearFieldError("seoDescription");
              }}
              rows={3}
              placeholder="Max 160 characters"
              error={fieldErrors.seoDescription}
            />
            <Input
              id="seo-keywords"
              label="Keywords (comma separated)"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="developer, nextjs, portfolio"
            />
            <Switch
              checked={seoNoIndex}
              onChange={setSeoNoIndex}
              label="No index"
              description="Search engines ko index karne se roko"
            />
          </section>
        )}

        {/* ════ REVIEW ════ */}
        {step === "review" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-h3">Review & submit</h2>
              <p className="text-small text-muted-foreground mt-1">
                Check your details. On submit, AI will pick layout & variants
                from your prompt (or random if blank).
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-border bg-surface-2 p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {name || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Headline:</span>{" "}
                {headline || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Skills:</span>{" "}
                {skills.length}
              </p>
              <p>
                <span className="text-muted-foreground">Projects:</span>{" "}
                {projects.length}
              </p>
              <p>
                <span className="text-muted-foreground">Experience:</span>{" "}
                {experience.length}
              </p>
              <p>
                <span className="text-muted-foreground">Prompt:</span>{" "}
                {prompt
                  ? `"${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`
                  : "(blank → AI random)"}
              </p>
              <p>
                <span className="text-muted-foreground">Resume:</span>{" "}
                {autoGenerateResume
                  ? "Auto-generate"
                  : resumeUrl
                    ? "Uploaded"
                    : "None"}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* ── Footer nav ── */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={isPending || (contentStepIndex <= 0 && !showModeFirst)}
        >
          Back
        </Button>

        {!isLastStep ? (
          <Button type="button" variant="gradient" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            variant="gradient"
            loading={isPending}
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : "Create / Save Portfolio"}
          </Button>
        )}
      </div>
    </div>
  );
}
