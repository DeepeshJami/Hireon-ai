import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Hireon AI · Privacy Policy (Stable «Apple‑clean» Edition)
 * ---------------------------------------------------------
 * ‑ Zero runtime dependencies beyond React & react‑helmet
 * ‑ Minimal, airy layout with TailwindCSS utility classes
 * ‑ All JSX / HTML tags and string literals are fully closed
 *   to guarantee smooth compilation with Vite / CRA / Next.
 */

/* ---------- Helper Components --------------------------------------- */
const SectionHeading = ({ id, children }) => (
  <h2
    id={id}
    className="scroll-mt-24 pt-8 sm:pt-10 pb-3 sm:pb-4 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight"
  >
    {children}
  </h2>
);

const SimpleTable = ({ head, rows }) => (
  <div className="overflow-x-auto rounded-xl ring-1 ring-border/20 shadow-sm my-4 sm:my-6 text-xs sm:text-sm">
    <table className="w-full border-collapse text-left">
      <thead className="bg-muted/30">
        <tr className="divide-x divide-border/20">
          {head.map((h) => (
            <th key={h} className="px-2 sm:px-4 py-2 sm:py-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/10">
        {rows.map((r, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-muted/10' : ''}>
            {r.map((cell, j) => (
              <td key={j} className="px-2 sm:px-4 py-3 sm:py-4 whitespace-pre-wrap align-top">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------- Section Data -------------------------------------------- */
const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    content: (
      <p>
        Welcome to <strong>Hireon AI</strong> ("Hireon", "we", "our", or "us"). Hireon AI is a
        privacy‑first résumé‑to‑job‑description matching service that performs instant, in‑memory
        analysis with <strong>no long‑term data storage</strong>. This Privacy Policy explains what
        information we collect, why we collect it, how we use it, and what choices you have. By
        using Hireon AI (the "Service") you agree to the practices described below.<br />
        <span className="block mt-3">You may use Hireon AI without creating an account. Anonymous users are assigned a temporary identifier for session management, but no personal data is required.</span>
      </p>
    )
  },
  {
    id: 'info',
    title: '2. Information We Collect',
    content: (
      <>
        <SimpleTable
          head={['Category', 'Examples', 'Purpose', 'Retention']}
          rows={[
            [
              'User‑Provided Content',
              '• Résumé files (PDF, DOCX, TXT)\n• Job descriptions (text or URL)\n• Optional profile fields (name, email)',
              '• Perform real‑time matching\n• Display results only to you',
              'Deleted from memory after processing (< 60 s)'
            ],
            [
              'OAuth Tokens (optional)',
              '• Google One‑Tap ID token',
              '• Authenticate you\n• Prevent fraud',
              'Cached in encrypted memory during session; not persisted'
            ],
            [
              'Device & Usage Data',
              '• Browser type & version\n• OS & device type\n• Page views, feature clicks',
              '• Debug & secure Service\n• Aggregate analytics (no profiling)',
              'Raw logs ≤ 30 days; aggregated metrics indefinitely'
            ],
            [
              'Cookies & Local Storage',
              '• Theme (light/dark) preference\n• CSRF token',
              '• UX customization\n• Security',
              'Theme ≈ 1 year; CSRF ≈ 2 h'
            ]
          ]}
        />
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          <strong>No Selling or Sharing — </strong>We do <u>not</u> sell, rent, or trade your
          personal information. We do <u>not</u> share it with third parties for cross‑context
          behavioral advertising.<br />
          <span className="block mt-2">We do not use cookies or local storage for advertising or cross-site tracking.</span><br />
          <span className="block mt-2">If you sign in with Google, we only use your Google ID token to verify your identity. We do not access your Google Drive, contacts, or any other personal data.</span>
        </p>
      </>
    )
  },
  {
    id: 'legal',
    title: '3. Legal Bases for Processing',
    content: (
      <SimpleTable
        head={['Region', 'Legal Basis']}
        rows={[
          [
            'EEA / UK (GDPR)',
            '• Contract performance (Art 6 (1)(b)) – deliver the Service.\n• Legitimate interests (Art 6 (1)(f)) – security, analytics.\n• Consent for optional marketing emails (Art 6 (1)(a)).'
          ],
          [
            'United States (CCPA / CPRA)',
            'We act as a "service provider" / "processor" and honor your Right to Know, Delete, Correct, Opt‑Out, and Limit Use of Sensitive PI.'
          ]
        ]}
      />
    )
  },
  {
    id: 'use',
    title: '4. How We Use Your Information',
    content: (
      <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
        <li>
          <strong>Provide Core Functionality — </strong>Process résumé & job description text in
          memory and generate match insights via OpenAI's API.
        </li>
        <li>
          <strong>Security & Abuse Prevention — </strong>Detect unusual traffic and stop spam.
        </li>
        <li>
          <strong>Service Improvement — </strong>Aggregate non‑identifiable analytics to understand
          feature usage and latency.
        </li>
        <li>
          <strong>Communication — </strong>Respond to support tickets and critical Service notices.
        </li>
        <li>
          All résumé and job description analysis is fully automated. No human reviews your uploaded content.
        </li>
      </ul>
    )
  },
  {
    id: 'processors',
    title: '5. Third‑Party Processors',
    content: (
      <>
        <SimpleTable
          head={['Processor', 'Role', 'Location', 'Safeguards']}
          rows={[
            [
              'OpenAI, L.L.C.',
              'Language‑model inference',
              'USA',
              'Data sent only for inference; encrypted in transit (TLS 1.2+).'
            ],
            [
              'Google Cloud',
              'OAuth & hosting',
              'USA',
              'Standard Contractual Clauses (SCCs) for non‑US transfers.'
            ],
            [
              'Plausible (self‑hosted)',
              'Privacy‑focused analytics',
              'EU',
              'No cookies; no personal data.'
            ]
          ]}
        />
        <p className="text-sm leading-relaxed text-muted-foreground mt-4">
          Résumé and job description content is sent to OpenAI's API for analysis. OpenAI does not use this data to train or improve its models, in accordance with their API data usage policy.<br />
          Our infrastructure providers (e.g., Railway, Vercel) are based in the United States. By using the Service, you consent to the processing of your data in the United States.
        </p>
      </>
    )
  },
  {
    id: 'security',
    title: '6. Data Security',
    content: (
      <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
        <li>Encryption in transit (HTTPS/TLS 1.2+).</li>
        <li>Ephemeral in‑memory processing; no disk writes of résumé or JD content.</li>
        <li>Least‑privilege IAM roles; secrets stored in environment variables.</li>
        <li>Regular dependency scanning & penetration testing.</li>
      </ul>
    )
  },
  {
    id: 'retention',
    title: '7. Data Retention & Deletion',
    content: (
      <SimpleTable
        head={['Data Type', 'Default Retention', 'Deletion Mechanism']}
        rows={[
          ['Résumé/JD content', 'Destroyed after processing (< 60 s)', 'Memory cleared; caching disabled'],
          ['Account email (optional)', 'Until account deletion', 'Self‑service "Delete Account"; backups purge ≤ 30 days'],
          ['Audit logs', '30 days', 'Rolling deletion'],
          ['Billing records (future)', '7 years', 'Legal requirement']
        ]}
      />
    )
  },
  {
    id: 'rights',
    title: '8. Your Rights',
    content: (
      <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
        <li>
          <strong>GDPR — </strong>Right of access, rectification, erasure, restriction, portability,
          and objection. Email <a className="underline" href="mailto:privacy@hireon.ai">privacy@hireon.ai</a>.
        </li>
        <li>
          <strong>CCPA/CPRA — </strong>Right to know, delete, correct, opt‑out of sale/sharing, and
          limit use of sensitive data. Call +1‑833‑HIREON‑1.
        </li>
      </ul>
    )
  },
  {
    id: 'children',
    title: '9. Childrens Privacy',
    content: (
      <p>
        Hireon AI is <strong>not directed to children under 16</strong>. We do not knowingly collect
        personal information from minors. If you become aware that a minor has provided us with
        personal data, please contact us for deletion.
      </p>
    )
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Material changes will be announced via
        an in‑app banner and, if you have an account, by email. Review the "Last updated" date at
        the top of the page for the current version.
      </p>
    )
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: (
      <address className="not-italic text-sm leading-relaxed space-y-1">
        <div>Email: <a className="underline" href="mailto:hireon.ai.privacy@gmail.com">hireon.ai.privacy@gmail.com</a></div>
      </address>
    )
  }
];

/* ---------- Page Component ------------------------------------------ */
const PrivacyPolicy = () => (
  <>
    <Helmet>
      <title>Privacy Policy | Hireon AI</title>
      <meta
        name="description"
        content="Learn how Hireon AI collects, uses, and protects your personal information."
      />
    </Helmet>

    <main className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 pb-16 sm:pb-24 pt-8 sm:pt-12 text-sm sm:text-base text-foreground">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-1 sm:mt-2 text-muted-foreground text-xs sm:text-sm">Last updated: 31 May 2025</p>

      {sections.map(({ id, title, content }) => (
        <section key={id} aria-labelledby={id} className="border-b border-border/10 last:border-0">
          <SectionHeading id={id}>{title}</SectionHeading>
          {content}
        </section>
      ))}
    </main>
  </>
);

export default PrivacyPolicy; 