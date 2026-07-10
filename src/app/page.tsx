"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Users,
  ClipboardList,
  Trophy,
  Zap,
  GitBranch,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Domain-wise Tasks",
    description: "Backend, Frontend, AI/ML, Cloud, Android and more — tasks organized by your tech stack.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "GitHub Submissions",
    description: "Submit your GitHub repository, demo video link, and live deployment all in one place.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Expert Review",
    description: "Get reviewed by CCC admins with detailed feedback on your work.",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Internal Leaderboard",
    description: "Track your standing within the CCC community and showcase your skills.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant Feedback",
    description: "Receive structured feedback — approved, rejected, or change requests with comments.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Import Tasks",
    description: "Admins can bulk import tasks from Excel, Word, or PDF documents.",
  },
];

const highlights = [
  "No more PDFs in WhatsApp",
  "No more Google Forms",
  "No manual evaluation",
  "One centralized platform",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-accent/30 shadow-glow-sm">
              <Image
                src="/images/ccclogo.png"
                alt="CCC Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-sm text-text-primary">DevJourney</span>
              <span className="ml-2 text-[10px] text-text-muted font-medium uppercase tracking-wider">CCC · AKGEC</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2 rounded-lg">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-lg">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-accent/40 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
              <Image
                src="/images/ccclogo.png"
                alt="Cloud Computing Cell Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </motion.div>

          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Cloud Computing Cell — AKGEC
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-text-primary">Build.</span>{" "}
            <span className="gradient-text">Learn.</span>{" "}
            <span className="text-text-primary">Grow.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            The unified developer productivity platform for CCC, AKGEC.
            Submit tasks, get expert feedback, and track your technical growth — all in one place.
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-1.5 text-sm text-text-secondary">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                {h}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="btn-primary btn-lg group"
            >
              Get started free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-secondary btn-lg">
              Sign in to your account
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-sm mx-auto"
          >
            {[
              { label: "Domains", value: "9+" },
              { label: "Task Types", value: "∞" },
              { label: "Platform", value: "V1" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Everything in one place
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Replace your scattered workflow with a single, powerful platform designed for developer communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:border-accent/20 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mb-4 group-hover:bg-accent/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card bg-gradient-to-br from-accent/10 to-purple-500/10 border-accent/20">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-1 ring-accent/30">
                <Image
                  src="/images/ccclogo.png"
                  alt="CCC Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Ready to start your journey?
            </h2>
            <p className="text-text-muted mb-6 text-sm">
              Join CCC AKGEC&apos;s developer platform. Use your AKGEC email to register.
            </p>
            <Link href="/register" className="btn-primary btn-lg">
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-7 w-7 rounded-lg overflow-hidden ring-1 ring-border">
              <Image
                src="/images/ccclogo.png"
                alt="CCC Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-medium text-text-secondary">DevJourney</span>
            <span className="text-text-muted text-xs">— Cloud Computing Cell, AKGEC</span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} DevJourney. Built for CCC AKGEC.
          </p>
        </div>
      </footer>
    </div>
  );
}
