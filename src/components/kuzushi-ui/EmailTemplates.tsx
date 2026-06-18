export const confirmSignupEmailHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirm your Kuzushi Cafe account</title>
  </head>
  <body style="margin:0;background:#fafaf9;color:#18181b;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;margin:0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <img src="https://kuzushi.cafe/kuzushi-cafe.png" width="40" height="40" alt="Kuzushi Cafe" style="display:block;margin:0 0 20px;border:0;border-radius:8px;">
                <h1 style="margin:0;font-size:28px;line-height:1.15;font-style:italic;font-weight:900;color:#09090b;">Confirm your email</h1>
                <p style="margin:16px 0 0;font-size:16px;line-height:1.65;color:#52525b;">Finish creating your Kuzushi Cafe account so your journal stays connected to this email address.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;padding:13px 18px;">Confirm email</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">If you did not create a Kuzushi Cafe account, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const signInWithLinkEmailHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign in to Kuzushi Cafe</title>
  </head>
  <body style="margin:0;background:#fafaf9;color:#18181b;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;margin:0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <img src="https://kuzushi.cafe/kuzushi-cafe.png" width="40" height="40" alt="Kuzushi Cafe" style="display:block;margin:0 0 20px;border:0;border-radius:8px;">
                <h1 style="margin:0;font-size:28px;line-height:1.15;font-style:italic;font-weight:900;color:#09090b;">Sign in to your journal</h1>
                <p style="margin:16px 0 0;font-size:16px;line-height:1.65;color:#52525b;">Use this one-time link to continue to Kuzushi Cafe. The link expires soon and can only be used once.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;padding:13px 18px;">Sign in to Kuzushi Cafe</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">If you did not request this email, you can ignore it.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

function EmailTemplatePreview({ html }: { html: string }) {
  return (
    <iframe
      className="h-[520px] w-full rounded-lg border border-zinc-200 bg-white"
      sandbox=""
      srcDoc={html}
      title="Email template preview"
    />
  );
}

export function ConfirmSignupEmailTemplate() {
  return <EmailTemplatePreview html={confirmSignupEmailHtml} />;
}

export function SignInWithLinkEmailTemplate() {
  return <EmailTemplatePreview html={signInWithLinkEmailHtml} />;
}
