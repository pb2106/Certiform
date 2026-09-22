"use client";

import { useState } from "react";
import { CertificatePlaceholder, QuestionConfig } from "@/lib/types";
import { Award, Plus, Trash2, Move, QrCode, Type, Tag, Calendar, Image as ImageIcon, Sparkles } from "lucide-react";

interface CertificateTemplateEditorProps {
  formTitle: string;
  questions: QuestionConfig[];
  initialPlaceholders: CertificatePlaceholder[];
  initialBackgroundUrl?: string | null;
  onSave: (data: { placeholders: CertificatePlaceholder[]; backgroundUrl: string }) => void;
}

export function CertificateTemplateEditor({
  formTitle,
  questions,
  initialPlaceholders,
  initialBackgroundUrl,
  onSave,
}: CertificateTemplateEditorProps) {
  const [placeholders, setPlaceholders] = useState<CertificatePlaceholder[]>(initialPlaceholders);
  const [backgroundUrl, setBackgroundUrl] = useState(
    initialBackgroundUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80"
  );
  const [selectedId, setSelectedId] = useState<string | null>(initialPlaceholders[0]?.id || null);

  const selectedPlaceholder = placeholders.find((p) => p.id === selectedId);

  const addPlaceholder = (type: CertificatePlaceholder["type"]) => {
    const id = `ph_${Date.now()}`;
    const newPh: CertificatePlaceholder = {
      id,
      type,
      text: type === "static" ? "Sample Header Text" : undefined,
      fieldId: type === "variable" ? questions[0]?.id : undefined,
      fallbackText: "Participant Name",
      prefix: type === "system_date" ? "Date: " : type === "system_code" ? "ID: " : undefined,
      x: 50,
      y: 50,
      fontSize: 20,
      fontWeight: "normal",
      color: "#0f172a",
      align: "center",
    };
    setPlaceholders((prev) => [...prev, newPh]);
    setSelectedId(id);
  };

  const updateSelected = (updates: Partial<CertificatePlaceholder>) => {
    if (!selectedId) return;
    setPlaceholders((prev) => prev.map((p) => (p.id === selectedId ? { ...p, ...updates } : p)));
  };

  const deleteSelected = (id: string) => {
    setPlaceholders((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Visual Certificate Template Builder</h2>
            <p className="text-xs text-slate-500">Design dynamic certificate graphics for {formTitle}</p>
          </div>
        </div>

        <button
          onClick={() => onSave({ placeholders, backgroundUrl })}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
        >
          Save Template Specs
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Toolbar: Add Placeholders */}
        <div className="col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Add Placeholders</h3>

            <div className="space-y-2">
              <button
                onClick={() => addPlaceholder("variable")}
                className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              >
                <Tag className="h-4 w-4 text-emerald-600" /> Form Field Variable
              </button>
              <button
                onClick={() => addPlaceholder("static")}
                className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              >
                <Type className="h-4 w-4 text-emerald-600" /> Static Text Block
              </button>
              <button
                onClick={() => addPlaceholder("system_date")}
                className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              >
                <Calendar className="h-4 w-4 text-emerald-600" /> Issue Date Stamp
              </button>
              <button
                onClick={() => addPlaceholder("qr_code")}
                className="w-full flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              >
                <QrCode className="h-4 w-4 text-emerald-600" /> Verification QR Code
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Background Image URL</label>
            <input
              type="text"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Center Canvas Preview */}
        <div className="col-span-6">
          <div
            className="relative w-full aspect-[1.414] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          >
            {placeholders.map((p) => {
              const isSelected = p.id === selectedId;
              let label = p.text || (p.fieldId ? `{{${p.fieldId}}}` : p.type);
              if (p.type === "qr_code") label = "[ QR Code Badge ]";

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    position: "absolute",
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: `${p.fontSize * 0.7}px`, // Scaled for preview canvas
                    fontWeight: p.fontWeight || "normal",
                    color: p.color || "#0f172a",
                  }}
                  className={`cursor-pointer px-2 py-1 rounded transition-all whitespace-nowrap ${
                    isSelected ? "ring-2 ring-emerald-500 bg-emerald-500/10 font-bold" : "hover:bg-black/5"
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector */}
        <div className="col-span-3 space-y-4">
          {selectedPlaceholder ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Position & Format</h3>
                <button onClick={() => deleteSelected(selectedPlaceholder.id)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {selectedPlaceholder.type === "variable" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bind to Form Field</label>
                  <select
                    value={selectedPlaceholder.fieldId || ""}
                    onChange={(e) => updateSelected({ fieldId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedPlaceholder.type === "static" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Static Text</label>
                  <input
                    type="text"
                    value={selectedPlaceholder.text || ""}
                    onChange={(e) => updateSelected({ text: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">X Pos ({selectedPlaceholder.x}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={selectedPlaceholder.x}
                    onChange={(e) => updateSelected({ x: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Y Pos ({selectedPlaceholder.y}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={selectedPlaceholder.y}
                    onChange={(e) => updateSelected({ y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Font Size ({selectedPlaceholder.fontSize}px)</label>
                <input
                  type="range"
                  min="12"
                  max="60"
                  value={selectedPlaceholder.fontSize}
                  onChange={(e) => updateSelected({ fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text Color</label>
                <input
                  type="color"
                  value={selectedPlaceholder.color || "#0f172a"}
                  onChange={(e) => updateSelected({ color: e.target.value })}
                  className="h-8 w-full rounded border border-slate-300 p-0.5 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
              Select a placeholder element on the canvas to configure properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
