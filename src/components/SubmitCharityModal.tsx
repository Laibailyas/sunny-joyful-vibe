import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { submitCharity } from "@/lib/submit-charity.functions";

const OPEN_EVENT = "dotis:open-submit";

export function openSubmitDialog() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "Latin America & Caribbean",
  "Middle East",
  "North America",
  "Oceania",
  "Global / multiple regions",
];

const CATEGORIES = ["Animal rescue", "Food aid", "Disaster response", "Poverty relief", "Other"];

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-flare";
const labelClass = "font-stamp text-[0.6rem] uppercase tracking-[0.24em] text-ink/55";

export function SubmitCharityModal() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const send = useServerFn(submitCharity);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      charityName: String(data.get("charityName") ?? ""),
      website: String(data.get("website") ?? ""),
      instagram: String(data.get("instagram") ?? ""),
      x: String(data.get("x") ?? ""),
      tiktok: String(data.get("tiktok") ?? ""),
      region: String(data.get("region") ?? ""),
      category: String(data.get("category") ?? ""),
      message: String(data.get("message") ?? ""),
      terms: true as const,
    };

    setSending(true);
    try {
      const result = await send({ data: payload });
      if (result.delivered) {
        toast.success("Submission received. We'll be in touch by email.");
      } else {
        toast.success("Submission received. We'll follow up by email shortly.");
      }
      form.reset();
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92svh] max-w-2xl overflow-y-auto rounded-3xl border-ink/10 bg-paper p-6 text-ink sm:p-8">
        <DialogHeader className="text-left">
          <span className="inline-block w-fit bg-tape px-4 py-1.5 font-stamp text-[0.6rem] uppercase tracking-[0.28em]">
            Start your own campaign
          </span>
          <DialogTitle className="mt-4 font-display text-[clamp(1.7rem,5vw,2.6rem)] uppercase leading-[0.95]">
            Submit your local <span className="text-flare">charity</span>
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-ink/70">
            Tell us about the cause. Once verified, you get your own Dotis link so your community can support the
            campaign directly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-2 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={labelClass}>Your name*</span>
            <input name="name" required className={fieldClass} placeholder="Jane Doe" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Email*</span>
            <input name="email" type="email" required className={fieldClass} placeholder="you@email.com" />
          </label>
          <label className="grid gap-1.5 sm:col-span-2">
            <span className={labelClass}>Charity or campaign name*</span>
            <input name="charityName" required className={fieldClass} placeholder="Street Dogs Karachi" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Charity website</span>
            <input name="website" className={fieldClass} placeholder="https://" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Instagram</span>
            <input name="instagram" className={fieldClass} placeholder="@handle or link" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>X (Twitter)</span>
            <input name="x" className={fieldClass} placeholder="@handle or link" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>TikTok</span>
            <input name="tiktok" className={fieldClass} placeholder="@handle or link" />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Where it works*</span>
            <select name="region" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Select a region
              </option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Category*</span>
            <select name="category" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 sm:col-span-2">
            <span className={labelClass}>Anything else</span>
            <textarea name="message" rows={3} className={fieldClass} placeholder="Tell us about the work you do." />
          </label>

          <label className="flex items-start gap-3 sm:col-span-2">
            <input
              type="checkbox"
              required
              name="terms"
              className="mt-1 h-4 w-4 shrink-0 accent-[oklch(0.585_0.221_30.5)]"
            />
            <span className="text-xs leading-relaxed text-ink/70">
              I approve the Dotis terms and confirm the information above is accurate and that I may submit this
              organisation for verification.
            </span>
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={sending}
              data-cursor-hover
              className="rise-button group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper disabled:opacity-60 sm:w-auto sm:text-base"
            >
              <span aria-hidden className="rise-fill rise-fill--flare" />
              {sending ? <Loader2 className="rise-label h-4 w-4 animate-spin" /> : <Send className="rise-label h-4 w-4" />}
              <span className="rise-label">{sending ? "Sending…" : "Submit for verification"}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
