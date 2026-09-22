import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Layers, FileText, ExternalLink, BarChart2, Award, Calendar, CheckCircle } from "lucide-react";

export const revalidate = 0; // Fresh data fetch

export default async function DashboardPage() {
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      certificateTemplates: true,
      _count: {
        select: { responses: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Forms & Certificates Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your dynamic forms, view real-time responses, and customize certificate templates.
          </p>
        </div>

        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create New Form
        </Link>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <Layers className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No forms created yet</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating your first dynamic form with automated certificate issuance.</p>
          <Link
            href="/builder/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" /> Create Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      form.status === "live"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <CheckCircle className="h-3 w-3" /> {form.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(form.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {form.title}
                </h3>
                {form.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{form.description}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-emerald-600" /> {form._count.responses} Submissions
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-teal-600" /> {form.certificateTemplates.length} Cert Template
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={`/builder/${form.id}`}
                  className="w-full text-center rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
                >
                  Edit Builder
                </Link>
                <Link
                  href={`/f/${form.id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Public Link <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
