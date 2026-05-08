import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export async function sendPasswordResetEmail(to: string, resetUrl: string, name?: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialisation de votre mot de passe BearsCheck",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:24px;">
          <span style="font-size:28px;font-weight:800;color:#1A1A1A;letter-spacing:-0.5px;">🐻 BearsCheck</span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#FFFFFF;border-radius:16px;border:1px solid #E5D8BC;padding:40px 36px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A1A1A;">
            Réinitialisation du mot de passe
          </h1>
          <p style="margin:0 0 24px;color:#6B7280;font-size:15px;line-height:1.6;">
            Bonjour${name ? ` ${name}` : ""},<br>
            Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}"
               style="display:inline-block;background:#C9A84C;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;">
              Réinitialiser mon mot de passe →
            </a>
          </div>

          <p style="margin:0 0 8px;color:#9CA3AF;font-size:13px;line-height:1.5;">
            Ce lien est valable <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.
          </p>
          <p style="margin:0;color:#CBD5E1;font-size:12px;word-break:break-all;">
            Lien alternatif : ${resetUrl}
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;color:#9CA3AF;font-size:12px;">
            BearsCheck · Comparateur d'assurance auto · bearscheck.com
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
