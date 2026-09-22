import type { ThemeSectionProps } from "../../../types";
export function CertificatesDefault({ config }: ThemeSectionProps) {
  if (!config.certificates?.length) return null;
  return (
    <section id="certificates" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Certificates</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {config.certificates.map((item) => (
          <article
            key={item.id || item.name}
            className="border border-slate-200 p-5"
          >
            <h3 className="font-medium">{item.name}</h3>
            <p className="mt-2 text-sm opacity-60">{item.issuer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
