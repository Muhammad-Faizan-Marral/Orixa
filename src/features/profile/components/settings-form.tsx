"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/components/theme-provider";
import type { ThemeMode } from "@/lib/theme";
import { updateSettings } from "@/actions/profile/update-settings";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
} from "@/validations/settings.schema";

import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "../../../constants/locale";
import { useLocale } from "@/components/locale-provider";
import { isLocale, type Locale } from "@/i18n/config";
import { Select } from "@/components/UI/Select";
import { Switch } from "@/components/UI/Switch";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";

type Settings = {
  language: string;
  timezone: string | null;
  publicProfile: boolean;
  emailNotifications: boolean;
  themeMode: string | null;
};

type Props = {
  initialSettings: Settings;
};

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const SECTION = "rounded-2xl border border-border bg-background p-6 sm:p-8";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 space-y-1.5">
      <h2
        className={`${DISPLAY} text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground`}
      >
        {title}
      </h2>
      {description && (
        <p className="text-small max-w-[56ch] text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function ThemeIcon({ variant }: { variant: "system" | "light" | "dark" }) {
  const common = "size-5";

  if (variant === "light") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "dark") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path
          d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5a8.5 8.5 0 1 0 11.2 11.2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="12" rx="1.6" />
      <path d="M8.5 20.5h7M12 16.5v4" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsForm({ initialSettings }: Props) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { setTheme } = useTheme();
  const { setLocale, t } = useLocale();

  const THEME_OPTIONS: {
    value: "system" | "light" | "dark";
    label: string;
    description: string;
  }[] = [
    {
      value: "system",
      label: t.settings.themeOptions?.system || "System",
      description: "Match your device",
    },
    {
      value: "light",
      label: t.settings.themeOptions?.light || "Light",
      description: "Bright canvas",
    },
    {
      value: "dark",
      label: t.settings.themeOptions?.dark || "Dark",
      description: "Ink & Ion (default)",
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      language: (initialSettings.language as "en" | "es") ?? "en",
      timezone: initialSettings.timezone ?? "UTC",
      publicProfile: Boolean(initialSettings.publicProfile),
      emailNotifications: Boolean(initialSettings.emailNotifications),
      themeMode:
        (initialSettings.themeMode as "light" | "dark" | "system") ?? "system",
    },
  });

  const onSubmit = async (data: UpdateSettingsInput) => {
    setStatus(null);

    const result = await updateSettings(data);

    if (!result.success) {
      setStatus({ type: "error", message: result.message });
      return;
    }

    // Instant locale sync on successful save
    if (isLocale(data.language)) {
      setLocale(data.language as Locale);
    }

    setStatus({ type: "success", message: "Settings saved." });
    if (data.themeMode) {
      setTheme(data.themeMode);
    }
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Appearance */}
      <section className={SECTION}>
        <SectionHeader
          title={t.settings.theme}
          description="Choose how the dashboard looks on this device."
        />

        <Controller
          control={control}
          name="themeMode"
          render={({ field }) => (
            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Theme"
            >
              {THEME_OPTIONS.map((option) => {
                const active = (field.value ?? "system") === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      field.onChange(option.value);
                      setTheme(option.value); // instant preview
                    }}
                    className={cn(
                      "relative flex flex-col items-start gap-4 rounded-xl border p-4 text-left transition-colors duration-200",
                      FOCUS,
                      active
                        ? "border-violet-500/60 bg-violet-500/[0.07]"
                        : "border-border bg-background hover:border-foreground/25 hover:bg-foreground/[0.025]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-violet-600 text-white"
                          : "bg-foreground/[0.06] text-foreground/70",
                      )}
                    >
                      <ThemeIcon variant={option.value} />
                    </span>

                    <span>
                      <span className="block text-[15px] font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className="text-small mt-0.5 block text-muted-foreground">
                        {option.description}
                      </span>
                    </span>

                    {active && (
                      <span
                        className="absolute right-3.5 top-3.5 flex size-5 items-center justify-center rounded-full bg-violet-600 text-white"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m4 10.5 4 4 8-9" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        />
      </section>

      {/* Language & region */}
      <section className={SECTION}>
        <SectionHeader
          title={t.settings.title}
          description="Used for dashboard text and date/time formatting."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <Select
                label="Language"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  // Dynamic instant language switch on dropdown change
                  if (isLocale(value)) {
                    setLocale(value as Locale);
                  }
                }}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />

          <Select
            label="Timezone"
            hint="Applied across dashboards and dates."
            {...register("timezone")}
          >
            {TIMEZONE_OPTIONS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone.replace(/_/g, " ")}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </div>
      </section>

      {/* Privacy */}
      <section className={SECTION}>
        <SectionHeader title="Visibility" />

        <Controller
          control={control}
          name="publicProfile"
          render={({ field }) => (
            <div className="rounded-xl border border-border bg-foreground/[0.025] p-4">
              <Switch
                checked={field.value}
                onChange={field.onChange}
                label="Public profile"
                description="Let anyone with your link view your profile and published portfolios. Turn this off to hide them from visitors without deleting anything."
              />
            </div>
          )}
        />
      </section>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex flex-col-reverse items-start gap-3 rounded-2xl border border-border bg-background/90 p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-h-[1.25rem]" aria-live="polite">
          {status ? (
            <p
              className={cn(
                "text-small flex items-center gap-2",
                status.type === "success"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400",
              )}
              role={status.type === "error" ? "alert" : undefined}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  status.type === "success" ? "bg-emerald-500" : "bg-red-500",
                )}
              />
              {status.message}
            </p>
          ) : isDirty ? (
            <p className="text-small flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-amber-500"
              />
              You have unsaved changes
            </p>
          ) : (
            <p className="text-small text-muted-foreground">
              Changes apply immediately after saving.
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!isDirty && !isSubmitting}
        >
          {isSubmitting ? t.common.saving : t.settings.saveSettings}
        </Button>
      </div>
    </form>
  );
}