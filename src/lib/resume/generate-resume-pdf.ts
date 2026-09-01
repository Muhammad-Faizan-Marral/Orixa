import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ResumeGenerateInput = {
  name: string;
  headline?: string;
  about?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: { name: string; level?: string }[];
  experience?: {
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  projects?: {
    title: string;
    description?: string;
    url?: string;
    technologies?: string[];
  }[];
  education?: {
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }[];
  certificates?: {
    name: string;
    issuer?: string;
    issueDate?: string;
  }[];
};

function clean(s?: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

export async function generateResumePdf(
  data: ResumeGenerateInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595, 842]); // A4
  const margin = 50;
  let y = 792;
  const width = 595 - margin * 2;
  const black = rgb(0.1, 0.1, 0.12);
  const muted = rgb(0.35, 0.35, 0.4);

  const ensureSpace = (need: number) => {
    if (y - need < 50) {
      page = doc.addPage([595, 842]);
      y = 792;
    }
  };

  const write = (
    text: string,
    opts: { bold?: boolean; size?: number; color?: typeof black } = {},
  ) => {
    const size = opts.size ?? 11;
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? black;
    const lines = wrapText(text, f, size, width);
    for (const line of lines) {
      ensureSpace(size + 4);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= size + 4;
    }
  };

  const section = (title: string) => {
    y -= 8;
    ensureSpace(24);
    write(title.toUpperCase(), { bold: true, size: 12 });
    page.drawLine({
      start: { x: margin, y: y + 2 },
      end: { x: margin + width, y: y + 2 },
      thickness: 0.8,
      color: rgb(0.75, 0.75, 0.8),
    });
    y -= 10;
  };

  // Header
  write(clean(data.name) || "Portfolio", { bold: true, size: 20 });
  if (data.headline) write(clean(data.headline), { size: 12, color: muted });

  const contacts = [data.phone, data.linkedinUrl, data.githubUrl]
    .map(clean)
    .filter(Boolean)
    .join("  ·  ");
  if (contacts) write(contacts, { size: 9, color: muted });
  y -= 6;

  if (clean(data.about)) {
    section("About");
    write(clean(data.about), { size: 10 });
  }

  if (data.skills?.length) {
    section("Skills");
    write(
      data.skills
        .map((s) => clean(s.name))
        .filter(Boolean)
        .join(" · "),
      { size: 10 },
    );
  }

  if (data.experience?.length) {
    section("Experience");
    for (const e of data.experience) {
      const dates = [e.startDate, e.current ? "Present" : e.endDate]
        .map(clean)
        .filter(Boolean)
        .join(" – ");
      write(`${clean(e.role)} · ${clean(e.company)}`, { bold: true, size: 11 });
      if (dates) write(dates, { size: 9, color: muted });
      if (e.description) write(clean(e.description), { size: 10 });
      y -= 4;
    }
  }

  if (data.projects?.length) {
    section("Projects");
    for (const p of data.projects) {
      write(clean(p.title), { bold: true, size: 11 });
      if (p.description) write(clean(p.description), { size: 10 });
      if (p.technologies?.length) {
        write(p.technologies.map(clean).filter(Boolean).join(", "), {
          size: 9,
          color: muted,
        });
      }
      if (p.url) write(clean(p.url), { size: 9, color: muted });
      y -= 4;
    }
  }

  if (data.education?.length) {
    section("Education");
    for (const ed of data.education) {
      write(
        [ed.degree, ed.field, ed.institution]
          .map(clean)
          .filter(Boolean)
          .join(" · "),
        { bold: true, size: 11 },
      );
      const dates = [ed.startDate, ed.endDate]
        .map(clean)
        .filter(Boolean)
        .join(" – ");
      if (dates) write(dates, { size: 9, color: muted });
      y -= 4;
    }
  }

  if (data.certificates?.length) {
    section("Certificates");
    for (const c of data.certificates) {
      write(
        [c.name, c.issuer, c.issueDate].map(clean).filter(Boolean).join(" · "),
        { size: 10 },
      );
    }
  }

  return doc.save();
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}
