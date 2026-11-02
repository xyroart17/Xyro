import type { APIRoute } from "astro";

export const prerender = false;

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return match;
    }
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    let name = "";
    let email = "";
    let message = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await request.json().catch(() => ({}));
      name = (json.name || "").trim();
      email = (json.email || "").trim();
      message = (json.message || "").trim();
    } else {
      const formData = await request.formData();
      name = (formData.get("name")?.toString() || "").trim();
      email = (formData.get("email")?.toString() || "").trim();
      message = (formData.get("message")?.toString() || "").trim();
    }

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Please fill in all fields (name, email, and project brief)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Common typo suggestions
    const emailDomain = email.split("@")[1]?.toLowerCase();
    const typos: Record<string, string> = {
      "gmail.co": "gmail.com",
      "gmail.con": "gmail.com",
      "gmail.cm": "gmail.com",
      "gamil.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "hotmale.com": "hotmail.com"
    };
    if (emailDomain && typos[emailDomain]) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Did you mean @${typos[emailDomain]}? Please check your email spelling.` 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    let resendApiKey = "";
    try {
      const cf = await import("cloudflare:workers");
      if (cf?.env?.RESEND_API_KEY) {
        resendApiKey = cf.env.RESEND_API_KEY;
      }
    } catch {
      // Not in Cloudflare Workers context
    }
    if (!resendApiKey && typeof process !== "undefined" && process.env?.RESEND_API_KEY) {
      resendApiKey = process.env.RESEND_API_KEY;
    }
    if (!resendApiKey && (import.meta as any).env?.RESEND_API_KEY) {
      resendApiKey = (import.meta as any).env.RESEND_API_KEY;
    }

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return new Response(
        JSON.stringify({ success: false, error: "Mail server configuration error." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Xyro Commission Form <onboarding@resend.dev>",
        to: "officialxyroart@gmail.com",
        reply_to: email,
        subject: `New Commission Brief from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #111111; border: 3px solid #111111; border-radius: 4px; box-shadow: 6px 6px 0 #111111;">
            <div style="background: #ff2a4b; color: #ffffff; padding: 14px 18px; font-weight: 900; font-size: 20px; letter-spacing: -0.5px; border-radius: 2px; margin-bottom: 22px;">
              ⚡ NEW COMMISSION BRIEF
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666;">Client Name</span>
              <div style="font-weight: 800; font-size: 18px; margin-top: 2px;">${safeName}</div>
            </div>
            <div style="margin-bottom: 20px;">
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666;">Client Email (Click to Reply)</span>
              <div style="font-weight: 700; font-size: 18px; margin-top: 2px;">
                <a href="mailto:${safeEmail}" style="color: #ff2a4b; text-decoration: underline;">${safeEmail}</a>
              </div>
            </div>
            <div style="margin-bottom: 22px;">
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666666;">Project Brief / Notes</span>
              <div style="background: #f8f8f8; padding: 16px; border-left: 4px solid #ff2a4b; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #222222; margin-top: 6px; border-radius: 2px;">${safeMessage}</div>
            </div>
            <div style="border-top: 1px solid #eeeeee; padding-top: 14px; font-size: 12px; color: #888888; display: flex; justify-content: space-between;">
              <span>Submitted via xyroart.pages.dev</span>
              <span>${new Date().toUTCString()}</span>
            </div>
          </div>
        `
      })
    });

    const resData = (await res.json()) as any;

    if (!res.ok) {
      console.error("Resend API error response:", resData);
      return new Response(
        JSON.stringify({ success: false, error: resData.message || "Failed to send email." }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resData.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error in contact API route:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Internal server error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
