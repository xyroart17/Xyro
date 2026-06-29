import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const message = formData.get("message")?.toString().trim();

        // Server-side validation
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ success: false, error: "All fields are required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("Missing RESEND_API_KEY in environment variables.");
            return new Response(
                JSON.stringify({ success: false, error: "Mail server configuration error." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Call Resend REST API directly via fetch
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Xyro Contact Form <onboarding@resend.dev>",
                to: "xyro.art17@gmail.com",
                reply_to: email,
                subject: "New Project Inquiry — Xyro",
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #ff4d4d; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Project Inquiry — Xyro</h2>
                        <p style="margin: 15px 0;"><strong>Client Name:</strong> ${name}</p>
                        <p style="margin: 15px 0;"><strong>Client Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin: 15px 0;"><strong>Message:</strong></p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 1rem; line-height: 1.5; color: #333;">${message}</div>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 0.8rem; color: #999; margin: 0;">Submitted at: ${new Date().toUTCString()}</p>
                    </div>
                `
            })
        });

        const resData = await res.json() as any;

        if (!res.ok) {
            console.error("Resend API error response:", resData);
            return new Response(
                JSON.stringify({ success: false, error: resData.message || "Failed to send email." }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
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
