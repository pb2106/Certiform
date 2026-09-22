import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateZodSchema } from "@/lib/zod-schema-builder";
import { QuestionConfig } from "@/lib/types";
import { sendEmail } from "@/lib/email-service";
import { generateCertificateHtml } from "@/lib/certificate-renderer";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: { certificateTemplates: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "live") {
      return NextResponse.json({ error: "This form is not currently accepting submissions." }, { status: 400 });
    }

    // Check Open/Close Schedule
    const now = new Date();
    if (form.openAt && now < new Date(form.openAt)) {
      return NextResponse.json({ error: "This form is scheduled to open later." }, { status: 400 });
    }
    if (form.closeAt && now > new Date(form.closeAt)) {
      return NextResponse.json({ error: "This form is closed for new submissions." }, { status: 400 });
    }

    // Check Response Limits
    if (form.responseLimit) {
      const responseCount = await prisma.response.count({
        where: { formId: form.id },
      });
      if (responseCount >= form.responseLimit) {
        return NextResponse.json({ error: "Response limit reached for this form." }, { status: 400 });
      }
    }

    const body = await req.json();
    const { answers, respondentEmail } = body;

    // Server-side Zod Validation
    const questions: QuestionConfig[] = JSON.parse(form.schemaJson || "[]");
    const zodSchema = generateZodSchema(questions);

    const validationResult = zodSchema.safeParse(answers);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 422 }
      );
    }

    // Find email question value if respondentEmail not directly passed
    let email = respondentEmail;
    if (!email) {
      const emailQuestion = questions.find((q) => q.type === "email");
      if (emailQuestion && answers[emailQuestion.id]) {
        email = answers[emailQuestion.id];
      }
    }

    // Transactional Response Creation
    const responseRecord = await prisma.response.create({
      data: {
        formId: form.id,
        respondentEmail: email || null,
        answersJson: JSON.stringify(answers),
        status: "approved",
      },
    });

    let certificateData = null;

    // Async Certificate Generation & Email Queue Trigger
    if (form.certificateTemplates && form.certificateTemplates.length > 0) {
      const template = form.certificateTemplates[0];
      const placeholders = JSON.parse(template.placeholdersJson || "[]");
      const verificationCode = `CERT-${form.id.substring(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

      const issuedCert = await prisma.certificateIssued.create({
        data: {
          responseId: responseRecord.id,
          templateId: template.id,
          pdfUrl: `/api/certificates/render?code=${verificationCode}`,
          verificationCode,
        },
      });

      certificateData = {
        verificationCode,
        pdfUrl: issuedCert.pdfUrl,
      };

      // Dispatch Confirmation & Certificate Email
      if (email) {
        const nameQuestion = questions.find((q) => q.label.toLowerCase().includes("name"));
        const respondentName = nameQuestion && answers[nameQuestion.id] ? answers[nameQuestion.id] : "Participant";

        const certHtml = generateCertificateHtml({
          placeholders,
          answers,
          backgroundUrl: template.backgroundUrl || undefined,
          verificationCode,
          issuedAt: new Date(),
          formTitle: form.title,
        });

        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #059669; margin-bottom: 8px;">Submission Confirmed!</h2>
            <p style="color: #334155; font-size: 16px;">Hi <strong>${respondentName}</strong>,</p>
            <p style="color: #475569; line-height: 1.6; margin-top: 12px;">
              Thank you for completing <strong>${form.title}</strong>. Your response has been recorded successfully.
            </p>
            <div style="margin: 24px 0; padding: 16px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px;">
              <p style="margin: 0; font-weight: bold; color: #065f46;">Your Verifiable Credential:</p>
              <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 18px; color: #047857;">${verificationCode}</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${verificationCode}" style="display: inline-block; padding: 12px 24px; background: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">View & Verify Certificate</a>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: `Submission Receipt & Digital Certificate: ${form.title}`,
          html: emailBody,
        });

        await prisma.emailLog.create({
          data: {
            responseId: responseRecord.id,
            type: "certificate_issued",
            status: "sent",
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Response submitted successfully!",
        responseId: responseRecord.id,
        certificate: certificateData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
