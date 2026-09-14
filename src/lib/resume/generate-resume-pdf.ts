import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";

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
    location?: string;
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

/* ─── Design tokens ─── */
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN_X = 48;
const MARGIN_TOP = 48;
const MARGIN_BOTTOM = 44;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const ACCENT = rgb(0.32, 0.28, 0.85); // indigo
const INK = rgb(0.12, 0.13, 0.16);
const MUTED = rgb(0.42, 0.44, 0.5);
const SOFT = rgb(0.88, 0.89, 0.92);
const RULE = rgb(0.82, 0.83, 0.87);

function clean(s?: string | null) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function shortUrl(url?: string) {
  const u = clean(url);
  if (!u) return "";
  try {
    const parsed = new URL(u.startsWith("http") ? u : `https://${u}`);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/$/, "");
    if (host.includes("linkedin")) {
      const handle = path.split("/").filter(Boolean).pop();
      return handle ? `linkedin.com/in/${handle}` : host;
    }
    if (host.includes("github")) {
      const handle = path.split("/").filter(Boolean).pop();
      return handle ? `github.com/${handle}` : host;
    }
    return path && path !== "/" ? `${host}${path}` : host;
  } catch {
    return u.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
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
  return lines;
}

/** Split description into short bullet-friendly lines */
function toBullets(description?: string): string[] {
  const raw = clean(description);
  if (!raw) return [];
  // Prefer explicit newlines / bullets
  const byLine = raw
    .split(/\n|•|●|▪|–\s+/)
    .map((s) => s.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine;
  // Fallback: split long paragraphs into ~2 sentences max chunks
  const sentences = raw.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 3) return sentences;
  const chunks: string[] = [];
  let buf = "";
  for (const s of sentences) {
    const next = buf ? `${buf} ${s}` : s;
    if (next.length > 140 && buf) {
      chunks.push(buf);
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

export async function generateResumePdf(
  data: ResumeGenerateInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN_TOP;

  const drawAccentBar = (p: PDFPage) => {
    p.drawRectangle({
      x: 0,
      y: 0,
      width: 6,
      height: PAGE_H,
      color: ACCENT,
    });
  };
  drawAccentBar(page);

  const ensureSpace = (need: number) => {
    if (y - need < MARGIN_BOTTOM) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      drawAccentBar(page);
      y = PAGE_H - MARGIN_TOP;
    }
  };

  const textWidth = (t: string, size: number, bold = false) =>
    (bold ? fontBold : font).widthOfTextAtSize(t, size);

  const drawText = (
    text: string,
    x: number,
    size: number,
    opts: { bold?: boolean; color?: typeof INK; maxW?: number } = {},
  ) => {
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? INK;
    const maxW = opts.maxW ?? CONTENT_W;
    const lines = wrapText(text, f, size, maxW);
    for (const line of lines) {
      ensureSpace(size + 3);
      page.drawText(line, { x, y, size, font: f, color });
      y -= size + 3;
    }
    return lines.length;
  };

  /* ═══════════ HEADER ═══════════ */
  const name = clean(data.name) || "Portfolio";
  ensureSpace(36);
  page.drawText(name, {
    x: MARGIN_X,
    y,
    size: 22,
    font: fontBold,
    color: INK,
  });
  y -= 26;

  if (data.headline) {
    const headline = clean(data.headline);
    page.drawText(headline, {
      x: MARGIN_X,
      y,
      size: 11,
      font,
      color: ACCENT,
    });
    y -= 16;
  }

  // Contact row
  const contacts: string[] = [];
  if (data.phone) contacts.push(clean(data.phone));
  if (data.linkedinUrl) contacts.push(shortUrl(data.linkedinUrl));
  if (data.githubUrl) contacts.push(shortUrl(data.githubUrl));

  if (contacts.length) {
    const contactStr = contacts.join("   ·   ");
    const lines = wrapText(contactStr, font, 9, CONTENT_W);
    for (const line of lines) {
      ensureSpace(12);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 9,
        font,
        color: MUTED,
      });
      y -= 12;
    }
  }

  // Accent rule under header
  y -= 6;
  ensureSpace(8);
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: MARGIN_X + CONTENT_W, y },
    thickness: 1.25,
    color: ACCENT,
  });
  y -= 16;

  /* ═══════════ SECTION HELPER ═══════════ */
  const sectionTitle = (title: string) => {
    y -= 4;
    ensureSpace(22);
    page.drawText(title.toUpperCase(), {
      x: MARGIN_X,
      y,
      size: 10,
      font: fontBold,
      color: ACCENT,
    });
    y -= 4;
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: MARGIN_X + CONTENT_W, y },
      thickness: 0.6,
      color: RULE,
    });
    y -= 12;
  };

  /* ═══════════ ABOUT ═══════════ */
  if (clean(data.about)) {
    sectionTitle("Summary");
    drawText(clean(data.about), MARGIN_X, 9.5, { color: INK });
    y -= 6;
  }

  /* ═══════════ SKILLS ═══════════ */
  if (data.skills?.length) {
    sectionTitle("Skills");
    const skillNames = data.skills.map((s) => clean(s.name)).filter(Boolean);
    if (skillNames.length) {
      // Flow as "Skill  ·  Skill  ·  Skill" with soft wrapping
      const skillLine = skillNames.join("   ·   ");
      drawText(skillLine, MARGIN_X, 9.5, { color: INK });
      y -= 6;
    }
  }

  /* ═══════════ EXPERIENCE ═══════════ */
  if (data.experience?.length) {
    sectionTitle("Experience");
    for (const e of data.experience) {
      const role = clean(e.role);
      const company = clean(e.company);
      const loc = clean(e.location);
      const dates = [e.startDate, e.current ? "Present" : e.endDate]
        .map(clean)
        .filter(Boolean)
        .join(" – ");

      ensureSpace(36);

      // Role (left) + dates (right)
      const roleSize = 10.5;
      page.drawText(role || "Role", {
        x: MARGIN_X,
        y,
        size: roleSize,
        font: fontBold,
        color: INK,
      });
      if (dates) {
        const dw = textWidth(dates, 9);
        page.drawText(dates, {
          x: MARGIN_X + CONTENT_W - dw,
          y,
          size: 9,
          font,
          color: MUTED,
        });
      }
      y -= 14;

      // Company · location
      const companyLine = [company, loc].filter(Boolean).join("  ·  ");
      if (companyLine) {
        page.drawText(companyLine, {
          x: MARGIN_X,
          y,
          size: 9.5,
          font,
          color: MUTED,
        });
        y -= 13;
      }

      // Bullets
      const bullets = toBullets(e.description);
      for (const b of bullets) {
        ensureSpace(14);
        page.drawText("•", {
          x: MARGIN_X + 2,
          y,
          size: 9,
          font,
          color: ACCENT,
        });
        const bulletLines = wrapText(b, font, 9, CONTENT_W - 14);
        for (let i = 0; i < bulletLines.length; i++) {
          if (i > 0) ensureSpace(12);
          page.drawText(bulletLines[i], {
            x: MARGIN_X + 12,
            y,
            size: 9,
            font,
            color: INK,
          });
          y -= 12;
        }
      }
      y -= 8;
    }
  }

  /* ═══════════ PROJECTS ═══════════ */
  if (data.projects?.length) {
    sectionTitle("Projects");
    for (const p of data.projects) {
      const title = clean(p.title);
      ensureSpace(28);

      page.drawText(title || "Project", {
        x: MARGIN_X,
        y,
        size: 10.5,
        font: fontBold,
        color: INK,
      });
      y -= 13;

      if (p.url) {
        const link = shortUrl(p.url);
        page.drawText(link, {
          x: MARGIN_X,
          y,
          size: 8.5,
          font,
          color: ACCENT,
        });
        y -= 12;
      }

      const bullets = toBullets(p.description);
      for (const b of bullets) {
        ensureSpace(14);
        page.drawText("•", {
          x: MARGIN_X + 2,
          y,
          size: 9,
          font,
          color: ACCENT,
        });
        const bulletLines = wrapText(b, font, 9, CONTENT_W - 14);
        for (let i = 0; i < bulletLines.length; i++) {
          if (i > 0) ensureSpace(12);
          page.drawText(bulletLines[i], {
            x: MARGIN_X + 12,
            y,
            size: 9,
            font,
            color: INK,
          });
          y -= 12;
        }
      }

      if (p.technologies?.length) {
        const tech = p.technologies.map(clean).filter(Boolean).join("  ·  ");
        if (tech) {
          ensureSpace(12);
          page.drawText(tech, {
            x: MARGIN_X,
            y,
            size: 8.5,
            font,
            color: MUTED,
          });
          y -= 12;
        }
      }
      y -= 6;
    }
  }

  /* ═══════════ EDUCATION ═══════════ */
  if (data.education?.length) {
    sectionTitle("Education");
    for (const ed of data.education) {
      const degreeLine = [clean(ed.degree), clean(ed.field)]
        .filter(Boolean)
        .join(" in ");
      const institution = clean(ed.institution);
      const dates = [ed.startDate, ed.endDate]
        .map(clean)
        .filter(Boolean)
        .join(" – ");

      ensureSpace(28);

      const left = degreeLine || institution || "Education";
      page.drawText(left, {
        x: MARGIN_X,
        y,
        size: 10.5,
        font: fontBold,
        color: INK,
      });
      if (dates) {
        const dw = textWidth(dates, 9);
        page.drawText(dates, {
          x: MARGIN_X + CONTENT_W - dw,
          y,
          size: 9,
          font,
          color: MUTED,
        });
      }
      y -= 13;

      if (degreeLine && institution) {
        page.drawText(institution, {
          x: MARGIN_X,
          y,
          size: 9.5,
          font,
          color: MUTED,
        });
        y -= 13;
      }
      y -= 4;
    }
  }

  /* ═══════════ CERTIFICATES ═══════════ */
  if (data.certificates?.length) {
    sectionTitle("Certificates");
    for (const c of data.certificates) {
      const title = clean(c.name);
      const meta = [clean(c.issuer), clean(c.issueDate)]
        .filter(Boolean)
        .join("  ·  ");

      ensureSpace(22);
      page.drawText(title || "Certificate", {
        x: MARGIN_X,
        y,
        size: 10,
        font: fontBold,
        color: INK,
      });
      y -= 12;
      if (meta) {
        page.drawText(meta, {
          x: MARGIN_X,
          y,
          size: 9,
          font,
          color: MUTED,
        });
        y -= 12;
      }
      y -= 4;
    }
  }

  /* ═══════════ FOOTER (page numbers if multi-page) ═══════════ */
  const pages = doc.getPages();
  if (pages.length > 1) {
    pages.forEach((p, i) => {
      const label = `${i + 1} / ${pages.length}`;
      const w = font.widthOfTextAtSize(label, 8);
      p.drawText(label, {
        x: PAGE_W - MARGIN_X - w,
        y: 22,
        size: 8,
        font,
        color: MUTED,
      });
    });
  }

  return doc.save();
}
