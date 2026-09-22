"use client";

import Link from "next/link";
import { Award, ShieldCheck, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 dark:border-slate-800/80 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Award className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base">
            CertiForm<span className="text-emerald-500">.ai</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          © 2026 CertiForm Platform. Dynamic Canvas Form Builder & Verifiable Digital Certificates.
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Verifiable Certificates Active
          </span>
        </div>
      </div>
    </footer>
  );
}
