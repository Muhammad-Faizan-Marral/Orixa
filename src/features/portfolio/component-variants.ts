export const SECTION_KEYS = ["navbar","hero","about","skills","projects","experience","education","certificates","contact","footer"] as const;
export type SectionKey = typeof SECTION_KEYS[number];
export type SectionSelection = { enabled: boolean; variant: string };
export type ComponentSelection = Record<SectionKey, SectionSelection>;
export const DEFAULT_COMPONENT_SELECTION: ComponentSelection = Object.fromEntries(SECTION_KEYS.map(section=>[section,{enabled:true,variant:"default"}])) as ComponentSelection;
export const DEFAULT_DESIGN_PREFERENCES = { themeMode:"light" as "light"|"dark", layout:"standard" as "standard"|"wide"|"centered", accentColor:"#2563eb", fontFamily:"Inter", borderRadius:"medium" as "none"|"small"|"medium"|"large", cardStyle:"bordered" as "flat"|"bordered"|"elevated", themeId:"minimal-airy" as const, designDna:"minimal-airy" as const };
