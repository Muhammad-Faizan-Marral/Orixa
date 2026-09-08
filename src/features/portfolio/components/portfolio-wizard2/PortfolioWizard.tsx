"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CreationModeSelect } from "../creation-mode-select";
import { WizardProgress } from "../wizard-progress";

import { CONTENT_STEPS } from "../../wizard-steps";
import { parseResumeAction } from "@/actions/portfolio/parse-resume";
import { finalizePortfolioAction } from "@/actions/portfolio/finalize-portfolio";
import { generateAndAttachResume } from "@/actions/portfolio/generate-resume";
import { uploadFile } from "@/actions/profile/upload-file";
import { deleteUpload } from "@/actions/profile/delete-upload";
import { getUploads } from "@/actions/profile/get-uploads";
import { createWorkingPortfolioVersion } from "@/actions/portfolio/create-working-version";

import { Button } from "@/components/UI/Button";

import type {
  PortfolioWizardProps,
  CreationMode,
  Skill,
  Experience,
  Project,
  Education,
  Certificate,
  FieldErrors,
  Message,
  ValidationState,
} from "./types";
import { validateStep } from "./validation";
import { assertValidResumeFile, isPortfolioEmpty } from "./utils";

import {
  BasicsStep,
  SkillsStep,
  ExperienceStep,
  ProjectsStep,
  EducationStep,
  CertificatesStep,
  ResumeStep,
  SeoStep,
  ReviewStep,
} from "./steps";

/** What screen the wizard is currently showing before/around the step content. */
type WizardStage = "select" | "import" | "content";

