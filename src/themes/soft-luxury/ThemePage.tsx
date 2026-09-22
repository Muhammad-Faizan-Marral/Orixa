import type { ThemePageProps } from "../types";
export function ThemePage({ config, profile }: ThemePageProps) {
  const Card = ({ children }: { children: React.ReactNode }) => (
    <article className="rounded-2xl border border-stone-300/60 bg-white/50 p-6 shadow-sm">
      {children}
    </article>
  );
  return (
    <main>
      <nav className="mx-auto flex max-w-6xl justify-between px-6 py-8">
        <a href="#hero" className="font-serif text-xl">
          {config.name || profile.username}
        </a>
        <span className="text-sm opacity-60">Portfolio</span>
      </nav>
      <section id="hero" className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="max-w-4xl font-serif text-6xl md:text-8xl">
          {config.headline || config.name || "A considered body of work."}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 opacity-70">
          {config.about}
        </p>
      </section>
      {config.about && (
        <section id="about" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-serif text-3xl">About</h2>
          <p className="mt-5 max-w-2xl leading-8 opacity-70">{config.about}</p>
        </section>
      )}
      {config.skills?.length && (
        <section id="skills" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-serif text-3xl">Expertise</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {config.skills.map((x) => (
              <span
                key={x.id || x.name}
                className="rounded-full border border-stone-300 px-4 py-2"
              >
                {x.name}
              </span>
            ))}
          </div>
        </section>
      )}
      {config.projects?.length && (
        <section
          id="projects"
          className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-2"
        >
          {config.projects.map((x) => (
            <Card key={x.id || x.title}>
              <h2 className="font-serif text-2xl">{x.title}</h2>
              <p className="mt-3 opacity-70">{x.description}</p>
            </Card>
          ))}
        </section>
      )}
      {config.experience?.length && (
        <section id="experience" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-serif text-3xl">Experience</h2>
          {config.experience.map((x) => (
            <p key={x.id || x.company} className="mt-5">
              {x.role} · {x.company}
            </p>
          ))}
        </section>
      )}
      {config.education?.length && (
        <section id="education" className="mx-auto max-w-6xl px-6 py-16">
          {config.education.map((x) => (
            <p key={x.id || x.institution}>
              {x.degree} · {x.institution}
            </p>
          ))}
        </section>
      )}
      {config.certificates?.length && (
        <section id="certificates" className="mx-auto max-w-6xl px-6 py-16">
          {config.certificates.map((x) => (
            <p key={x.id || x.name}>
              {x.name} · {x.issuer}
            </p>
          ))}
        </section>
      )}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-serif text-4xl">Let’s connect.</h2>
      </section>
      <footer className="mx-auto max-w-6xl border-t border-stone-300 px-6 py-10">
        {config.name || profile.username}
        {!profile.isPremium && (
          <span className="float-right">Built with OrixaAi</span>
        )}
      </footer>
    </main>
  );
}
