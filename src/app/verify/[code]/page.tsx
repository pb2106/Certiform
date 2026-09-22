import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, Calendar, Award, Download, CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function CertificateVerificationPage({ params }: { params: { code: string } }) {
  const issuedCert = await prisma.certificateIssued.findUnique({
    where: { verificationCode: params.code },
    include: {
      response: {
        include: { form: true },
      },
      template: true,
    },
  });

  if (!issuedCert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-in space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invalid Certificate Code</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          No credential record could be verified for identifier: <code className="font-mono text-rose-600">{params.code}</code>
        </p>
      </div>
    );
  }

  const answers = JSON.parse(issuedCert.response.answersJson || "{}");
  const questions = JSON.parse(issuedCert.response.form.schemaJson || "[]");

  const nameQuestion = questions.find((q: any) => q.label.toLowerCase().includes("name"));
  const recipientName = nameQuestion && answers[nameQuestion.id] ? answers[nameQuestion.id] : "Verified Participant";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 animate-fade-in">
      {/* Verification Badge Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 dark:border-emerald-900/50 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle className="h-3.5 w-3.5" /> Authenticated & Verifiable Credential
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{recipientName}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {issuedCert.verificationCode}</p>
            </div>
          </div>

          <a
            href={`/api/certificates/render?code=${issuedCert.verificationCode}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shrink-0"
          >
            Open Full Graphic <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Metadata Detail Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Issued For Program</p>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{issuedCert.response.form.title}</h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Issued Date</p>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {new Date(issuedCert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Issuer Authorization</p>
          <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-base">CertiForm Verifiable System</h3>
        </div>
      </div>

      {/* Embedded Live Certificate Preview Frame */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Digital Credential Preview</h3>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xl dark:border-slate-800 bg-slate-900">
          <iframe
            src={`/api/certificates/render?code=${issuedCert.verificationCode}`}
            className="w-full h-[520px] border-0"
            title="Certificate Graphic"
          />
        </div>
      </div>
    </div>
  );
}
