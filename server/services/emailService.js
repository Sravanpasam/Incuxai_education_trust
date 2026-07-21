import resend from '../config/resend.js';

const EMAIL_FROM = process.env.EMAIL_FROM || 'info@incuxaieducationtrust.org';

/**
 * Build a professional HTML email body for OTP verification.
 */
function buildOtpHtml(name, otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#e94560;font-size:22px;letter-spacing:1px;">IncuXai Education Trust</h1>
              <p style="margin:6px 0 0;color:#a8a8b3;font-size:13px;">Work Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#333;font-size:15px;">Hello${name ? ' ' + name : ''},</p>
              <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
                We received a request to verify your work email address. Please use the
                following One-Time Password (OTP) to complete the verification:
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:16px 0 24px;">
                    <div style="display:inline-block;background:#f8f9fc;border:2px dashed #e94560;border-radius:10px;padding:18px 40px;">
                      <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#1a1a2e;font-family:'Courier New',monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#555;font-size:14px;line-height:1.6;">
                This OTP is valid for <strong>3 minutes</strong>. If you did not request
                this verification, please ignore this email.
              </p>

              <!-- Security Note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="background:#fff8e1;border-left:4px solid #ffb300;padding:14px 18px;border-radius:0 8px 8px 0;">
                    <p style="margin:0;color:#795548;font-size:13px;line-height:1.5;">
                      <strong>Security Note:</strong> Never share this OTP with anyone.
                      IncuXai Education Trust will never ask you for this code via phone or chat.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fc;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0 0 4px;color:#999;font-size:12px;">
                &copy; ${new Date().getFullYear()} IncuXai Education Trust. All rights reserved.
              </p>
              <p style="margin:0;color:#bbb;font-size:11px;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send OTP verification email using Resend.
 * @param {string} to - Recipient email address
 * @param {string} otp - The 6-digit OTP code
 * @param {string} [name] - Optional recipient name
 * @returns {object} Resend response or error
 */
export async function sendOtpEmail(to, otp, name = '') {
  const startTime = Date.now();
  const now = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  console.log(`[EmailService] OTP Generated: ${now()}`);
  console.log(`[EmailService] Email Send Started: ${now()} → To: ${to}`);

  try {
    const result = await resend.emails.send({
      from: `IncuXai Education Trust <${EMAIL_FROM}>`,
      to,
      subject: `Verify Your Work Email`,
      html: buildOtpHtml(name, otp),
    });

    const elapsed = Date.now() - startTime;
    console.log(`[EmailService] Email Sent: ${now()}`);
    console.log(`[EmailService] API Response Time: ${elapsed}ms`);
    console.log(`[EmailService] Resend Message ID: ${result.data?.id}`);
    console.log(`[EmailService] Resend Response:`, JSON.stringify(result.data));

    return { success: true, data: result.data };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[EmailService] Resend Error: ${error.message}`);
    console.error(`[EmailService] Failed After: ${elapsed}ms`);
    console.error(`[EmailService] Full Error:`, error);
    return { success: false, error: error.message };
  }
}
