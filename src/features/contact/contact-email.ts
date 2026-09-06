import { escapeHtml } from "@/utils/email";

type ContactEmailData = {
  visitorName: string;
  visitorEmail: string;
  subject: string;
  message: string;
  portfolioTitle: string;
  portfolioUrl: string;
};

export function createContactEmail({
  visitorName,
  visitorEmail,
  subject,
  message,
  portfolioTitle,
  portfolioUrl,
}: ContactEmailData) {
  const safeName = escapeHtml(visitorName);
  const safeEmail = escapeHtml(visitorEmail);
  const safeSubject = escapeHtml(subject || "New portfolio message");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeTitle = escapeHtml(portfolioTitle);
  const safeUrl = escapeHtml(portfolioUrl);

  const accent = "#6c5cff";

  return {
    subject: `New message from ${visitorName}${subject ? ` — ${subject}` : ""}`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background:#0b0b0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121218;border:1px solid #1e1e28;border-radius:16px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #1e1e28;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${accent};font-weight:600;">
                      Orixa
                    </p>
                    <h1 style="margin:0;font-size:22px;line-height:1.3;color:#f5f5f7;font-weight:600;">
                      New portfolio message
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#a1a1aa;">
                Someone reached out through
                <strong style="color:#e4e4e7;">${safeTitle}</strong>.
              </p>
            </td>
          </tr>

          <!-- Meta card -->
          <tr>
            <td style="padding:16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a22;border:1px solid #262632;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 12px;font-size:13px;color:#a1a1aa;">
                      <span style="display:inline-block;min-width:64px;color:#71717a;">Name</span>
                      <span style="color:#f5f5f7;font-weight:500;">${safeName}</span>
                    </p>
                    <p style="margin:0 0 12px;font-size:13px;color:#a1a1aa;">
                      <span style="display:inline-block;min-width:64px;color:#71717a;">Email</span>
                      <a href="mailto:${safeEmail}" style="color:${accent};text-decoration:none;font-weight:500;">${safeEmail}</a>
                    </p>
                    <p style="margin:0;font-size:13px;color:#a1a1aa;">
                      <span style="display:inline-block;min-width:64px;color:#71717a;">Subject</span>
                      <span style="color:#f5f5f7;font-weight:500;">${safeSubject}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:8px 32px 24px;">
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#71717a;font-weight:600;">
                Message
              </p>
              <div style="padding:18px 20px;background:#1a1a22;border-left:3px solid ${accent};border-radius:0 12px 12px 0;font-size:14px;line-height:1.7;color:#e4e4e7;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 28px;">
              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject || "Your message")}"
                 style="display:inline-block;padding:12px 22px;background:${accent};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:10px;">
                Reply to ${safeName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;border-top:1px solid #1e1e28;background:#0f0f14;">
              <p style="margin:0 0 6px;font-size:12px;color:#71717a;">
                Portfolio:
                <a href="${safeUrl}" style="color:#a1a1aa;text-decoration:underline;">${safeUrl}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                Sent via OrixaAi · Reply directly to this email to respond to the visitor.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}
