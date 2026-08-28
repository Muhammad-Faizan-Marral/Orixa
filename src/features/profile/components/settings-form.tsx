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

function ThemeIcon({ variant }: { variant: "system" | "light" | "dark" }) {
  const common = "h-5 w-5";

  if (variant === "light") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
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
      language: initialSettings.language ?? "en",
      timezone: initialSettings.timezone ?? "UTC",
      publicProfile: initialSettings.publicProfile,
      emailNotifications: initialSettings.emailNotifications,
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
      {/* ---------------------------------------------------------------- */}
      {/* Appearance                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface-card p-6">
        <div className="mb-5">
          <p className="text-caption text-accent">Appearance</p>
          <h2 className="text-h3 mt-1">{t.settings.theme}</h2>
          <p className="text-small mt-1">
            Choose how the dashboard looks on this device.
          </p>
        </div>

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
                      "relative flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-all duration-200",
                      active
                        ? "border-primary/40 bg-gradient-ion-soft shadow-glow-primary"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md",
                        active
                          ? "bg-gradient-ion text-white"
                          : "bg-surface-3 text-muted-foreground",
                      )}
                    >
                      <ThemeIcon variant={option.value} />
                    </span>
                    <span>
                      <span className="text-label block">{option.label}</span>
                      <span className="text-small block">
                        {option.description}
                      </span>
                    </span>
                    {active && (
                      <span
                        className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary"
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Language & region                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface-card p-6">
        <div className="mb-5">
          <p className="text-caption text-accent">Language &amp; region</p>
          <h2 className="text-h3 mt-1">{t.settings.title}</h2>
          <p className="text-small mt-1">
            Used for dashboard text and date/time formatting.
          </p>
        </div>

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

      {/* ---------------------------------------------------------------- */}
      {/* Privacy                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface-card p-6">
        <div className="mb-5">
          <p className="text-caption text-accent">Privacy</p>
          <h2 className="text-h3 mt-1">Visibility</h2>
        </div>

        <Controller
          control={control}
          name="publicProfile"
          render={({ field }) => (
            <div className="surface-panel p-4">
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

      {/* ---------------------------------------------------------------- */}
      {/* Notifications                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface-card p-6">
        <div className="mb-5">
          <p className="text-caption text-accent">Notifications</p>
          <h2 className="text-h3 mt-1">Email alerts</h2>
        </div>

        <Controller
          control={control}
          name="emailNotifications"
          render={({ field }) => (
            <div className="surface-panel p-4">
              <Switch
                checked={field.value}
                onChange={field.onChange}
                label="Email notifications"
                description="Get notified at your account email whenever someone contacts you through a portfolio."
              />
            </div>
          )}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Save bar                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="surface-card flex flex-col-reverse items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[1.25rem]">
          {status && (
            <p
              className={cn(
                "text-small animate-fade-in",
                status.type === "success" ? "text-success" : "text-error",
              )}
              role={status.type === "error" ? "alert" : undefined}
            >
              {status.message}
            </p>
          )}
          {!status && (
            <p className="text-small">
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
