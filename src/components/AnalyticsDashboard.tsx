"use client";

import { QuestionConfig, ResponseWithDetails } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Award, CheckCircle, Clock, BarChart2 } from "lucide-react";

interface AnalyticsDashboardProps {
  questions: QuestionConfig[];
  responses: ResponseWithDetails[];
}

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#6366f1", "#818cf8"];

export function AnalyticsDashboard({ questions, responses }: AnalyticsDashboardProps) {
  const totalResponses = responses.length;
  const approvedCount = responses.filter((r) => r.status === "approved").length;
  const certsIssuedCount = responses.filter((r) => r.certificate).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Submissions</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalResponses}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Approved Responses</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{approvedCount}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issued Certificates</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{certsIssuedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Per Question Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((q) => {
          if (q.type === "section" || q.type === "static") return null;

          if (q.type === "single_choice" || q.type === "dropdown" || q.type === "multiple_choice") {
            const counts: Record<string, number> = {};
            (q.options || []).forEach((opt) => (counts[opt] = 0));

            responses.forEach((r) => {
              const val = r.answers[q.id];
              if (Array.isArray(val)) {
                val.forEach((v) => {
                  counts[v] = (counts[v] || 0) + 1;
                });
              } else if (val) {
                counts[val] = (counts[val] || 0) + 1;
              }
            });

            const data = Object.entries(counts).map(([name, count]) => ({ name, count }));

            return (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{q.label}</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                      <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (q.type === "rating") {
            const starCounts: Record<string, number> = { "1 Star": 0, "2 Stars": 0, "3 Stars": 0, "4 Stars": 0, "5 Stars": 0 };
            responses.forEach((r) => {
              const val = r.answers[q.id];
              if (val && starCounts[`${val} Stars`] !== undefined) {
                starCounts[`${val} Stars`] += 1;
              }
            });

            const data = Object.entries(starCounts).map(([name, value]) => ({ name, value }));

            return (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{q.label}</h4>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {data.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          return (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{q.label}</h4>
              <p className="text-xs text-slate-500 font-medium">{responses.length} text responses received</p>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {responses.map((r, i) => {
                  const val = r.answers[q.id];
                  if (!val) return null;
                  return (
                    <div key={i} className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      "{val}"
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
