import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "../../../config/env";

export const sendOtpEmail = async (toEmail, otp) => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: toEmail }],
      subject: "Your TalkHive password reset code",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:12px">
          <h2 style="color:#F97316;margin-bottom:8px">Password Reset</h2>
          <p style="color:#6B7280;margin-bottom:24px">Use the code below to reset your TalkHive password. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:#FFF7ED;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#F97316">${otp}</span>
          </div>
          <p style="color:#9CA3AF;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to send email");
  }
};
