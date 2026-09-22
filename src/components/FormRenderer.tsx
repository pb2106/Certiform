"use client";

import { useState, useRef } from "react";
import { QuestionConfig, FormTheme } from "@/lib/types";
import { Star, CheckCircle, Upload, AlertCircle, ArrowRight, ArrowLeft, Send, FileCheck, PenTool, Play } from "lucide-react";

interface FormRendererProps {
  formId: string;
  title: string;
  description?: string | null;
  questions: QuestionConfig[];
  theme: FormTheme;
  isPreview?: boolean;
}

export function FormRenderer({ formId, title, description, questions, theme, isPreview = false }: FormRendererProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatures, setSignatures] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [submittedResult, setSubmittedResult] = useState<{
    responseId: string;
    certificate?: { verificationCode: string; pdfUrl: string } | null;
  } | null>(null);

  // Group questions by sections/pages
  const pages: QuestionConfig[][] = [[]];
  questions.forEach((q) => {
    if (q.type === "section" && pages[pages.length - 1].length > 0) {
      pages.push([q]);
    } else {
      pages[pages.length - 1].push(q);
    }
  });

  const activeQuestions = pages[currentPage] || [];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  // Signature Canvas Helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = theme.primaryColor || "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = (questionId: string) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setSignatures((prev) => ({ ...prev, [questionId]: dataUrl }));
      handleAnswerChange(questionId, dataUrl);
    }
  };

  const clearSignature = (questionId: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatures((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      handleAnswerChange(questionId, "");
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) {
      alert("This is a preview mode submission test. Validation passed!");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const formatted: Record<string, string> = {};
          Object.entries(data.details.fieldErrors).forEach(([k, v]: [string, any]) => {
            formatted[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setErrors(formatted);
        } else {
          alert(data.error || "Submission failed");
        }
      } else {
        setSubmittedResult({
          responseId: data.responseId,
          certificate: data.certificate,
        });
      }
    } catch (err: any) {
      alert("Error submitting form: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Response Submitted!</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
          Thank you for completing <strong>{title}</strong>. Your response has been recorded.
        </p>

        {submittedResult.certificate && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30 text-left">
            <div className="flex items-center gap-3">
              <FileCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Your Digital Certificate is Ready</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Verifiable Credential Code:</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4 border border-emerald-200 dark:bg-slate-900 dark:border-emerald-800">
              <code className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {submittedResult.certificate.verificationCode}
              </code>
              <a
                href={`/verify/${submittedResult.certificate.verificationCode}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                View Certificate
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Custom Cursor Utility Class
  const cursorClass = theme.customCursor ? `cursor-${theme.customCursor}` : "";
  const animatedClass = theme.liveAnimatedPreset && theme.liveAnimatedPreset !== "none" ? `anim-${theme.liveAnimatedPreset}` : "";

  return (
    <div className={`relative min-h-screen py-10 px-4 transition-colors ${cursorClass} ${animatedClass}`}>
      {/* 10-Second Video Background Overlay */}
      {theme.backgroundVideoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-20 opacity-30 pointer-events-none"
        >
          <source src={theme.backgroundVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* Image Background Overlay */}
      {theme.backgroundImageUrl && !theme.backgroundVideoUrl && (
        <div
          className="fixed inset-0 w-full h-full bg-cover bg-center -z-20 pointer-events-none opacity-40"
          style={{ backgroundImage: `url('${theme.backgroundImageUrl}')` }}
        />
      )}

      {/* Dynamic Watermark */}
      {theme.watermark?.text && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: theme.watermark.opacity || 0.05,
            transform: `rotate(${theme.watermark.rotation || -15}deg)`,
            zIndex: -10,
            fontSize: "80px",
            fontWeight: 900,
            color: theme.textColor || "#000000",
            textTransform: "uppercase",
            letterSpacing: "6px",
          }}
        >
          {theme.watermark.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
        {/* Header Card */}
        <div
          className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 relative overflow-hidden"
          style={{
            borderRadius: theme.borderRadius || "16px",
            boxShadow: theme.shadow || "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: theme.primaryColor || "#059669" }} />

          {theme.logoUrl && (
            <div className={`mb-6 flex justify-${theme.logoPosition || "left"}`}>
              <img src={theme.logoUrl} alt="Logo" className="h-12 object-contain" />
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {description && <p className="mt-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">{description}</p>}
        </div>

        {/* Question Blocks */}
        <div className="space-y-6">
          {activeQuestions.map((q) => {
            if (q.type === "section") {
              return (
                <div key={q.id} className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{q.label}</h2>
                  {q.description && <p className="mt-1 text-sm text-slate-500">{q.description}</p>}
                </div>
              );
            }

            if (q.type === "media_embed") {
              return (
                <div key={q.id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{q.label}</h3>
                  {q.mediaUrl && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                      <iframe src={q.mediaUrl} className="w-full h-full border-0" allowFullScreen title="Video Embed" />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-3 transition-all"
                style={{ borderRadius: theme.borderRadius || "12px" }}
              >
                <label className="block text-base font-semibold text-slate-900 dark:text-white">
                  {q.label} {q.required && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
                {q.description && <p className="text-xs text-slate-500 dark:text-slate-400">{q.description}</p>}

                {q.type === "signature" ? (
                  <div className="space-y-2">
                    <div className="border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={160}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={() => stopDrawing(q.id)}
                        onMouseLeave={() => stopDrawing(q.id)}
                        className="w-full h-40 cursor-crosshair"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => clearSignature(q.id)}
                      className="text-xs text-rose-500 hover:underline font-medium"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : q.type === "file" ? (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Click or drag files to upload attachments</p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX up to 10MB</p>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).map((f) => f.name);
                        handleAnswerChange(q.id, files);
                      }}
                      className="hidden"
                      id={`file-${q.id}`}
                    />
                  </div>
                ) : q.type === "single_choice" ? (
                  <div className="space-y-2 pt-1">
                    {(q.options || []).map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === opt}
                          onChange={() => handleAnswerChange(q.id, opt)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] || ""}
                    placeholder="Your answer..."
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : <><Send className="h-4 w-4" /> Submit Form</>}
          </button>
        </div>
      </form>
    </div>
  );
}
