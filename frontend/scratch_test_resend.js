const apiKey = "re_UFxNjpeL_5mp2VwyrCH9seqiwJqEK81PJ";

async function testResend() {
  console.log("Testing Resend API...");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Xyro Contact Form <onboarding@resend.dev>",
        to: "xyro.art17@gmail.com",
        reply_to: "test@example.com",
        subject: "Test Email from Antigravity Scratch Script",
        html: "<p>Hello world!</p>"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testResend();
