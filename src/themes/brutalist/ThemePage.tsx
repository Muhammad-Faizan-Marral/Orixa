/* eslint-disable react-hooks/static-components */
import type { ThemePageProps } from "../types";
export function ThemePage({ config, profile }: ThemePageProps) {
  const Item = ({
    id,
    title,
    children,
    show = true,
  }: {
    id: string;
    title: string;
    children?: React.ReactNode;
    show?: boolean;
  }) =>
    show ? (
      <section id={id} className="border-b-4 border-black px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="inline-block bg-red-500 px-2 text-sm font-bold uppercase">
            {title}
          </h2>
          <div className="mt-6">{children}</div>
        </div>
      </section>
    ) : null;
  return (
    <main className="font-mono">
      <nav className="flex justify-between border-b-4 border-black px-6 py-5 font-bold">
        <a href="#hero">{config.name || profile.username}</a>
        <span>WORK / ABOUT / CONTACT</span>
      </nav>
      <Item id="hero" title="Start">
        <h1 className="max-w-5xl text-6xl font-black uppercase leading-none md:text-9xl">
          {config.headline || config.name || "Make it matter."}
        </h1>
        <p className="mt-8 max-w-2xl text-lg">{config.about}</p>
      </Item>
      <Item id="about" title="About" show={!!config.about}>
        <p className="max-w-3xl text-2xl font-bold">{config.about}</p>
      </Item>
      <Item id="skills" title="Skills" show={!!config.skills?.length}>
        <div className="flex flex-wrap gap-2">
          {config.skills?.map((x) => (
            <span
              key={x.id || x.name}
              className="border-2 border-black px-3 py-2 font-bold"
            >
              {x.name}
            </span>
          ))}
        </div>
      </Item>
      <Item id="projects" title="Projects" show={!!config.projects?.length}>
        {config.projects?.map((x) => (
          <article key={x.id || x.title} className="border-2 border-black p-4">
            <h3 className="text-2xl font-bold">{x.title}</h3>
            <p>{x.description}</p>
          </article>
        ))}
      </Item>
      <Item
        id="experience"
        title="Experience"
        show={!!config.experience?.length}
      >
        {config.experience?.map((x) => (
          <p key={x.id || x.company} className="text-xl font-bold">
            {x.role} / {x.company}
          </p>
        ))}
      </Item>
      <Item id="education" title="Education" show={!!config.education?.length}>
        {config.education?.map((x) => (
          <p key={x.id || x.institution}>
            {x.degree} / {x.institution}
          </p>
        ))}
      </Item>
      <Item
        id="certificates"
        title="Certificates"
        show={!!config.certificates?.length}
      >
        {config.certificates?.map((x) => (
          <p key={x.id || x.name}>{x.name}</p>
        ))}
      </Item>
      <Item id="contact" title="Contact">
        <div className="flex gap-5 font-bold underline">
          {config.githubUrl && <a href={config.githubUrl}>GitHub</a>}
          {config.linkedinUrl && <a href={config.linkedinUrl}>LinkedIn</a>}
        </div>
      </Item>
      <footer className="flex justify-between px-6 py-10 font-bold">
        {config.name || profile.username}
        {!profile.isPremium && <span>Built with OrixaAi</span>}
      </footer>
    </main>
  );
}
