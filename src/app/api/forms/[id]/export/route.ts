import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exportToCSV, generateExcelBuffer, generateCertificatesZip } from "@/lib/export-service";
import { QuestionConfig, ResponseWithDetails } from "@/lib/types";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        certificateTemplates: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const rawResponses = await prisma.response.findMany({
      where: { formId: params.id },
      orderBy: { submittedAt: "desc" },
      include: {
        issuedCertificates: true,
      },
    });

    const questions: QuestionConfig[] = JSON.parse(form.schemaJson || "[]");

    const responses: ResponseWithDetails[] = rawResponses.map((r) => ({
      id: r.id,
      formId: r.formId,
      respondentEmail: r.respondentEmail,
      answers: JSON.parse(r.answersJson || "{}"),
      submittedAt: r.submittedAt,
      status: r.status as any,
      certificate: r.issuedCertificates[0]
        ? {
            id: r.issuedCertificates[0].id,
            verificationCode: r.issuedCertificates[0].verificationCode,
            pdfUrl: r.issuedCertificates[0].pdfUrl,
          }
        : null,
    }));

    if (format === "csv") {
      const csvData = exportToCSV(questions, responses);
      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_Responses.csv"`,
        },
      });
    }

    if (format === "excel") {
      const excelBuf = generateExcelBuffer(questions, responses);
      return new NextResponse(new Uint8Array(excelBuf), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_Responses.xlsx"`,
        },
      });
    }

    if (format === "certificates_zip") {
      const template = form.certificateTemplates[0];
      const placeholders = template ? JSON.parse(template.placeholdersJson || "[]") : [];
      const zipBuf = await generateCertificatesZip(form.title, placeholders, responses);

      return new NextResponse(new Uint8Array(zipBuf), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_Certificates.zip"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported export format" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
