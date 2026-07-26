import resend from '../config/resend.js';

const EMAIL_FROM = process.env.EMAIL_FROM || 'info@incuxaieducationtrust.org';
const SITE_URL = process.env.VITE_SITE_URL || 'https://incuxaieducationtrust.org';
const LOGO_URL = `${SITE_URL}/picss/iet%20logo.png`;

/**
 * Format OTP with spaces between digits for display.
 * "482913" → "4 8 2 9 1 3"
 */
function formatOtp(otp) {
  return otp.split('').join(' ');
}

/**
 * Build a premium HTML email body for OTP verification.
 * Inline CSS only — compatible with Gmail, Outlook, Yahoo, Apple Mail, and mobile.
 */
function buildOtpHtml(name, otp) {
  const displayName = name && name.trim() ? name.trim() : 'Learner';
  const currentYear = new Date().getFullYear();
  const formattedOtp = formatOtp(otp);

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Verify Your Email | IncuXAI Education Trust</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .center-on-narrow { text-align: center !important; display: block !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
      .padding-mobile { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F7FA;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">

  <!-- Preheader (hidden text for inbox preview) -->
  <div style="display:none;font-size:1px;color:#F5F7FA;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your verification code is ${otp}. It is valid for 3 minutes.
  </div>

  <!-- Full-width wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F5F7FA;">
    <tr>
      <td align="center" style="padding:40px 10px;">

        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" class="email-container" style="max-width:560px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(21,52,91,0.08);">

          <!-- ======================== HEADER ======================== -->
          <tr>
            <td style="background-color:#15345B;padding:36px 40px 30px;text-align:center;" class="padding-mobile">
              <!-- Logo -->
              <img src="${LOGO_URL}" alt="IncuXAI Education Trust" width="64" height="64" style="display:block;margin:0 auto 14px;border-radius:12px;" class="fluid" />
              <!-- Brand Name -->
              <h1 style="margin:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">
                IncuXAI Education Trust
              </h1>
              <!-- Subtitle -->
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);font-weight:400;">
                Email Verification
              </p>
            </td>
          </tr>

          <!-- ======================== GREETING ======================== -->
          <tr>
            <td style="padding:36px 40px 0;" class="padding-mobile">
              <p style="margin:0;font-size:16px;color:#15345B;font-weight:600;">
                Dear ${displayName},
              </p>
            </td>
          </tr>

          <!-- ======================== WELCOME MESSAGE ======================== -->
          <tr>
            <td style="padding:18px 40px 0;" class="padding-mobile">
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#15345B;">
                Welcome to IncuXAI Education Trust!
              </h2>
              <p style="margin:0 0 10px;font-size:14px;color:#4A5568;line-height:1.7;">
                Thank you for registering with IncuXAI Education Trust.
              </p>
              <p style="margin:0 0 10px;font-size:14px;color:#4A5568;line-height:1.7;">
                We're delighted to welcome you to our professional learning community and appreciate your interest in building your HR career with us.
              </p>
              <p style="margin:0;font-size:14px;color:#4A5568;line-height:1.7;">
                To securely complete your registration, please verify your email address using the One-Time Password (OTP) below.
              </p>
            </td>
          </tr>

          <!-- ======================== OTP SECTION ======================== -->
          <tr>
            <td style="padding:30px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color:#F5F7FA;border-radius:12px;padding:28px 24px;text-align:center;border:1px solid #E2E8F0;">
                    <!-- Label -->
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#9B7A3E;letter-spacing:2px;text-transform:uppercase;">
                      Your Verification Code
                    </p>
                    <!-- OTP Digits -->
                    <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:800;color:#15345B;letter-spacing:10px;line-height:1;">
                      ${formattedOtp}
                    </p>
                    <!-- Validity -->
                    <p style="margin:14px 0 0;font-size:12px;color:#9B7A3E;font-weight:500;">
                      This OTP is valid for <strong>3 minutes</strong> only.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ======================== VERIFICATION NOTICE ======================== -->
          <tr>
            <td style="padding:24px 40px 0;" class="padding-mobile">
              <p style="margin:0;font-size:14px;color:#4A5568;line-height:1.7;">
                Please enter this verification code on the registration page to verify your email address and complete your account creation.
              </p>
            </td>
          </tr>

          <!-- ======================== SECURITY BOX ======================== -->
          <tr>
            <td style="padding:24px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color:#FFF8E1;border-radius:10px;padding:20px 22px;border:1px solid #F5D98A;">
                    <!-- Security Title -->
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#9B7A3E;">
                      &#128274; Keep Your Verification Code Secure
                    </p>
                    <!-- Bullet Points -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#5A5040;line-height:1.6;">
                          &bull;&nbsp; Never share your OTP with anyone.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#5A5040;line-height:1.6;">
                          &bull;&nbsp; IncuXAI Education Trust will never ask for your OTP through phone calls, emails, messages, or social media.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#5A5040;line-height:1.6;">
                          &bull;&nbsp; If you requested this registration, simply enter the OTP on the verification screen.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#5A5040;line-height:1.6;">
                          &bull;&nbsp; If you did not request this registration, please ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ======================== CLOSING ======================== -->
          <tr>
            <td style="padding:28px 40px 0;" class="padding-mobile">
              <p style="margin:0 0 16px;font-size:14px;color:#4A5568;line-height:1.7;">
                We look forward to having you as a valued member of the IncuXAI Education Trust learning community.
              </p>
              <p style="margin:0 0 4px;font-size:14px;color:#15345B;font-weight:600;">
                Warm Regards,
              </p>
              <p style="margin:0;font-size:14px;color:#15345B;font-weight:700;">
                IncuXAI Education Trust
              </p>
            </td>
          </tr>

          <!-- ======================== DIVIDER ======================== -->
          <tr>
            <td style="padding:28px 40px 0;" class="padding-mobile">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top:1px solid #E2E8F0;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ======================== FOOTER ======================== -->
          <tr>
            <td style="padding:24px 40px 32px;" class="padding-mobile" align="center">
              <!-- Brand -->
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15345B;">
                IncuXAI Education Trust
              </p>
              <!-- Tagline -->
              <p style="margin:0 0 14px;font-size:11px;color:#9B7A3E;font-weight:500;letter-spacing:0.5px;">
                Empowering Talent &bull; Connecting Professionals &bull; Creating Opportunities
              </p>
              <!-- Auto notice -->
              <p style="margin:0 0 6px;font-size:11px;color:#94A3B8;line-height:1.5;">
                This is an automated email sent for account verification.<br/>
                Please do not reply to this email.
              </p>
              <!-- Copyright -->
              <p style="margin:0;font-size:11px;color:#94A3B8;">
                &copy; ${currentYear} IncuXAI Education Trust. All Rights Reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- / Email Container -->

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
      from: `IncuXAI Education Trust <${EMAIL_FROM}>`,
      to,
      subject: 'Verify Your Email | IncuXAI Education Trust',
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
