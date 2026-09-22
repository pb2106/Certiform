"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Award, FileText, ArrowRight } from "lucide-react";

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "New Dynamic Form", description }),
      });

      const newForm = await res.json();
      if (res.ok) {
        router.push(`/builder/${newForm.id}`);
      } else {
        alert(newForm.error || "Failed to create form");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create a New Form</h1>
        <p className="text-sm text-slate-500">Configure title and description to start building your dynamic form canvas.</p>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Form Title</label>
          <input
            type="text"
            required
            value={title}
            placeholder="e.g. AI Architecture Workshop Certificate & Feedback"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Description / Instructions</label>
          <textarea
            rows={3}
            value={description}
            placeholder="Brief instructions for respondents..."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 disabled:opacity-50"
        >
          {isCreating ? (
            "Creating Form..."
          ) : (
            <>
              Launch Builder Workspace <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
