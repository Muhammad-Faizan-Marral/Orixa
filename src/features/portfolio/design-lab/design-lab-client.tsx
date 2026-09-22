"use client";
import { useState } from "react";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import { getTheme, listThemes } from "@/themes/registry";
import { normalizeSelectionForTheme } from "@/themes/lab-helpers";
import type { ThemeId } from "@/themes/types";
import { LAB_CONFIG_BASE, LAB_PROFILE } from "./dummy-data";
export function DesignLabClient(){const [themeId,setThemeId]=useState<ThemeId>("cinematic");const theme=getTheme(themeId);const config={...LAB_CONFIG_BASE,designPreferences:{...LAB_CONFIG_BASE.designPreferences,themeId,designDna:themeId},componentSelection:normalizeSelectionForTheme(theme,undefined)};return <div className="min-h-screen"><div className="fixed bottom-4 right-4 z-10 flex gap-2 rounded-xl bg-black/80 p-3">{listThemes().map(item=><button key={item.id} onClick={()=>setThemeId(item.id)} className="rounded px-2 py-1 text-xs text-white">{item.name}</button>)}</div><DesignEngine config={config} profile={LAB_PROFILE}/></div>;}
