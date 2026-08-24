import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { portfolioRepository } from "@/repositories/portfolio.repository";

import {
  contactFormSchema,
  type ContactFormInput,
} from "@/validations/contact.schema";

import { createContactEmail } from "@/features/contact/contact-email";

export class ContactService {
  async sendMessage(input: ContactFormInput) {
    /*
     * ----------------------------------------
     * 1. SERVER-SIDE VALIDATION
     * ----------------------------------------
     */

    const data = contactFormSchema.parse(input);

    /*
     * ----------------------------------------
     * 2. HONEYPOT
     * ----------------------------------------
     */

    if (data.website) {
      throw new Error("Unable to submit contact form.");
    }

    /*
     * ----------------------------------------
     * 3. FIND PORTFOLIO
     * ----------------------------------------
     */

    const portfolio = await portfolioRepository.findById(data.portfolioId);

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    /*
     * ----------------------------------------
     * 4. ONLY PUBLISHED PORTFOLIOS
     * ----------------------------------------
     */

    if (portfolio.status !== "published") {
      throw new Error("This portfolio is not available.");
    }

    /*
     * ----------------------------------------
     * 5. FIND OWNER
     * ----------------------------------------
     *
     * portfolio
     *    ↓
     * profile
     *    ↓
     * userId
     */

    const owner = await portfolioRepository.findOwnerByPortfolioId(
      portfolio.id,
    );

    if (!owner) {
      throw new Error("Portfolio owner not found.");
    }

    /*
     * ----------------------------------------
     * 6. GET ORIGINAL SUPABASE AUTH EMAIL
     * ----------------------------------------
     */

    const { data: authUserData, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(owner.userId);

    if (authError || !authUserData.user?.email) {
      console.error("Unable to retrieve portfolio owner email:", authError);

      throw new Error("Unable to deliver your message.");
    }

    const ownerEmail = authUserData.user.email;

    /*
     * ----------------------------------------
     * 7. APP URL
     * ----------------------------------------
     */

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
    }

    /*
     * Remove trailing slash.
     */
    const normalizedAppUrl = appUrl.replace(/\/$/, "");

    const portfolioUrl = `${normalizedAppUrl}/${owner.username}/${portfolio.slug}`;

    /*
     * ----------------------------------------
     * 8. CREATE EMAIL
     * ----------------------------------------
     */

    const email = createContactEmail({
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      subject: data.subject ?? "",
      message: data.message,
      portfolioTitle: portfolio.title,
      portfolioUrl,
    });

    /*
     * ----------------------------------------
     * 9. RESEND FROM ADDRESS
     * ----------------------------------------
     */

    const from = process.env.RESEND_FROM_EMAIL;

    if (!from) {
      throw new Error("RESEND_FROM_EMAIL is not configured.");
    }

    /*
     * ----------------------------------------
     * 10. SEND EMAIL
     * ----------------------------------------
     */

    const { data: result, error } = await resend.emails.send({
      from,

      /*
       * OWNER'S ORIGINAL AUTH EMAIL
       */
      to: [ownerEmail],

      /*
       * Gmail Reply button:
       *
       * Owner
       *   ↓ Reply
       * Visitor email
       */
      replyTo: data.visitorEmail,

      subject: email.subject,

      html: email.html,
    });

    /*
     * ----------------------------------------
     * 11. RESEND ERROR
     * ----------------------------------------
     */

    if (error) {
      console.error("Resend error:", error);

      throw new Error("Unable to send your message. Please try again.");
    }

    return {
      emailId: result?.id ?? null,
    };
  }
}

export const contactService = new ContactService();
