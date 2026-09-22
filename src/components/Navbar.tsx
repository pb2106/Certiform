"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Award, Layers, BarChart2, PlusCircle, CheckCircle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isPublicForm = pathname.startsWith("/f/");
  const isCertificateVerify = pathname.startsWith("/verify/");

  if (isPublicForm || isCertificateVerify) {
    return null; // Keep public standalone form page pristine
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white leading-tight tracking-tight">
                CertiForm<span className="text-emerald-500">.ai</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Dynamic Builder & Certs
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                pathname === "/dashboard"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900"
              }`}
            >
              <Layers className="h-4 w-4" />
              Forms Dashboard
            </Link>

            <Link
              href="/templates"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                pathname === "/templates"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900"
              }`}
            >
              <FileText className="h-4 w-4" />
              Templates
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/builder/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all hover:shadow-emerald-500/25 active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            Create Form
          </Link>
        </div>
      </div>
    </header>
  );
}
