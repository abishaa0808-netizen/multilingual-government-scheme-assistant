import nodemailer from 'nodemailer';

export interface OtpDispatchResult {
  delivered: boolean;
  channel: 'email' | 'mobile';
  provider?: string;
  message: string;
  recipient: string;
  previewOtp?: string; // Provided when in development or before external keys are configured
}

/**
 * Creates a reusable nodemailer transporter if SMTP environment variables exist.
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Dispatches a real OTP to an actual email address via SMTP or Resend API.
 */
export async function dispatchEmailOtp(
  email: string,
  otpCode: string,
  purpose: string = 'signin'
): Promise<OtpDispatchResult> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Try Resend API if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM || 'National Schemes Portal <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: cleanEmail,
          subject: `Your One-Time Password (OTP) for National Welfare Portal: ${otpCode}`,
          html: generateOtpHtmlEmail(cleanEmail, otpCode, purpose),
        }),
      });

      if (res.ok) {
        console.log(`[REAL-EMAIL-DELIVERED] Sent via Resend to ${cleanEmail}`);
        return {
          delivered: true,
          channel: 'email',
          provider: 'Resend',
          recipient: cleanEmail,
          message: `Original OTP has been dispatched to your email address (${cleanEmail}). Please check your inbox and spam folder.`,
        };
      } else {
        const errText = await res.text();
        console.warn(`Resend API dispatch failed: ${errText}`);
      }
    } catch (e: any) {
      console.warn('Resend email error:', e?.message);
    }
  }

  // 2. Try Nodemailer SMTP (Gmail, SendGrid, Outlook, Brevo, or custom SMTP)
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const fromAddr =
        process.env.SMTP_FROM || `"National Schemes Portal" <${process.env.SMTP_USER}>`;

      await transporter.sendMail({
        from: fromAddr,
        to: cleanEmail,
        subject: `Your Verification OTP: ${otpCode} - National Welfare Portal`,
        text: `Your one-time verification code for National Welfare Scheme Portal is: ${otpCode}. It is valid for 10 minutes. Do not share this code with anyone.`,
        html: generateOtpHtmlEmail(cleanEmail, otpCode, purpose),
      });

      console.log(`[REAL-EMAIL-DELIVERED] Sent via SMTP to ${cleanEmail}`);
      return {
        delivered: true,
        channel: 'email',
        provider: 'SMTP',
        recipient: cleanEmail,
        message: `Original OTP has been sent to your email: ${cleanEmail}. Please check your inbox.`,
      };
    } catch (err: any) {
      console.error(`[SMTP-ERROR] Failed to send email to ${cleanEmail}:`, err?.message);
    }
  }

  // 3. Fallback when SMTP / Resend keys are not yet configured in .env
  console.log(`[EMAIL-OTP] To: ${cleanEmail} | Code: ${otpCode} | (Configure SMTP_USER & SMTP_PASS in .env for live dispatch)`);

  return {
    delivered: false,
    channel: 'email',
    recipient: cleanEmail,
    previewOtp: otpCode,
    message: `Ready for live delivery. To send real emails worldwide, configure SMTP_USER & SMTP_PASS in .env (or your hosting settings). For current testing, your OTP code is ${otpCode}.`,
  };
}

/**
 * Dispatches a real OTP to an actual mobile number via Twilio, Fast2SMS, or MSG91.
 */
export async function dispatchSmsOtp(
  mobileNumber: string,
  otpCode: string,
  _purpose: string = 'signin'
): Promise<OtpDispatchResult> {
  const cleanMobile = mobileNumber.replace(/\D/g, '');

  // 1. Try Twilio if configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const formattedNumber = cleanMobile.startsWith('91') || cleanMobile.startsWith('+')
        ? cleanMobile.startsWith('+') ? cleanMobile : `+${cleanMobile}`
        : `+91${cleanMobile}`;

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const authHeader = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

      const bodyData = new URLSearchParams();
      bodyData.append('To', formattedNumber);
      bodyData.append('From', process.env.TWILIO_PHONE_NUMBER);
      bodyData.append('Body', `Your OTP for National Welfare Schemes Portal is ${otpCode}. Valid for 10 minutes. Do not share with anyone.`);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyData.toString(),
      });

      if (res.ok) {
        console.log(`[REAL-SMS-DELIVERED] Sent via Twilio to ${formattedNumber}`);
        return {
          delivered: true,
          channel: 'mobile',
          provider: 'Twilio',
          recipient: formattedNumber,
          message: `Original OTP has been dispatched via SMS to your phone: ${formattedNumber}.`,
        };
      } else {
        const errText = await res.text();
        console.warn(`Twilio SMS dispatch failed: ${errText}`);
      }
    } catch (e: any) {
      console.warn('Twilio SMS error:', e?.message);
    }
  }

  // 2. Try Fast2SMS (Indian instant OTP SMS API)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otpCode,
          route: 'otp',
          numbers: cleanMobile.slice(-10),
        }),
      });

      if (res.ok) {
        console.log(`[REAL-SMS-DELIVERED] Sent via Fast2SMS to ${cleanMobile}`);
        return {
          delivered: true,
          channel: 'mobile',
          provider: 'Fast2SMS',
          recipient: cleanMobile,
          message: `Original OTP has been sent via SMS to your phone: ${cleanMobile}.`,
        };
      }
    } catch (e: any) {
      console.warn('Fast2SMS error:', e?.message);
    }
  }

  // 3. Fallback when SMS gateway keys are not yet configured in .env
  console.log(`[SMS-OTP] To: ${cleanMobile} | Code: ${otpCode} | (Configure TWILIO or FAST2SMS keys in .env for live SMS)`);

  return {
    delivered: false,
    channel: 'mobile',
    recipient: cleanMobile,
    previewOtp: otpCode,
    message: `Ready for live delivery. To send real SMS worldwide, configure Twilio or Fast2SMS in .env (or your hosting settings). For current testing, your OTP code is ${otpCode}.`,
  };
}

/**
 * Beautiful HTML email template for authentic citizen verification
 */
function generateOtpHtmlEmail(email: string, otpCode: string, purpose: string): string {
  const actionText = purpose === 'signup' ? 'Citizen Registration' : 'Account Sign In';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your One-Time Password (OTP)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #0f172a; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #d97706; }
    .header-title { font-size: 18px; font-weight: bold; margin: 0; }
    .header-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .content { padding: 32px 28px; text-align: center; }
    .lead { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #f8fafc; border: 2px dashed #d97706; border-radius: 10px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px; }
    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace; }
    .timer { font-size: 12px; color: #64748b; margin-top: 6px; }
    .warning { font-size: 12px; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; text-align: left; line-height: 1.5; }
    .footer { background: #f8fafc; padding: 18px 28px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-title">National Welfare Scheme Portal</div>
      <div class="header-sub">Official Citizen Identity & Verification Gateway • e-Pramaan</div>
    </div>
    <div class="content">
      <div class="lead">
        A request was made for <strong>${actionText}</strong> for <strong>${email}</strong>.<br/>
        Please use the following One-Time Password (OTP) to complete your verification:
      </div>
      <div class="otp-box">
        <div class="otp-code">${otpCode}</div>
        <div class="timer">Valid for 10 minutes (Single Use Only)</div>
      </div>
      <div class="warning">
        <strong>Security Notice:</strong> Never share this OTP with anyone, including government officials or bank representatives. If you did not request this verification, please ignore this email.
      </div>
    </div>
    <div class="footer">
      Designed for citizen accessibility under the Digital India initiative.<br/>
      Official notifications originate only from verified portals.
    </div>
  </div>
</body>
</html>
  `;
}
