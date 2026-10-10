import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const link = "transition hover:text-foreground";
  return (
    <footer className="relative overflow-hidden border-t border-border pt-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" aria-label="OrixaAI home"><Logo variant="wordmark" height={30} /></Link>
            <p className="text-small mt-2">Portfolio that represents your work</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#how" className={link}>How it works</Link>
            <Link href="#features" className={link}>Features</Link>
            <Link href="#pricing" className={link}>Pricing</Link>
            <Link href="/blog" className={link}>Blog</Link>
            <Link href="#samplework" className={link}>SampleWork</Link>
            <Link href="/auth/login" className={link}>Log in</Link>
            <Link href="/terms" className={link}>Terms</Link>
            <Link href="/privacy" className={link}>Privacy</Link>
          </nav>
        </div>
        <p className="text-small mt-10 text-center">© {new Date().getFullYear()} OrixaAI. All rights reserved.</p>
      </div>
      <div className="pointer-events-none -mb-[0.28em] select-none text-center font-display text-[22vw] font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--border-strong)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true">
        OrixaAI
      </div>
    </footer>
  );
}
