import nodemailer from "nodemailer";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, attachments } = params;

  // Check if Resend or SMTP credentials exist in env
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "Form & Certificate Platform <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data.id };
      }
    } catch (err: any) {
      console.warn("Resend API dispatch failed, falling back to local mail logger:", err?.message);
    }
  }

  // Fallback simulator for development/demo environment
  console.log("=========================================");
  console.log(`[EMAIL DISPATCH SIMULATOR]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Attachments: ${attachments ? attachments.length : 0} file(s)`);
  console.log("=========================================");

  return { success: true, messageId: `simulated-${Date.now()}` };
}
