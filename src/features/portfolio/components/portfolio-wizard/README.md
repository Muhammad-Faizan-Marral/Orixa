# Portfolio Wizard — UI/UX Overhaul

A complete visual redesign of the Portfolio Wizard. All logic, state management, validation, and data flow are preserved exactly. Only the presentation layer changed.

---

## What changed

| Area | Before | After |
|---|---|---|
| Layout | Single scrollable column | Two-column: fixed sidebar + scrollable content |
| Step navigation | External `WizardProgress` component | Self-contained sidebar nav with icon + done states |
| Mobile progress | None | Sticky pill bar with step name + animated fill |
| Form fields | Bare `Input`/`Textarea` imports | `pw-*` styled primitives with focus rings, error states |
| Repeater cards | Flat list with basic border | Numbered cards with distinct header / body split |
| Buttons | System defaults | `pw-btn--primary` (indigo, hover lift) + `pw-btn--ghost` |
| Add button | Plain text button | Full-width dashed border zone |
| Switch toggle | Raw `Switch` import | Self-contained animated toggle with label + description |
| Message banner | Plain div | Icon + color-coded success/error banner |
| Resume step | Three unstyled columns | Three labeled panel cards with step numbers |
| Review step | Plain `<p>` list | Structured table card with key/value + badge counts |
| Import stage | Form inside a container | Centered upload zone with drag-hint styling |
| Empty states | None | Informational callout when a list has no items |
| SEO step | No preview | Live Google-style search snippet preview |
| Footer | Inline nav row | Frosted-glass sticky footer with step counter |

---

## Design tokens

All values live in `portfolio-wizard.css` under `.pw-root`. Override any token to re-theme:

```css
.pw-root {
  --pw-accent: #6366F1;        /* primary action color */
  --pw-bg: #0F1117;            /* page background */
  --pw-surface: #181C25;       /* card / sidebar background */
  --pw-surface-2: #1E2333;     /* card header / input background */
  --pw-radius: 10px;           /* card border radius */
  /* … see portfolio-wizard.css for the full list */
}
```

---

## Integration

### 1. Import the CSS once (root layout or global stylesheet)

```tsx
// app/layout.tsx  or  styles/globals.css
import "@/features/portfolio/components/portfolio-wizard/portfolio-wizard.css";
```

### 2. Drop in `PortfolioWizard` as before

```tsx
import { PortfolioWizard } from "@/features/portfolio/components/portfolio-wizard";

<PortfolioWizard portfolio={portfolio} data={data} isNew={isNew} />
```

No prop changes. The component is a drop-in replacement.

### 3. Remove old dependencies (optional cleanup)

The new wizard no longer imports:
- `WizardProgress` from `../wizard-progress` — replaced by the inline `SidebarNav` + `WizardProgressBar`
- `RepeaterCard` / `AddButton` from `repeater-card` — replaced by `pw-card` / `pw-add-btn`
- `Input`, `Textarea`, `Switch` from `@/components/UI/*` — each step is now self-contained

If other features still use those components, keep them in place.

---

## File map

```
portfolio-wizard/
├── PortfolioWizard.tsx       ← Main component (layout, sidebar, footer, all logic)
├── portfolio-wizard.css      ← Design system (import once at root)
├── index.ts                  ← Barrel export (unchanged)
├── types.ts                  ← Types (unchanged)
├── validation.ts             ← Validation (unchanged)
├── utils.ts                  ← Utilities (unchanged)
└── steps/
    ├── index.ts              ← Barrel export (unchanged)
    ├── BasicsStep.tsx        ← Overhauled
    ├── SkillsStep.tsx        ← Overhauled
    ├── ExperienceStep.tsx    ← Overhauled
    ├── ProjectsStep.tsx      ← Overhauled
    ├── EducationStep.tsx     ← Overhauled
    ├── CertificatesStep.tsx  ← Overhauled
    ├── ResumeStep.tsx        ← Overhauled
    ├── SeoStep.tsx           ← Overhauled
    └── ReviewStep.tsx        ← Overhauled
```
