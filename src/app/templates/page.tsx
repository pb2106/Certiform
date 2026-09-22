import Link from "next/link";
import { Sparkles, Plus, Award, FileText, ArrowRight } from "lucide-react";

const TEMPLATES = [
  {
    title: "Global Tech Summit Certificate & Feedback",
    description: "Event registration and feedback collector paired with auto-generated verifiable certificates of completion.",
    questionsCount: 6,
    category: "Workshop & Summit",
  },
  {
    title: "Course Evaluation & Certification",
    description: "Multi-page student feedback questionnaire with automated grade/completion certificate issuance.",
    questionsCount: 8,
    category: "Education",
  },
  {
    title: "Job Application & Credential Upload",
    description: "Comprehensive job application form with document upload slots and status tracking.",
    questionsCount: 10,
    category: "HR & Hiring",
  },
  {
    title: "Customer NPS & Satisfaction Survey",
    description: "Dynamic rating scale and open-ended feedback form with visual analytics dashboard.",
    questionsCount: 5,
    category: "Feedback",
  },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Form & Certificate Template Gallery</h1>
        <p className="text-sm text-slate-500">Pick a pre-configured template to launch your dynamic form with ready-made certificate specs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map((tmpl, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 uppercase tracking-wider">
                {tmpl.category}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{tmpl.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{tmpl.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{tmpl.questionsCount} Pre-built Questions</span>
              <Link
                href="/builder/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Use Template <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
