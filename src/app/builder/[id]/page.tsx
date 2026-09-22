"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormBuilderCanvas } from "@/components/FormBuilderCanvas";
import { ThemeEditor } from "@/components/ThemeEditor";
import { CertificateTemplateEditor } from "@/components/CertificateTemplateEditor";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ResponseSpreadsheetGrid } from "@/components/ResponseSpreadsheetGrid";
import { QuestionConfig, FormTheme, CertificatePlaceholder, ResponseWithDetails } from "@/lib/types";
import { Layers, Palette, Award, BarChart2, Table, Settings, CheckCircle, ExternalLink, Globe } from "lucide-react";

export default function BuilderPage() {
  const params = useParams();
  const formId = params.id as string;
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [theme, setTheme] = useState<FormTheme>({
    fontFamily: "Inter",
    primaryColor: "#059669",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    accentColor: "#10b981",
    borderRadius: "12px",
    shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
  });
  const [placeholders, setPlaceholders] = useState<CertificatePlaceholder[]>([]);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [responses, setResponses] = useState<ResponseWithDetails[]>([]);

  const [activeTab, setActiveTab] = useState<"builder" | "theme" | "certificate" | "analytics" | "responses" | "settings">("builder");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Form & Responses
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setForm(data);
        setQuestions(JSON.parse(data.schemaJson || "[]"));
        setTheme(JSON.parse(data.themeJson || "{}"));

        if (data.certificateTemplates && data.certificateTemplates[0]) {
          const tmpl = data.certificateTemplates[0];
          setPlaceholders(JSON.parse(tmpl.placeholdersJson || "[]"));
          setBackgroundUrl(tmpl.backgroundUrl || "");
        }

        const respRes = await fetch(`/api/forms/${formId}/responses`);
        if (respRes.ok) {
          const rawResp = await respRes.json();
          const parsedResp: ResponseWithDetails[] = rawResp.map((r: any) => ({
            id: r.id,
            formId: r.formId,
            respondentEmail: r.respondentEmail,
            answers: JSON.parse(r.answersJson || "{}"),
            submittedAt: r.submittedAt,
            status: r.status,
            certificate: r.issuedCertificates && r.issuedCertificates[0] ? r.issuedCertificates[0] : null,
          }));
          setResponses(parsedResp);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [formId]);

  const handleSaveForm = async (updates: any) => {
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          status: updates.status || form.status,
          schemaJson: JSON.stringify(updates.questions || questions),
          themeJson: JSON.stringify(updates.theme || theme),
          responseLimit: updates.responseLimit !== undefined ? updates.responseLimit : form.responseLimit,
          ...(updates.placeholders && {
            certificateTemplate: {
              name: "Standard Certificate",
              backgroundUrl: updates.backgroundUrl || backgroundUrl,
              placeholdersJson: JSON.stringify(updates.placeholders),
            },
          }),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setForm(updated);
        alert("Form workspace saved successfully!");
      }
    } catch (err: any) {
      alert("Save failed: " + err.message);
    }
  };

  const handleStatusToggle = async (responseId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId, status }),
      });

      if (res.ok) {
        setResponses((prev) => prev.map((r) => (r.id === responseId ? { ...r, status } : r)));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (isLoading || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-600 font-semibold">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          Loading Workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Workspace Navigation Bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-xs">{form.title}</span>

          <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("builder")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "builder" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600" /> Canvas Builder
            </button>

            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "theme" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-teal-600" /> Theme Styling
            </button>

            <button
              onClick={() => setActiveTab("certificate")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "certificate" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Award className="h-3.5 w-3.5 text-indigo-600" /> Certificate Specs
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "analytics" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5 text-emerald-600" /> Analytics
            </button>

            <button
              onClick={() => setActiveTab("responses")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "responses" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Table className="h-3.5 w-3.5 text-emerald-600" /> Responses ({responses.length})
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "settings" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-slate-600" /> Settings
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/f/${formId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600" /> Public Link <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Workspace Content Area */}
      <div className="p-6">
        {activeTab === "builder" && (
          <FormBuilderCanvas
            formId={formId}
            initialTitle={form.title}
            initialDescription={form.description}
            initialQuestions={questions}
            initialTheme={theme}
            onSave={(data) => {
              setQuestions(data.questions);
              setTheme(data.theme);
              handleSaveForm({ title: data.title, description: data.description, questions: data.questions, theme: data.theme });
            }}
          />
        )}

        {activeTab === "theme" && (
          <div className="mx-auto max-w-4xl">
            <ThemeEditor
              theme={theme}
              onChange={(updatedTheme) => {
                setTheme(updatedTheme);
                handleSaveForm({ title: form.title, theme: updatedTheme });
              }}
            />
          </div>
        )}

        {activeTab === "certificate" && (
          <div className="mx-auto max-w-6xl">
            <CertificateTemplateEditor
              formTitle={form.title}
              questions={questions}
              initialPlaceholders={placeholders}
              initialBackgroundUrl={backgroundUrl}
              onSave={(data) => {
                setPlaceholders(data.placeholders);
                setBackgroundUrl(data.backgroundUrl);
                handleSaveForm({ title: form.title, placeholders: data.placeholders, backgroundUrl: data.backgroundUrl });
              }}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="mx-auto max-w-6xl">
            <AnalyticsDashboard questions={questions} responses={responses} />
          </div>
        )}

        {activeTab === "responses" && (
          <div className="mx-auto max-w-7xl">
            <ResponseSpreadsheetGrid
              formId={formId}
              formTitle={form.title}
              questions={questions}
              responses={responses}
              onStatusChange={handleStatusToggle}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Form Response & Scheduling Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleSaveForm({ title: form.title, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="live">Live (Accepting Responses)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Response Cap (Optional)</label>
                <input
                  type="number"
                  value={form.responseLimit || ""}
                  placeholder="e.g. 500"
                  onChange={(e) => handleSaveForm({ title: form.title, responseLimit: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
