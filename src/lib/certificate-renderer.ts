import { CertificatePlaceholder, FormTheme } from "./types";

export interface RenderCertificateParams {
  placeholders: CertificatePlaceholder[];
  answers: Record<string, any>;
  backgroundUrl?: string;
  verificationCode: string;
  issuedAt: Date;
  formTitle: string;
  theme?: FormTheme;
}

export function generateCertificateHtml(params: RenderCertificateParams): string {
  const { placeholders, answers, backgroundUrl, verificationCode, issuedAt, formTitle, theme } = params;

  const bgStyle = backgroundUrl
    ? `background-image: url('${backgroundUrl}'); background-size: cover; background-position: center;`
    : `background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);`;

  const renderedElements = placeholders.map((p) => {
    let displayValue = "";

    switch (p.type) {
      case "static":
        displayValue = p.text || "";
        break;
      case "variable":
        displayValue = p.fieldId && answers[p.fieldId] ? String(answers[p.fieldId]) : p.fallbackText || "";
        break;
      case "system_date":
        displayValue = `${p.prefix || ""}${new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}${p.suffix || ""}`;
        break;
      case "system_code":
        displayValue = `${p.prefix || ""}${verificationCode}${p.suffix || ""}`;
        break;
      case "qr_code":
        displayValue = `<div style="padding: 6px; background: white; border-radius: 8px; display: inline-block;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
          (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/verify/" + verificationCode
        )}" width="80" height="80" alt="QR Verify" /></div>`;
        break;
    }

    const textAlign = p.align || "center";
    const transformX = textAlign === "center" ? "-50%" : textAlign === "right" ? "-100%" : "0%";

    return `
      <div style="
        position: absolute;
        left: ${p.x}%;
        top: ${p.y}%;
        transform: translate(${transformX}, -50%);
        font-size: ${p.fontSize}px;
        font-weight: ${p.fontWeight || "normal"};
        color: ${p.color || "#0f172a"};
        text-align: ${textAlign};
        white-space: nowrap;
        font-family: ${theme?.fontFamily || "Inter"}, sans-serif;
        text-shadow: 0 1px 2px rgba(255,255,255,0.8);
      ">
        ${displayValue}
      </div>
    `;
  }).join("");

  const watermarkHtml = theme?.watermark?.text
    ? `<div style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: ${theme.watermark.opacity || 0.05};
        transform: rotate(${theme.watermark.rotation || -20}deg);
        font-size: 72px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 4px;
      ">${theme.watermark.text}</div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Certificate - ${verificationCode}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; font-family: 'Inter', sans-serif; }
        .cert-canvas {
          position: relative;
          width: 1050px;
          height: 742px; /* A4 Landscape Ratio */
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          ${bgStyle}
        }
        .cert-border {
          position: absolute;
          inset: 24px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          pointer-events: none;
        }
        .verify-badge {
          position: absolute;
          bottom: 24px;
          right: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="cert-canvas">
        <div class="cert-border"></div>
        ${watermarkHtml}
        ${renderedElements}
        <div class="verify-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Verifiable Credential: ${verificationCode}
        </div>
      </div>
    </body>
    </html>
  `;
}
