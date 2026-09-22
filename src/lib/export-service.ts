import * as XLSX from "xlsx";
import JSZip from "jszip";
import { QuestionConfig, ResponseWithDetails } from "./types";
import { generateCertificateHtml } from "./certificate-renderer";

export function exportToCSV(questions: QuestionConfig[], responses: ResponseWithDetails[]): string {
  const headers = ["Response ID", "Submitted At", "Status", "Respondent Email", ...questions.map((q) => q.label)];

  const rows = responses.map((r) => {
    const row = [
      r.id,
      new Date(r.submittedAt).toISOString(),
      r.status,
      r.respondentEmail || "Anonymous",
    ];

    questions.forEach((q) => {
      const val = r.answers[q.id];
      if (Array.isArray(val)) {
        row.push(val.join(", "));
      } else if (val !== undefined && val !== null) {
        row.push(String(val));
      } else {
        row.push("");
      }
    });

    return row;
  });

  const csvContent = [headers, ...rows]
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
}

export function generateExcelBuffer(questions: QuestionConfig[], responses: ResponseWithDetails[]): Buffer {
  const headers = ["Response ID", "Submitted At", "Status", "Respondent Email", ...questions.map((q) => q.label)];

  const data = responses.map((r) => {
    const rowObj: Record<string, any> = {
      "Response ID": r.id,
      "Submitted At": new Date(r.submittedAt).toLocaleString(),
      "Status": r.status,
      "Respondent Email": r.respondentEmail || "Anonymous",
    };

    questions.forEach((q) => {
      const val = r.answers[q.id];
      rowObj[q.label] = Array.isArray(val) ? val.join(", ") : val !== undefined ? val : "";
    });

    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buf;
}

export async function generateCertificatesZip(
  formTitle: string,
  templatePlaceholders: any[],
  responses: ResponseWithDetails[]
): Promise<Buffer> {
  const zip = new JSZip();
  const folder = zip.folder(`${formTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Certificates`);

  responses.forEach((r, idx) => {
    const certCode = r.certificate?.verificationCode || `CERT-${r.id.substring(0, 8)}`;
    const htmlContent = generateCertificateHtml({
      placeholders: templatePlaceholders,
      answers: r.answers,
      verificationCode: certCode,
      issuedAt: r.submittedAt,
      formTitle,
    });

    const filename = `Certificate_${r.answers.q1_fullname ? String(r.answers.q1_fullname).replace(/\s+/g, "_") : idx + 1}_${certCode}.html`;
    folder?.file(filename, htmlContent);
  });

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer;
}
