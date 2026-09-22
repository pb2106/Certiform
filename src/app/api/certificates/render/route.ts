import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificateHtml } from "@/lib/certificate-renderer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const issuedCert = await prisma.certificateIssued.findUnique({
      where: { verificationCode: code },
      include: {
        response: {
          include: { form: true },
        },
        template: true,
      },
    });

    if (!issuedCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const placeholders = JSON.parse(issuedCert.template.placeholdersJson || "[]");
    const answers = JSON.parse(issuedCert.response.answersJson || "{}");
    const theme = JSON.parse(issuedCert.response.form.themeJson || "{}");

    const html = generateCertificateHtml({
      placeholders,
      answers,
      backgroundUrl: issuedCert.template.backgroundUrl || undefined,
      verificationCode: issuedCert.verificationCode,
      issuedAt: issuedCert.issuedAt,
      formTitle: issuedCert.response.form.title,
      theme,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
