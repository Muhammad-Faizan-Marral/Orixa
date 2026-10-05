/* Brand files live in /public. Change the names here if you rename them. */
export const LOGOS = {
  wordmark: "/LogowithTextbutWithoutBG.png", // logo + text, transparent background
  mark: "/justLogoWihoutText.png", // symbol only
  markCutout: "/justLogo-removebg-preview.png", // symbol only, background removed
  badge: "/logowithBGandText.png", // logo + text on its own background
} as const;

interface Props {
  variant: keyof typeof LOGOS;
  height?: number;
  className?: string;
  /** Decorative uses (next to visible text) pass alt="" */
  alt?: string;
}

/** Plain <img>: brand files have unknown dimensions, so we size by height and keep the aspect ratio. */
export default function Logo({
  variant,
  height = 32,
  className = "",
  alt = "OrixaAI",
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGOS[variant]}
      alt={alt}
      height={height}
      style={{ height, width: "auto" }}
      className={`select-none ${className} `}
      draggable={false}
    />
  );
}
