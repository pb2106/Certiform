"use client";

import { FormTheme } from "@/lib/types";
import { Palette, Type, Image as ImageIcon, ShieldAlert, Video, Sparkles, MousePointer, Sliders } from "lucide-react";

interface ThemeEditorProps {
  theme: FormTheme;
  onChange: (updatedTheme: FormTheme) => void;
}

const GOOGLE_FONTS = ["Inter", "Roboto", "Outfit", "Playfair Display", "Fira Code"];

const LIVE_ANIMATED_PRESETS = [
  { id: "none", label: "None (Static Color)" },
  { id: "gradient-flow", label: "Dynamic Gradient Flow" },
  { id: "glowing-particles", label: "Floating Glowing Particles" },
  { id: "mesh-wave", label: "3D Mesh Wave" },
  { id: "cyber-grid", label: "Futuristic Cyber Grid" },
];

const CURSOR_PRESETS = [
  { id: "default", label: "Default Browser Cursor" },
  { id: "emerald-dot", label: "Emerald Dot Glow" },
  { id: "sparkle-pointer", label: "Emerald Sparkle Pointer" },
  { id: "crosshair-tech", label: "Tech Precision Crosshair" },
  { id: "neon-glow", label: "Neon Blue Aura Ring" },
];

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  const update = (key: keyof FormTheme, value: any) => {
    onChange({ ...theme, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <Palette className="h-5 w-5 text-emerald-600" />
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Form & Canvas Visual Design Engine</h3>
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

        {/* Custom Cursor */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MousePointer className="h-3.5 w-3.5 text-emerald-600" /> Custom Cursor Preset
          </label>
          <select
            value={theme.customCursor || "default"}
            onChange={(e) => update("customCursor", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {CURSOR_PRESETS.map((cur) => (
              <option key={cur.id} value={cur.id}>
                {cur.label}
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
      </div>

      {/* Advanced Background Customizer (Image, Video, Live Animated Presets) */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" /> Background Graphics & Video Engine
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-600" /> Background Image URL
            </label>
            <input
              type="text"
              value={theme.backgroundImageUrl || ""}
              placeholder="https://images.unsplash.com/... or custom image URL"
              onChange={(e) => update("backgroundImageUrl", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-indigo-600" /> 10-Sec Cap Video Background URL
            </label>
            <input
              type="text"
              value={theme.backgroundVideoUrl || ""}
              placeholder="https://assets.mixkit.co/... .mp4 or .webm"
              onChange={(e) => update("backgroundVideoUrl", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Live Animated Background Preset</label>
            <select
              value={theme.liveAnimatedPreset || "none"}
              onChange={(e) => update("liveAnimatedPreset", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {LIVE_ANIMATED_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {theme.liveAnimatedPreset && theme.liveAnimatedPreset !== "none" && (
            <div className="flex items-center gap-3 pt-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Live Primary</label>
                <input
                  type="color"
                  value={theme.liveAnimationColors?.primary || "#059669"}
                  onChange={(e) =>
                    update("liveAnimationColors", {
                      primary: e.target.value,
                      secondary: theme.liveAnimationColors?.secondary || "#6366f1",
                    })
                  }
                  className="h-8 w-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Live Secondary</label>
                <input
                  type="color"
                  value={theme.liveAnimationColors?.secondary || "#6366f1"}
                  onChange={(e) =>
                    update("liveAnimationColors", {
                      primary: theme.liveAnimationColors?.primary || "#059669",
                      secondary: e.target.value,
                    })
                  }
                  className="h-8 w-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watermark Controls */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" /> Watermark & Branding Security Controls
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
