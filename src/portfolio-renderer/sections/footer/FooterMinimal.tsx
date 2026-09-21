import { OrixaWatermark } from "@/components/billing/orixa-watermark";

export function FooterMinimal({
  name,
  username,
  isPremium = false,
}: {
  name?: string;
  username: string;
  isPremium?: boolean;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
      <p>
        © {year} {name || username}
      </p>
      <div className="mt-2">
        <OrixaWatermark isPremium={isPremium} />
      </div>
    </footer>
  );
}