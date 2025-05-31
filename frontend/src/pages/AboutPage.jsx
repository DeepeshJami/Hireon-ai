import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, Sparkles, User, ArrowUpRight } from 'lucide-react';

/*
  AboutPage – Polished Edition
*/

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hireon AI",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "description": "Hireon AI is a privacy‑first resume intelligence tool that provides instant ATS‑friendly feedback without storing user data.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://hireon.ai/about"
};

const featureCards = [
  { title: 'In‑Browser Parsing', copy: 'Your PDF never leaves the tab — zero storage, maximum privacy.' },
  { title: 'Explainable Scores', copy: 'Every match score links to the keywords and phrases behind it.' },
  { title: '3‑Second Insights', copy: 'Optimised pipeline keeps feedback near‑instant, even on 4G.' },
  { title: 'Pay‑As‑You‑Grow', copy: 'Free for casual use; scale only when your applications do.' },
  { title: 'Privacy by Design', copy: 'No resumes are stored. All analysis happens in-memory.' },
];

// Noise texture (10×10px white square, transparent background) encoded as base64
const NOISE_DATA_URI =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI0ZGRicgZmlsbC1vcGFjaXR5PScwLjAnPjwvcmVjdD48L3N2Zz4=';

const AboutPage = () => {
  /* ---------- Parallax hero animation ---------- */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const auroraScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  /* ---------- 3D tilt card ---------- */
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 25]), {
    stiffness: 80,
    damping: 15
  });

  return (
    <main className="relative isolate bg-background text-foreground overflow-hidden">
      {/* SEO */}
      <Helmet>
        <title>About Hireon AI – Privacy‑First Resume Intelligence</title>
        <meta
          name="description"
          content="Discover the philosophy, technology, and people powering Hireon AI — the private, lightning‑fast resume intelligence platform."
        />
        <link rel="canonical" href="https://hireon.ai/about" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Helmet>

      {/* Backdrop Aurora */}
      <motion.div
        style={{ opacity: auroraOpacity, scale: auroraScale }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-indigo-500/10 to-transparent"
      />

      {/* Noise overlay (fixed quotes) */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-20"
        style={{ backgroundImage: `url(${NOISE_DATA_URI})` }}
      />

      {/* ---------- HERO ---------- */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-12 px-6 lg:px-16 pt-24 lg:pt-0"
      >
        {/* Copy side */}
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-semibold leading-tight">
            Hire smarter.<br className="hidden sm:block" />Interview faster.
          </h1>
          <p className="text-primary font-medium text-lg sm:text-xl">
            Privacy-first. Lightning-fast. No storage. Just better resumes.
          </p>
          <p className="text-muted-foreground text-base sm:text-lg">
            Hireon AI instantly reveals what an Applicant Tracking System thinks of your resume — before a recruiter ever sees it.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-8 py-3 text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition text-lg"
          >
            Try the demo
            <ArrowUpRight
              size={20}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>

        {/* 3D Card side */}
        <motion.div
          style={{ rotateX: rotate, rotateY: rotate }}
          className="w-[300px] sm:w-[360px] aspect-[5/3] rounded-2xl bg-gradient-to-br from-indigo-500/80 to-primary shadow-2xl shadow-primary/40 border border-white/10 backdrop-blur-lg flex flex-col justify-center items-center text-center text-background"
        >
          <p className="text-7xl font-bold tracking-tight">
            98<span className="text-background/70">%</span>
          </p>
          <span className="mt-2 font-medium">Get more callbacks</span>
        </motion.div>
      </section>

      {/* ---------- FEATURES CAROUSEL ---------- */}
      <section className="py-24 bg-gradient-to-b from-muted/10 to-transparent border-y border-border overflow-x-hidden">
        <ul className="flex gap-8 px-6 lg:px-16 snap-x snap-mandatory overflow-visible">
          {featureCards.map(({ title, copy }) => (
            <li key={title} className="snap-center shrink-0 w-[280px] sm:w-[320px] flex flex-col">
              <motion.div
                whileHover={{ y: -6 }}
                className="flex-1 rounded-2xl bg-card/80 backdrop-blur-lg border border-border p-6 shadow-md shadow-black/10"
              >
                <Sparkles className="mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{copy}</p>
              </motion.div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- FOUNDER ---------- */}
      <section className="py-32 bg-gradient-to-b from-muted/5 to-transparent border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 flex flex-col items-center text-center max-w-2xl gap-6">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="text-white text-5xl font-bold">D</span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.2 }}
              whileInView={{ opacity: 0.15, scale: 1.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 rounded-full bg-primary blur-3xl"
            />
          </div>

          <h2 className="text-3xl font-semibold flex items-center gap-2">
            <User className="text-primary" /> Deepesh Jami
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Full‑stack engineer, NJIT '25, ex‑Jio Platforms. I build privacy‑first AI products that feel like magic — not machine.
          </p>
          <div className="flex gap-4 pt-4">
            <a
              href="https://github.com/DeepeshJami"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/deepeshjami/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage; 