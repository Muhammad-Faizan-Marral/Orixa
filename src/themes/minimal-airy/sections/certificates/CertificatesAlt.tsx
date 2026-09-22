import type { ThemeSectionProps } from "../../../types";
export function CertificatesAlt({ config }: ThemeSectionProps) {
  if (!config.certificates?.length) return null;
  return (
    <section id="certificates" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-xs uppercase tracking-[.25em] text-blue-600">
        Credentials
      </h2>
      {config.certificates.map((item) => (
        <p
          key={item.id || item.name}
          className="mt-5 border-b border-slate-200 pb-4"
        >
          {item.name} <span className="opacity-50">· {item.issuer}</span>
        </p>
      ))}
    </section>
  );
}
