import {
  ArrowUpRight,
  Database,
  Eye,
  Laptop,
  LockKeyhole,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Seo } from '@/components/Seo';
import { ROUTE_SEO } from '@/content/site';

const updatedAt = 'July 13, 2026';

const sections = [
  ['browser-hands', 'Browser Hands'],
  ['information', 'Information we handle'],
  ['use', 'How information is used'],
  ['sharing', 'Service providers'],
  ['retention', 'Storage and retention'],
  ['choices', 'Your controls'],
  ['security', 'Security'],
  ['contact', 'Contact'],
] as const;

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream pt-24 text-[#171411]">
      <Seo {...ROUTE_SEO.privacy} />

      <section className="border-b border-[#cbc5ba] px-5 pb-12 pt-12 md:px-8 md:pb-16 lg:px-10">
        <div className="mx-auto max-w-[1540px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#716a62]">
                Policy / 01
              </p>
              <h1 className="mt-5 max-w-5xl text-balance font-pixel text-5xl leading-[0.95] tracking-normal md:text-7xl lg:text-[88px]">
                Your context is for your work—not our business model.
              </h1>
            </div>
            <div className="border-l border-[#cbc5ba] pl-5 font-mono text-sm leading-6 text-[#625c55]">
              <p>Effective and last updated: {updatedAt}</p>
              <p className="mt-3">
                This policy covers sankhyaailabs.com, Chotu Desktop, Dhee-backed memory, and the Chotu Browser Hands Chrome extension.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1540px] gap-10 lg:grid-cols-[250px_minmax(0,860px)_minmax(220px,1fr)]">
          <nav className="self-start border-t border-[#171411] pt-4 lg:sticky lg:top-28" aria-label="Privacy policy sections">
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#716a62]">On this page</p>
            <ol className="space-y-2 font-mono text-xs">
              {sections.map(([id, label], index) => (
                <li key={id}>
                  <a className="group flex items-center gap-3 py-1 text-[#625c55] hover:text-[#171411]" href={`#${id}`}>
                    <span className="text-[#9a9288]">{String(index + 1).padStart(2, '0')}</span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 space-y-14 text-[15px] leading-7 text-[#514b45] md:text-base md:leading-8">
            <section
              id="browser-hands"
              className="scroll-mt-28 overflow-hidden rounded-lg border border-[#25211d] bg-[#12110f] text-[#f6ecdf] shadow-[0_24px_70px_rgba(24,20,16,0.14)]"
            >
              <div className="grid gap-6 p-6 md:grid-cols-[44px_minmax(0,1fr)] md:p-8">
                <span className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5">
                  <Eye className="size-5 text-[#e9c46a]" />
                </span>
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#e9c46a]">Prominent Browser Hands disclosure</p>
                  <h2 className="mt-3 font-pixel text-3xl leading-tight text-white">What the Chrome extension can read</h2>
                  <p className="mt-4 text-[#f6ecdf]/78">
                    The Chotu Browser Hands extension can read page URLs, tab titles, visible website content, page controls, and form fields only when you ask Chotu to use a page. It can act on that page, manage tabs, upload a file you select, or download a file you request so Chotu can complete and verify your task.
                  </p>
                  <p className="mt-4 text-[#f6ecdf]/78">
                    That task context travels through Chrome Native Messaging to the Chotu app running on your computer. Chotu may send the minimum context needed to your configured AI provider to reason about the task. Sankhya does not sell this data, use it for advertising, build an advertising profile, or let employees read it except with your specific support consent, for security, or where law requires it.
                  </p>
                  <p className="mt-4 border-t border-white/10 pt-4 font-mono text-xs leading-6 text-[#f6ecdf]/60">
                    The extension does not continuously upload browsing history, does not read authentication cookies, and does not fill passwords or payment credentials. Credential, CAPTCHA, and payment boundaries require owner takeover.
                  </p>
                </div>
              </div>
            </section>

            <PolicySection id="information" number="02" title="Information we handle" icon={<Database />}>
              <h3>Account and website</h3>
              <p>When you sign in, we handle your Firebase/Google account identifier, email address, display name, account status, device entitlement, subscription identifiers, and support communications. Razorpay handles payment-card entry; we receive transaction, customer, plan, and payment-status identifiers rather than your full card number. Vercel Analytics may provide aggregated website traffic and performance information.</p>
              <h3>Chotu Desktop and Dhee</h3>
              <p>Depending on the features you choose, Chotu can handle your requests and transcripts, screen and application context, selected files and folders, code and repository state, task receipts, preferences, and memories you ask Dhee to retain. Personal-app actions can access the contact, reminder, or message needed for the task you requested. Voice mode sends live audio and task context to the configured live-voice provider while the voice session is active.</p>
              <h3>Browser tasks</h3>
              <p>Browser Hands can handle website content, URLs and tab titles, your requested browser interactions, form data you explicitly provide, selected upload paths, download metadata, and action receipts. A page may contain personal communications or identifying information; Chotu handles it only as needed for the task you initiated.</p>
            </PolicySection>

            <PolicySection id="use" number="03" title="How information is used" icon={<Laptop />}>
              <ul>
                <li>Authenticate your account and deliver the plan, updates, managed AI allowance, and downloads you selected.</li>
                <li>Understand your request, plan work, operate the desktop or browser, ask for approval, and verify the result.</li>
                <li>Maintain Dhee memory and strategy learning under your local settings so later tasks can start with relevant context.</li>
                <li>Secure the service, prevent abuse, diagnose failures, and maintain reliability.</li>
                <li>Meet billing, tax, security, and legal obligations.</li>
              </ul>
              <p>We do not sell personal data. We do not use task, browser, voice, or memory data for personalized advertising or credit decisions.</p>
            </PolicySection>

            <PolicySection id="sharing" number="04" title="Service providers and data transfer" icon={<ArrowUpRight />}>
              <p>Information is shared only when needed to provide the feature you chose, secure it, or comply with law. Current categories of providers include Google Firebase for authentication and account records, Razorpay for billing, Vercel for website hosting analytics, Cloudflare R2 or GitHub for release delivery, OpenRouter and the model provider selected for Chotu reasoning, and Google Gemini for Gemini Live voice mode.</p>
              <p>Your own bring-your-own-key provider receives the context Chotu sends under that provider’s terms. A managed plan uses a per-account, spend-limited OpenRouter credential. We do not give these providers permission to use your information for Sankhya advertising.</p>
              <p className="rounded-md border border-[#cbc5ba] bg-[#fff9ef] p-4 font-mono text-sm leading-6 text-[#403a34]">
                The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
              </p>
            </PolicySection>

            <PolicySection id="retention" number="05" title="Storage and retention" icon={<Trash2 />}>
              <p>Browser Hands does not maintain a cloud copy of page content or browsing history. Its native connection and page observations are task-scoped. Chotu’s local event history, task receipts, and Dhee memories remain on your computer until you delete them or the applicable local retention rule expires.</p>
              <p>Account, entitlement, usage, and billing records are retained while your account is active and afterward only as needed for security, dispute resolution, legal, tax, and accounting obligations. Managed provider credentials are kept in an admin-only server secret record and in Keychain or DPAPI on the authorized desktop; they are not exposed through the website UI.</p>
            </PolicySection>

            <PolicySection id="choices" number="06" title="Your controls" icon={<ShieldCheck />}>
              <ul>
                <li>Approve or reject risky actions and take over before credentials, CAPTCHAs, payments, sending, deletion, shutdown, or other consequential steps.</li>
                <li>Disable or uninstall Browser Hands, revoke macOS permissions, close voice mode, or use a bring-your-own-key provider.</li>
                <li>Review, export, forget, or delete local Dhee memories and task history through Chotu’s privacy controls.</li>
                <li>Ask us to access, correct, or delete account information, subject to legal retention requirements.</li>
              </ul>
            </PolicySection>

            <PolicySection id="security" number="07" title="Security" icon={<LockKeyhole />}>
              <p>Chotu is local-first. Browser Hands connects only through Chrome Native Messaging to the package-owned native host. The host verifies the trusted extension identity and a short-lived HMAC attestation before the local Hub accepts commands. Signed entitlements and one-use login tokens protect account activation; provider credentials use platform secret storage on supported desktops.</p>
              <p>No system is perfectly secure. Please report a suspected vulnerability or account compromise promptly so we can investigate and protect affected users.</p>
            </PolicySection>

            <PolicySection id="contact" number="08" title="Contact and policy changes" icon={<ShieldCheck />}>
              <p>Chotu is not directed to children under 13. We may update this policy when features, providers, or legal requirements change. If Browser Hands data practices materially change, we will disclose the change prominently before the new handling begins.</p>
              <p>
                Privacy questions, data requests, and security reports can be sent to{' '}
                <a className="font-semibold text-[#171411] underline decoration-[#171411]/30 underline-offset-4 hover:decoration-[#171411]" href="mailto:hello@sankhyaailabs.com?subject=Privacy%20request">
                  hello@sankhyaailabs.com
                </a>.
              </p>
            </PolicySection>
          </article>

          <aside className="self-start border-t border-[#171411] pt-4 lg:sticky lg:top-28">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#716a62]">Plain-language commitment</p>
            <div className="mt-5 space-y-5 font-mono text-xs leading-6 text-[#625c55]">
              <Promise icon={<Laptop />} title="Local first">Your Mac remains the primary workplace and memory boundary.</Promise>
              <Promise icon={<Eye />} title="Task scoped">Chotu reads context because you asked it to do something with that context.</Promise>
              <Promise icon={<ShieldCheck />} title="Owner controlled">Consequential actions stop for approval or takeover.</Promise>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  children,
  icon,
  id,
  number,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  id: string;
  number: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[#cbc5ba] pt-7">
      <div className="mb-6 flex items-start gap-4">
        <span className="mt-1 font-mono text-xs text-[#91897f]">{number}</span>
        <span className="mt-0.5 [&>svg]:size-5 [&>svg]:stroke-[1.5]">{icon}</span>
        <h2 className="font-pixel text-3xl leading-none text-[#171411] md:text-4xl">{title}</h2>
      </div>
      <div className="space-y-4 pl-0 [&_h3]:pt-3 [&_h3]:font-mono [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-[0.08em] [&_h3]:text-[#28231f] [&_li]:ml-5 [&_li]:pl-1 [&_ul]:list-[square] [&_ul]:space-y-2 md:pl-[76px]">
        {children}
      </div>
    </section>
  );
}

function Promise({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <div className="border-b border-[#d8d2c8] pb-5 last:border-0">
      <div className="flex items-center gap-2 text-[#28231f] [&>svg]:size-4">{icon}<strong>{title}</strong></div>
      <p className="mt-2">{children}</p>
    </div>
  );
}
