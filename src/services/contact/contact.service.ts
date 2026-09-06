import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, secondsLeft } from "@/lib/rate-limit";
import { portfolioRepository } from "@/repositories/portfolio.repository";

import {
  contactFormSchema,
  type ContactFormInput,
} from "@/validations/contact.schema";

import { createContactEmail } from "@/features/contact/contact-email";

export class ContactService {
  async sendMessage(input: ContactFormInput) {
    /*
     * 1. SERVER-SIDE VALIDATION
     */
    const data = contactFormSchema.parse(input);

    /*
     * 2. HONEYPOT
     */
    if (data.website && data.website.trim().length > 0) {
      throw new Error("Unable to submit contact form.");
    }

    /*
     * 2b. RATE LIMIT (anti-spam)
     */
    const emailKey = data.visitorEmail.trim().toLowerCase();
    const rateKey = `contact:${data.portfolioId}:${emailKey}`;

    const memory = rateLimit({
      key: rateKey,
      limit: 1,
      windowMs: 30_000,
    });

    if (!memory.success) {
      throw new Error(
        `Please wait ${secondsLeft(memory.retryAfterMs)} seconds before sending another message.`,
      );
    }

    // DB source of truth
    const windowStart = new Date(Date.now() - 30_000).toISOString();

    const { data: recent, error: recentError } = await supabaseAdmin
      .from("contact_messages")
      .select("id, created_at")
      .eq("portfolio_id", data.portfolioId)
      .eq("visitor_email", emailKey)
      .gte("created_at", windowStart)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentError) {
      console.error("[CONTACT_FORM] rate-limit DB check failed:", recentError);
    } else if (recent && recent.length > 0) {
      const lastAt = new Date(recent[0].created_at).getTime();
      const retryAfterMs = Math.max(0, lastAt + 30_000 - Date.now());
      throw new Error(
        `Please wait ${secondsLeft(retryAfterMs)} seconds before sending another message.`,
      );
    }

    /*
     * 3. FIND PORTFOLIO
     */
    const portfolio = await portfolioRepository.findById(data.portfolioId);
    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    /*
     * 4. ONLY PUBLISHED PORTFOLIOS
     */
    if (portfolio.status !== "published") {
      throw new Error("This portfolio is not available.");
    }

    /*
     * 5. FIND OWNER
     */
    const owner = await portfolioRepository.findOwnerByPortfolioId(
      portfolio.id,
    );
    if (!owner) {
      throw new Error("Portfolio owner not found.");
    }

    /*
     * 6. GET ORIGINAL SUPABASE AUTH EMAIL
     */
    const { data: authUserData, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(owner.userId);

    if (authError || !authUserData.user?.email) {
      console.error("Unable to retrieve portfolio owner email:", authError);
      throw new Error("Unable to deliver your message.");
    }

    const ownerEmail = authUserData.user.email;

    /*
     * 7. APP URL
     */
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
    }

    const normalizedAppUrl = appUrl.replace(/\/$/, "");
    const portfolioUrl = `${normalizedAppUrl}/${owner.username}/${portfolio.slug}`;

    /*
     * 8. CREATE EMAIL
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
     * 9. RESEND FROM ADDRESS
     */
    const from = process.env.RESEND_FROM_EMAIL;
    if (!from) {
      throw new Error("RESEND_FROM_EMAIL is not configured.");
    }

    /*
     * 10. SEND EMAIL
     */
    const { data: result, error } = await resend.emails.send({
      from,
      to: [ownerEmail],
      replyTo: data.visitorEmail,
      subject: email.subject,
      html: email.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Unable to send your message. Please try again.");
    }

    /*
     * 11. SAVE MESSAGE TO DB
     */
    try {
      await supabaseAdmin.from("contact_messages").insert({
        portfolio_id: data.portfolioId,
        visitor_name: data.visitorName,
        visitor_email: emailKey,
        subject: data.subject || null,
        message: data.message,
        status: "unread",
      });
    } catch (dbError) {
      console.error("[CONTACT_FORM] Failed to save message to DB:", dbError);
    }

    return {
      emailId: result?.id ?? null,
    };
  }
}

export const contactService = new ContactService();