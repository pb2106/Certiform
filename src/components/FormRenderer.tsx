"use client";

import { useState, useEffect } from "react";
import { QuestionConfig, FormTheme } from "@/lib/types";
import { Star, CheckCircle, Upload, AlertCircle, ArrowRight, ArrowLeft, Send, FileCheck } from "lucide-react";

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

  // Handle Input Changes
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

  // Evaluate conditional visibility
  const isQuestionVisible = (q: QuestionConfig): boolean => {
    if (!q.conditionalLogic || q.conditionalLogic.length === 0) return true;
    return q.conditionalLogic.every((rule) => {
      const sourceVal = answers[rule.targetQuestionId];
      if (rule.operator === "equals") return String(sourceVal) === rule.value;
      if (rule.operator === "not_equals") return String(sourceVal) !== rule.value;
      if (rule.operator === "contains") return String(sourceVal || "").includes(rule.value);
      return true;
    });
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

  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 transition-colors"
      style={{
        fontFamily: theme.fontFamily || "Inter, sans-serif",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Header Card */}
        <div
          className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden"
          style={{
            borderRadius: theme.borderRadius || "16px",
            boxShadow: theme.shadow || "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{ backgroundColor: theme.primaryColor || "#059669" }}
          />

          {theme.logoUrl && (
            <div className={`mb-6 flex justify-${theme.logoPosition || "left"}`}>
              <img src={theme.logoUrl} alt="Logo" className="h-12 object-contain" />
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {description && <p className="mt-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">{description}</p>}

          {pages.length > 1 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage + 1} of {pages.length}
              </span>
            </div>
          )}
        </div>

        {/* Questions Page */}
        <div className="space-y-6">
          {activeQuestions.map((q) => {
            if (!isQuestionVisible(q)) return null;

            if (q.type === "section") {
              return (
                <div key={q.id} className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{q.label}</h2>
                  {q.description && <p className="mt-1 text-sm text-slate-500">{q.description}</p>}
                </div>
              );
            }

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3 transition-all"
                style={{ borderRadius: theme.borderRadius || "12px" }}
              >
                <label className="block text-base font-semibold text-slate-900 dark:text-white">
                  {q.label} {q.required && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
                {q.description && <p className="text-xs text-slate-500 dark:text-slate-400">{q.description}</p>}

                {/* Question Control Types */}
                {q.type === "text" || q.type === "email" || q.type === "phone" || q.type === "url" || q.type === "number" ? (
                  <input
                    type={q.type === "email" ? "email" : q.type === "number" ? "number" : "text"}
                    value={answers[q.id] || ""}
                    placeholder={q.placeholder || "Your answer..."}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                ) : q.type === "paragraph" ? (
                  <textarea
                    rows={4}
                    value={answers[q.id] || ""}
                    placeholder={q.placeholder || "Your response..."}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
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
                ) : q.type === "multiple_choice" ? (
                  <div className="space-y-2 pt-1">
                    {(q.options || []).map((opt, i) => {
                      const selected = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                      const isChecked = selected.includes(opt);
                      return (
                        <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = e.target.checked ? [...selected, opt] : selected.filter((x: string) => x !== opt);
                              handleAnswerChange(q.id, next);
                            }}
                            className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : q.type === "rating" ? (
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleAnswerChange(q.id, String(star))}
                        className={`p-2 rounded-xl transition-all ${
                          Number(answers[q.id]) >= star
                            ? "text-amber-400 scale-110"
                            : "text-slate-300 hover:text-amber-300 dark:text-slate-700"
                        }`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                ) : q.type === "dropdown" ? (
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">-- Select an option --</option>
                    {(q.options || []).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] || ""}
                    placeholder="Your answer..."
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                )}

                {errors[q.id] && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors[q.id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4">
          {currentPage > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentPage < pages.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Next Page <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Form
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
