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

  return {
    subject: `New message from ${visitorName}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>New Portfolio Message</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 640px;
              margin: 40px auto;
              padding: 20px;
            "
          >
            <div
              style="
                background: #ffffff;
                border: 1px solid #e5e5e5;
                border-radius: 12px;
                padding: 32px;
              "
            >
              <h1
                style="
                  margin: 0 0 8px;
                  font-size: 24px;
                  color: #111111;
                "
              >
                New message from your portfolio
              </h1>

              <p
                style="
                  margin: 0 0 28px;
                  color: #666666;
                  font-size: 14px;
                "
              >
                Someone contacted you through
                <strong>${safeTitle}</strong>.
              </p>

              <div
                style="
                  background: #f8f8f8;
                  border-radius: 8px;
                  padding: 16px;
                  margin-bottom: 24px;
                "
              >
                <p style="margin: 0 0 10px;">
                  <strong>Name:</strong>
                  ${safeName}
                </p>

                <p style="margin: 0 0 10px;">
                  <strong>Email:</strong>
                  ${safeEmail}
                </p>

                <p style="margin: 0;">
                  <strong>Subject:</strong>
                  ${safeSubject}
                </p>
              </div>

              <h2
                style="
                  font-size: 16px;
                  color: #111111;
                  margin: 0 0 10px;
                "
              >
                Message
              </h2>

              <div
                style="
                  padding: 16px;
                  background: #fafafa;
                  border-left: 3px solid #111111;
                  color: #333333;
                  line-height: 1.7;
                "
              >
                ${safeMessage}
              </div>

              <div
                style="
                  margin-top: 28px;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #777777;
                    font-size: 13px;
                  "
                >
                  Portfolio:
                  <a
                    href="${safeUrl}"
                    style="color: #111111;"
                  >
                    ${safeUrl}
                  </a>
                </p>
              </div>
            </div>

            <p
              style="
                text-align: center;
                color: #999999;
                font-size: 12px;
                margin-top: 20px;
              "
            >
              Sent through Orixa.
            </p>
          </div>
        </body>
      </html>
    `,
  };
}
