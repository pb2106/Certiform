import Link from "next/link";
import { Award, Layers, Sparkles, CheckCircle, ArrowRight, Shield, Zap, FileSpreadsheet, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.slate.50))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.950),theme(colors.slate.950))] opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Vercel Serverless Native Architecture
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-[1.15]">
            Dynamic Drag-and-Drop Builder + <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Automated Digital Certificates</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Create high-converting, fully customized forms with free-form styling. Automatically issue verifiable digital credentials, dispatch branded emails, and visualize response analytics in real time.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-95"
            >
              Go to Forms Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/verify/CERT-SUMMIT-2026-001"
              target="_blank"
              className="inline-flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              <Shield className="h-4 w-4 text-emerald-600" /> Verify Demo Credential
            </Link>
          </div>
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Engineered for Enterprise Workflows</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Everything you need to collect data, generate custom credentials, and analyze responses at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">20+ Question Types & Logic</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Support for short text, ratings, checkboxes, matrices, date pickers, signature pads, and multi-step pages with Zod validation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Automated Certificate Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Visual template builder mapping form answers directly onto high-resolution certificates with verifiable QR codes and PDF exports.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Analytics & Excel Export</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Google-Forms-style visual charts (Recharts), interactive spreadsheet grid, status approval workflows, and bulk CSV/Excel downloads.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
