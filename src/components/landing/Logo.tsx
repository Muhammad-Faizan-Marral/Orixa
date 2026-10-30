/* Brand files live in /public. Change the names here if you rename them. */
export const LOGOS = {
  darkwordmark: "/darktextlogonobg.png", // logo + text, transparent background for light backgrounds
  wordmark: "/LogowithTextbutWithoutBG.png", // logo + text, transparent background for dark backgrounds
  mark: "/justLogoWihoutText.png", // symbol only
  markCutout: "/justLogo-removebg-preview.png", // symbol only, background removed
  badge: "/logowithBGandText.png", // logo + text on its own background
} as const;

interface Props {
  /**
   * "auto" renders the right wordmark for the current theme:
   * darkwordmark on light backgrounds, wordmark on dark backgrounds.
   */
  variant: keyof typeof LOGOS | "auto";
  height?: number;
  className?: string;
  /** Decorative uses (next to visible text) pass alt="" */
  alt?: string;
  /** Above-the-fold logo: load eagerly. Everything else is lazy-loaded. */
  priority?: boolean;
}

/** Plain <img>: brand files have unknown dimensions, so we size by height and keep the aspect ratio. */
export default function Logo({
  variant,
  height = 32,
  className = "",
  alt = "OrixaAI",
  priority = false,
}: Props) {
  const common = {
    height,
    style: { height, width: "auto" } as const,
    draggable: false,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
  };

  if (variant === "auto") {
    return (
      <>
        {/* Light theme: dark text logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGOS.darkwordmark}
          alt={alt}
          {...common}
          className={`select-none dark:hidden ${className}`}
        />
        {/* Dark theme: light text logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGOS.wordmark}
          alt={alt}
          {...common}
          className={`hidden select-none dark:block ${className}`}
        />
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGOS[variant]}
      alt={alt}
      {...common}
      className={`select-none ${className}`}
    />
  );
}
