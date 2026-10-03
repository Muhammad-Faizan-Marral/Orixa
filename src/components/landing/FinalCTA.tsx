import Link from "next/link";
import Logo from "./Logo";

export default function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-40">
      <div className="bg-aurora absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-strong opacity-70 shadow-[0_0_0_4rem_color-mix(in_srgb,var(--primary)_6%,transparent),0_0_0_8rem_color-mix(in_srgb,var(--primary)_4%,transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="animate-float mx-auto mb-8 w-fit overflow-hidden rounded-2xl shadow-glow-primary"><Logo variant="badge" height={72} /></div>
        <h2 className="text-display-2 text-balance">Ready to show your work <span className="text-gradient-ion">the way it deserves?</span></h2>
        <p className="text-body-lg mt-5">Create your first portfolio free. No credit card required.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/auth/signup" className="btn btn-ion w-full sm:w-auto sm:min-w-[12rem]">Build free portfolio</Link>
          <Link href="#pricing" className="btn btn-ghost w-full sm:w-auto sm:min-w-[12rem]">View pricing</Link>
        </div>
      </div>
    </section>
  );
}
