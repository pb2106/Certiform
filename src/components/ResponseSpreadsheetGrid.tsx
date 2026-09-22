"use client";

import { useState } from "react";
import { QuestionConfig, ResponseWithDetails } from "@/lib/types";
import { Search, Download, FileSpreadsheet, FileArchive, CheckCircle2, XCircle, ExternalLink, Filter } from "lucide-react";

interface ResponseSpreadsheetGridProps {
  formId: string;
  formTitle: string;
  questions: QuestionConfig[];
  responses: ResponseWithDetails[];
  onStatusChange: (responseId: string, status: "approved" | "rejected") => void;
}

export function ResponseSpreadsheetGrid({
  formId,
  formTitle,
  questions,
  responses,
  onStatusChange,
}: ResponseSpreadsheetGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filterableQuestions = questions.filter((q) => q.type !== "section" && q.type !== "static");

  const filteredResponses = responses.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    const emailMatch = r.respondentEmail?.toLowerCase().includes(term);
    const answersMatch = Object.values(r.answers).some((val) => String(val).toLowerCase().includes(term));

    return emailMatch || answersMatch;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search & Export Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/api/forms/${formId}/export?format=csv`}
            download
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" /> CSV
          </a>
          <a
            href={`/api/forms/${formId}/export?format=excel`}
            download
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> Excel (.xlsx)
          </a>
          <a
            href={`/api/forms/${formId}/export?format=certificates_zip`}
            download
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
          >
            <FileArchive className="h-3.5 w-3.5" /> Certificates ZIP
          </a>
        </div>
      </div>

      {/* Spreadsheet Table Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4 min-w-[120px]">Status</th>
                <th className="py-3.5 px-4 min-w-[180px]">Submitted At</th>
                <th className="py-3.5 px-4 min-w-[160px]">Respondent</th>
                <th className="py-3.5 px-4 min-w-[180px]">Certificate</th>
                {filterableQuestions.map((q) => (
                  <th key={q.id} className="py-3.5 px-4 min-w-[180px] max-w-[240px] truncate" title={q.label}>
                    {q.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={4 + filterableQuestions.length} className="py-12 text-center text-slate-400">
                    No matching responses found.
                  </td>
                </tr>
              ) : (
                filteredResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {r.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white truncate max-w-[160px]">
                      {r.respondentEmail || "Anonymous"}
                    </td>

                    <td className="py-3 px-4">
                      {r.certificate ? (
                        <a
                          href={`/verify/${r.certificate.verificationCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 hover:underline font-bold"
                        >
                          {r.certificate.verificationCode}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {filterableQuestions.map((q) => {
                      const val = r.answers[q.id];
                      const displayVal = Array.isArray(val) ? val.join(", ") : val !== undefined ? String(val) : "—";
                      return (
                        <td key={q.id} className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[240px] truncate" title={displayVal}>
                          {displayVal}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