export function PortfolioWizard({
  portfolio,
  data,
  isNew,
}: PortfolioWizardProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Creation mode / entry stage
  //
  // - Editing an existing / already-started portfolio always goes straight
  //   to the step content.
  // - A brand new, empty portfolio first asks the user how they want to
  //   start: upload a resume (parsed + auto-filled) or fill manually.
  // ---------------------------------------------------------------------------

  const startsEmpty = Boolean(isNew) && isPortfolioEmpty(data);

  const [stage, setStage] = useState<WizardStage>(
    startsEmpty ? "select" : "content",
  );
  const [mode, setMode] = useState<CreationMode | null>(
    startsEmpty ? null : "manual",
  );

  // ---------------------------------------------------------------------------
  // Basic information
  // ---------------------------------------------------------------------------

  const [name, setName] = useState(data?.name ?? portfolio.title ?? "");
  const [prompt, setPrompt] = useState(data?.prompt ?? "");

  const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl ?? "");
  const [phone, setPhone] = useState(data?.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(data?.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(data?.githubUrl ?? "");

  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [about, setAbout] = useState(data?.about ?? "");

  // ---------------------------------------------------------------------------
  // Portfolio sections
  // ---------------------------------------------------------------------------

  const [skills, setSkills] = useState<Skill[]>(data?.skills ?? []);
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

  // ---------------------------------------------------------------------------
  // Resume
  // ---------------------------------------------------------------------------

  // `resumeUrl` is the resume currently attached to the portfolio.
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl ?? "");

  // A device-uploaded resume is kept separately until the user explicitly
  // enables "Attach this resume to portfolio".
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [attachUploadedResume, setAttachUploadedResume] = useState(false);
  const [autoGenerateResume, setAutoGenerateResume] = useState(
    !Boolean(data?.resumeUrl),
  );

  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  // Find an existing portfolio-scoped uploaded resume. Generated PDFs are not
  // stored in `uploads`, so a resume URL with no matching upload is treated as
  // an auto-generated resume.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await getUploads({
          type: "resume",
          portfolioId: portfolio.id,
        });

        if (cancelled || !result.success) return;

        const uploads = result.data;
        const current = data?.resumeUrl
          ? uploads.find((item) => item.url === data.resumeUrl)
          : null;
        const latest = current ?? uploads[0] ?? null;

        if (!latest) return;

        setUploadedResumeId(latest.id);
        setUploadedResumeUrl(latest.url);
        setHasUploadedResume(true);

        if (data?.resumeUrl && latest.url === data.resumeUrl) {
          setAttachUploadedResume(true);
          setAutoGenerateResume(false);
        }
      } catch (error) {
        console.error("load portfolio resumes:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [portfolio.id, data?.resumeUrl]);

  // ---------------------------------------------------------------------------
  // SEO
  // ---------------------------------------------------------------------------

  const [seoTitle, setSeoTitle] = useState(
    (data?.seo?.title as string | undefined) ?? portfolio.title ?? "",
  );
  const [seoDescription, setSeoDescription] = useState(
    (data?.seo?.description as string | undefined) ?? "",
  );
  const [seoKeywords, setSeoKeywords] = useState(
    ((data?.seo?.keywords as string[] | undefined) ?? []).join(", "),
  );
  const [seoNoIndex, setSeoNoIndex] = useState(
    (data?.seo?.noIndex as boolean | undefined) ?? false,
  );

  // ---------------------------------------------------------------------------
  // Wizard step / messaging state
  // ---------------------------------------------------------------------------

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<Message>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepId = CONTENT_STEPS[currentStepIndex].id;
  const isLastStep = currentStepIndex === CONTENT_STEPS.length - 1;

  // ---------------------------------------------------------------------------
  // Prompt lock — once a prompt has been saved, it can't be edited again.
  // ---------------------------------------------------------------------------

  const promptLocked = Boolean(data?.prompt && data.prompt.trim().length > 0);

  // ---------------------------------------------------------------------------
  // Field-error helpers
  // ---------------------------------------------------------------------------

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const buildValidationState = useCallback(
    (): ValidationState => ({
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
    }),
    [
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
    ],
  );

  const validateCurrentStep = useCallback(() => {
    const errors = validateStep(currentStepId, buildValidationState());
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStepId, buildValidationState]);

  // ---------------------------------------------------------------------------
  // Resume import gate (mode = "resume"): parse a PDF and auto-fill the form.
  // ---------------------------------------------------------------------------

  const handleImportResume = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setMessage(null);

      try {
        assertValidResumeFile(file);
        setIsParsingResume(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("portfolioId", portfolio.id);

        const result = await parseResumeAction(formData);

        if (!result.success || !result.data) {
          throw new Error(result.message || "Failed to parse resume.");
        }

        const parsed = result.data;

        setName(parsed.name);
        setHeadline(parsed.headline);
        setAbout(parsed.about);
        setPhone(parsed.phone);
        setLinkedinUrl(parsed.linkedinUrl);
        setGithubUrl(parsed.githubUrl);
        setSkills(parsed.skills);
        setExperience(parsed.experience);
        setProjects(parsed.projects);
        setEducation(parsed.education);
        setCertificates(parsed.certificates);

        setMode("resume");
        setStage("content");
        setCurrentStepIndex(0);
        setMessage({
          type: "success",
          text: "Resume parsed! Review and edit the details below.",
        });
      } catch (err) {
        const text =
          err instanceof Error
            ? err.message
            : "Something went wrong while processing the resume.";
        setMessage({ type: "error", text });
      } finally {
        setIsParsingResume(false);
      }
    },
    [portfolio.id],
  );

  // ---------------------------------------------------------------------------
  // Resume step upload (final "Resume" step): plain attach, no parsing.
  // ---------------------------------------------------------------------------

  const handleResumeStepUpload = useCallback(
    async (file: File | null, inputEl?: HTMLInputElement | null) => {
      if (!file) return;

      setMessage(null);

      try {
        assertValidResumeFile(file);
        setIsUploadingResume(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "resume");
        formData.append("portfolioId", portfolio.id);

        const result = await uploadFile(formData);

        if (!result.success || !result.data?.url) {
          throw new Error(result.message || "Failed to upload resume.");
        }

        // New device upload is only "available" at first. The user must
        // explicitly enable the attach toggle before it becomes the portfolio
        // resume.
        setUploadedResumeId(result.data.id);
        setUploadedResumeUrl(result.data.url);
        setHasUploadedResume(true);
        setAttachUploadedResume(false);
        setAutoGenerateResume(false);
      } catch (err) {
        const text =
          err instanceof Error
            ? err.message
            : "Something went wrong while uploading the resume.";
        setMessage({ type: "error", text });
      } finally {
        setIsUploadingResume(false);
        if (inputEl) inputEl.value = "";
      }
    },
    [portfolio.id],
  );

  const handleRemoveUploadedResume = useCallback(async () => {
    if (!uploadedResumeId) return;

    setMessage(null);

    try {
      const result = await deleteUpload(uploadedResumeId);
      if (!result.success) {
        throw new Error(result.message || "Unable to delete resume.");
      }

      setUploadedResumeId(null);
      setUploadedResumeUrl(null);
      setHasUploadedResume(false);
      setAttachUploadedResume(false);
      setResumeUrl(
        uploadedResumeUrl && resumeUrl === uploadedResumeUrl ? "" : resumeUrl,
      );
      setAutoGenerateResume(true);
      setMessage({ type: "success", text: "Uploaded resume removed." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to delete resume.",
      });
    }
  }, [uploadedResumeId, uploadedResumeUrl, resumeUrl]);

  // ---------------------------------------------------------------------------
  // Step navigation
  // ---------------------------------------------------------------------------

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before continuing.",
      });
      return;
    }

    setMessage(null);
    setCurrentStepIndex((prev) => Math.min(prev + 1, CONTENT_STEPS.length - 1));
  }, [validateCurrentStep]);

  const handleBack = useCallback(() => {
    setMessage(null);
    setFieldErrors({});
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // ---------------------------------------------------------------------------
  // Final submit
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before saving.",
      });
      return;
    }

    setMessage(null);
    setIsSubmitting(true);

    try {
      // Keep the current attached resume unless the user explicitly chooses
      // auto-generate or attaches a newly uploaded resume.
      let finalResumeUrl = (data?.resumeUrl ?? resumeUrl ?? "").trim();

      if (autoGenerateResume) {
        finalResumeUrl = "";
      } else if (attachUploadedResume) {
        finalResumeUrl = (uploadedResumeUrl || resumeUrl || "").trim();
      }

      const keywords = seoKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      // Never send an empty {} over an already-decided design during edits.
      const componentSelection = data?.componentSelection ?? {};
      const designPreferences = data?.designPreferences ?? {};

      const payload = {
        portfolioId: portfolio.id,

        name: name.trim(),
        prompt: (promptLocked ? (data?.prompt ?? prompt) : prompt).trim(),

        avatarUrl: avatarUrl.trim(),
        phone: phone.trim(),
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),

        headline: headline.trim(),
        about: about.trim(),

        skills,
        experience,
        projects,
        education,
        certificates,

        resumeUrl: finalResumeUrl,

        theme: data?.theme ?? "minimal",
        animations: data?.animations ?? true,

        componentSelection,
        designPreferences,

        seo: {
          title: seoTitle.trim(),
          description: seoDescription.trim(),
          keywords,
          noIndex: seoNoIndex,
        },
      };

      const result = await finalizePortfolioAction(payload);

      if (!result.success) {
        throw new Error(result.message ?? "Failed to save portfolio.");
      }

      if (autoGenerateResume) {
        setIsGeneratingResume(true);

        const generateResult = await generateAndAttachResume(
          portfolio.id,
          data?.resumeUrl ?? resumeUrl,
        );

        if (!generateResult.success) {
          throw new Error(
            generateResult.message ??
              "Portfolio saved, but resume generation failed.",
          );
        }

        if (generateResult.data?.resumeUrl) {
          setResumeUrl(generateResult.data.resumeUrl);
          setAttachUploadedResume(false);
          setAutoGenerateResume(false);
          setUploadedResumeId(null);
          setUploadedResumeUrl(null);
          setHasUploadedResume(false);
        }
      }

      const versionResult = await createWorkingPortfolioVersion(portfolio.id);
      if (!versionResult.success) {
        throw new Error(versionResult.message ?? "Portfolio saved, but version creation failed.");
      }

      setMessage({ type: "success", text: "Portfolio saved successfully." });
      
      router.refresh();
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the portfolio.";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
      setIsGeneratingResume(false);
    }
  }, [
    validateCurrentStep,
    autoGenerateResume,
    attachUploadedResume,
    resumeUrl,
    data,
    seoKeywords,
    portfolio.id,
    name,
    promptLocked,
    prompt,
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
    seoTitle,
    seoDescription,
    seoNoIndex,
    router,
  ]);

  // ---------------------------------------------------------------------------
  // Current step content
  // ---------------------------------------------------------------------------

  const currentStepContent = useMemo(() => {
    switch (currentStepId) {
      case "basics":
        return (
          <BasicsStep
            portfolioId={portfolio.id}
            name={name}
            setName={setName}
            headline={headline}
            setHeadline={setHeadline}
            about={about}
            setAbout={setAbout}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            phone={phone}
            setPhone={setPhone}
            linkedinUrl={linkedinUrl}
            setLinkedinUrl={setLinkedinUrl}
            githubUrl={githubUrl}
            setGithubUrl={setGithubUrl}
            prompt={prompt}
            setPrompt={setPrompt}
            promptLocked={promptLocked}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            setMessage={setMessage}
          />
        );

      case "skills":
        return (
          <SkillsStep
            skills={skills}
            setSkills={setSkills}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );

      case "experience":
        return (
          <ExperienceStep
            experience={experience}
            setExperience={setExperience}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );

      case "projects":
        return (
          <ProjectsStep
            portfolioId={portfolio.id}
            projects={projects}
            setProjects={setProjects}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            setMessage={setMessage}
          />
        );

      case "education":
        return (
          <EducationStep
            education={education}
            setEducation={setEducation}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );

      case "certificates":
        return (
          <CertificatesStep
            certificates={certificates}
            setCertificates={setCertificates}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );

      case "resume":
        return (
          <ResumeStep
            mode={mode}
            resumeUrl={resumeUrl}
            uploadedResumeUrl={uploadedResumeUrl}
            hasUploadedResume={hasUploadedResume}
            attachUploadedResume={attachUploadedResume}
            setAttachUploadedResume={setAttachUploadedResume}
            autoGenerateResume={autoGenerateResume}
            setAutoGenerateResume={setAutoGenerateResume}
            parsing={isUploadingResume}
            onResumeFileSelected={handleResumeStepUpload}
            onRemoveUploadedResume={handleRemoveUploadedResume}
          />
        );

      case "seo":
        return (
          <SeoStep
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
            seoNoIndex={seoNoIndex}
            setSeoNoIndex={setSeoNoIndex}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );

      case "review":
        return (
          <ReviewStep
            name={name}
            headline={headline}
            skillsCount={skills.length}
            projectsCount={projects.length}
            experienceCount={experience.length}
            prompt={prompt}
            autoGenerateResume={autoGenerateResume}
            resumeUrl={resumeUrl}
          />
        );

      default:
        return null;
    }
  }, [
    currentStepId,
    portfolio.id,
    name,
    headline,
    about,
    avatarUrl,
    phone,
    linkedinUrl,
    githubUrl,
    prompt,
    promptLocked,
    fieldErrors,
    clearFieldError,
    skills,
    experience,
    projects,
    education,
    certificates,
    mode,
    resumeUrl,
    hasUploadedResume,
    attachUploadedResume,
    autoGenerateResume,
    isUploadingResume,
    handleResumeStepUpload,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoNoIndex,
  ]);

  // ---------------------------------------------------------------------------
  // Render — mode select stage
  // ---------------------------------------------------------------------------

  if (stage === "select") {
    return (
      <div className="w-full p-6 sm:p-10">
        <CreationModeSelect
          onSelect={(selected) => {
            if (selected === "manual") {
              setMode("manual");
              setStage("content");
            } else {
              setStage("import");
            }
            setMessage(null);
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — resume import stage
  // ---------------------------------------------------------------------------

  if (stage === "import") {
    return (
      <div className="mx-auto w-full max-w-xl space-y-6 p-6 sm:p-10">
        <div className="text-center">
          <p className="text-caption text-accent">Upload resume</p>
          <h1 className="text-h1 mt-2">Let&apos;s import your details</h1>
          <p className="text-body mt-2 text-muted-foreground">
            Upload a PDF resume and we&apos;ll extract your details and
            pre-fill the form. You can edit everything afterwards.
          </p>
        </div>

        {message && (
          <div
            className={`rounded-lg border p-4 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={isParsingResume}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              handleImportResume(file);
              e.target.value = "";
            }}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary disabled:opacity-50"
          />
          <p className="text-small text-muted-foreground">
            {isParsingResume
              ? "Parsing your resume…"
              : "PDF only · max 5MB"}
          </p>
        </div>

        <div className="flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStage("select")}
            disabled={isParsingResume}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode("manual");
              setStage("content");
              setMessage(null);
            }}
            disabled={isParsingResume}
          >
            Skip, I&apos;ll fill manually
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — step content
  // ---------------------------------------------------------------------------

  return (
    <div className="w-full p-6 sm:p-10">
      <div className="mb-8">
        <WizardProgress currentStepId={currentStepId} />
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm ${
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="min-h-[400px]">{currentStepContent}</div>

      <div className="mt-10 flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isSubmitting}
        >
          Back
        </Button>

        {!isLastStep ? (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isUploadingResume ||
              isParsingResume ||
              isGeneratingResume
            }
          >
            {isSubmitting
              ? "Saving..."
              : isGeneratingResume
                ? "Generating Resume..."
                : "Save Portfolio"}
          </Button>
        )}
      </div>
    </div>
  );
}
