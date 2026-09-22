"use client";

import { FormTheme } from "@/lib/types";
import { Palette, Type, Image as ImageIcon, ShieldAlert, Sliders } from "lucide-react";

interface ThemeEditorProps {
  theme: FormTheme;
  onChange: (updatedTheme: FormTheme) => void;
}

const GOOGLE_FONTS = ["Inter", "Roboto", "Outfit", "Playfair Display", "Fira Code"];

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  const update = (key: keyof FormTheme, value: any) => {
    onChange({ ...theme, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <Palette className="h-5 w-5 text-emerald-600" />
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Form Styling & Theme Customizer</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Typography */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Font Family</label>
          <select
            value={theme.fontFamily || "Inter"}
            onChange={(e) => update("fontFamily", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {GOOGLE_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Color */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primaryColor || "#059669"}
              onChange={(e) => update("primaryColor", e.target.value)}
              className="h-9 w-12 rounded-lg border border-slate-300 p-0.5 cursor-pointer dark:border-slate-700"
            />
            <input
              type="text"
              value={theme.primaryColor || "#059669"}
              onChange={(e) => update("primaryColor", e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Page Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.backgroundColor || "#ffffff"}
              onChange={(e) => update("backgroundColor", e.target.value)}
              className="h-9 w-12 rounded-lg border border-slate-300 p-0.5 cursor-pointer dark:border-slate-700"
            />
            <input
              type="text"
              value={theme.backgroundColor || "#ffffff"}
              onChange={(e) => update("backgroundColor", e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Card Corner Rounding</label>
          <select
            value={theme.borderRadius || "12px"}
            onChange={(e) => update("borderRadius", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="0px">Square (0px)</option>
            <option value="8px">Subtle (8px)</option>
            <option value="12px">Rounded (12px)</option>
            <option value="20px">Extra Soft (20px)</option>
          </select>
        </div>
      </div>

      {/* Watermark Controls */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" /> Watermark & Branding Controls
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Watermark Text</label>
            <input
              type="text"
              value={theme.watermark?.text || ""}
              placeholder="e.g. OFFICIAL VERIFIED FORM"
              onChange={(e) =>
                update("watermark", {
                  ...theme.watermark,
                  text: e.target.value,
                  opacity: theme.watermark?.opacity || 0.05,
                  rotation: theme.watermark?.rotation || -15,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Watermark Opacity ({Math.round((theme.watermark?.opacity || 0.05) * 100)}%)</label>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={theme.watermark?.opacity || 0.05}
              onChange={(e) =>
                update("watermark", {
                  ...theme.watermark,
                  opacity: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
