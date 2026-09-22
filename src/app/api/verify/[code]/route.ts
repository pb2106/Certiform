import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  try {
    const issuedCert = await prisma.certificateIssued.findUnique({
      where: { verificationCode: params.code },
      include: {
        response: {
          include: {
            form: true,
          },
        },
        template: true,
      },
    });

    if (!issuedCert) {
      return NextResponse.json({ valid: false, error: "Invalid verification code" }, { status: 404 });
    }

    const answers = JSON.parse(issuedCert.response.answersJson || "{}");
    const questions = JSON.parse(issuedCert.response.form.schemaJson || "[]");

    const nameQuestion = questions.find((q: any) => q.label.toLowerCase().includes("name"));
    const recipientName = nameQuestion && answers[nameQuestion.id] ? answers[nameQuestion.id] : "Verified Participant";

    return NextResponse.json({
      valid: true,
      verificationCode: issuedCert.verificationCode,
      recipientName,
      formTitle: issuedCert.response.form.title,
      issuedAt: issuedCert.issuedAt,
      pdfUrl: issuedCert.pdfUrl,
      templateName: issuedCert.template.name,
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
