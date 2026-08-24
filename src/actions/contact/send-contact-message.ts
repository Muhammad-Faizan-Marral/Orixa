"use server";

import { contactService } from "@/services/contact/contact.service";

export type ContactActionState = {
  success: boolean;
  message: string;
};

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export async function sendContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    await contactService.sendMessage({
      portfolioId:
        typeof formData.get("portfolioId") === "string"
          ? String(formData.get("portfolioId"))
          : "",

      visitorName:
        typeof formData.get("visitorName") === "string"
          ? String(formData.get("visitorName"))
          : "",

      visitorEmail:
        typeof formData.get("visitorEmail") === "string"
          ? String(formData.get("visitorEmail"))
          : "",

      subject:
        typeof formData.get("subject") === "string"
          ? String(formData.get("subject"))
          : "",

      message:
        typeof formData.get("message") === "string"
          ? String(formData.get("message"))
          : "",

      website:
        typeof formData.get("website") === "string"
          ? String(formData.get("website"))
          : "",
    });

    return {
      success: true,
      message: "Your message has been sent successfully.",
    };
  } catch (error) {
    console.error("[CONTACT_FORM]", error);

    /*
     * Don't expose internal errors to visitor.
     */
    if (
      error instanceof Error &&
      (error.message.includes("Name must") ||
        error.message.includes("Email") ||
        error.message.includes("Subject") ||
        error.message.includes("Message"))
    ) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Unable to send your message. Please try again.",
    };
  }
}
