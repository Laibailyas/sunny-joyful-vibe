import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubmissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  charityName: z.string().min(1).max(160),
  website: z.string().max(200).optional().default(""),
  instagram: z.string().max(200).optional().default(""),
  x: z.string().max(200).optional().default(""),
  tiktok: z.string().max(200).optional().default(""),
  region: z.string().min(1).max(80),
  category: z.string().min(1).max(80),
  message: z.string().max(1200).optional().default(""),
  terms: z.literal(true),
});

const NOTIFY_TO = "ameerrhamzaah389@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const submitCharity = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmissionSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const resendKey = process.env["RESEND_API_KEY"];

    const rows: [string, string][] = [
      ["Contact name", data.name],
      ["Email", data.email],
      ["Charity / campaign", data.charityName],
      ["Website", data.website],
      ["Instagram", data.instagram],
      ["X", data.x],
      ["TikTok", data.tiktok],
      ["Region", data.region],
      ["Category", data.category],
      ["Message", data.message],
    ];

    const html = `<h2>New Dotis charity submission</h2><table cellpadding="6">${rows
      .filter(([, value]) => value)
      .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`)
      .join("")}</table>`;

    if (!lovableKey || !resendKey) {
      console.error("Charity submission received but email is not configured yet", rows);
      return { ok: false as const, delivered: false as const };
    }

    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dotis <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        reply_to: data.email,
        subject: `Dotis charity submission — ${data.charityName}`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Resend request failed [${response.status}]: ${body}`);
      throw new Error(`Could not send the submission [${response.status}]: ${body}`);
    }

    return { ok: true as const, delivered: true as const };
  });
