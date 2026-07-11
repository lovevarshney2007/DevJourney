"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ClipboardList,
  Trophy,
  Code2,
  Terminal,
  Cpu,
  Monitor,
  CheckCircle2,
  CalendarDays,
  Smartphone
} from "lucide-react";

const domains = [
  {
    icon: <Terminal className="h-5 w-5" />,
    title: "Backend Development",
    description: "Build robust APIs, design databases, and handle server-side logic at scale.",
  },
  {
    icon: <Monitor className="h-5 w-5" />,
    title: "Frontend Development",
    description: "Create stunning, interactive user interfaces with modern web frameworks.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "AI & Machine Learning",
    description: "Train models, implement algorithms, and build intelligent systems.",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Android Development",
    description: "Develop native mobile applications for the world's most popular OS.",
  },
];

const faqs = [
  {
    question: "Who can access this platform?",
    answer: "DevJourney is built exclusively for members and recruits of the Cloud Computing Cell at AKGEC. You need an official college email to sign up."
  },
  {
    question: "How are recruitments conducted?",
    answer: "Tasks are assigned on a domain basis. You will complete the tasks, push your code to GitHub, and submit your repositories here. The admin team will review and provide feedback."
  },
  {
    question: "What happens after submission?",
    answer: "Once submitted, your task enters the 'Pending Review' state. An admin will evaluate your code architecture, functionality, and provide a detailed verdict."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden font-sans selection:bg-accent/20 selection:text-accent">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 flex-shrink-0 bg-bg-hover rounded-md ring-1 ring-accent/30 overflow-hidden">
              <Image 
                src="/images/ccclogo.png" 
                alt="CCC Logo" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="font-semibold text-base text-text-primary tracking-tight">CCC DevJourney</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#domains" className="hover:text-text-primary transition-colors">Domains</a>
            <a href="#workflow" className="hover:text-text-primary transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2">
              Student Login
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 bg-hero-gradient">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border text-xs font-medium text-text-secondary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Cloud Computing Cell, AKGEC
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
              Learn. Build.<br/>
              <span className="text-text-secondary">Innovate.</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-lg mb-10 leading-relaxed">
              The official task evaluation and recruitment portal for the Cloud Computing Cell. Submit your domain tasks, track deadlines, and receive expert code reviews.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link href="/register" className="btn-primary btn-lg w-full sm:w-auto">
                Join the Platform
              </Link>
              <Link href="#domains" className="btn-secondary btn-lg w-full sm:w-auto">
                View Domains
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Clean CCC Event Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-bg-surface border border-border shadow-md rounded-xl overflow-hidden relative z-10 flex flex-col p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="relative h-16 w-16 bg-bg border border-border rounded-xl">
                  <Image src="/images/ccclogo.png" alt="CCC" fill className="object-contain p-2" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Annual Recruitment Drive</h3>
                  <p className="text-sm text-text-secondary">Cloud Computing Cell</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-text-primary">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  <span>5 specialized technical domains</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-primary">
                  <CalendarDays className="h-5 w-5 text-accent" />
                  <span>Strict task deadlines & evaluation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-primary">
                  <Trophy className="h-5 w-5 text-accent" />
                  <span>Live leaderboards and scoring</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-bg rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium mb-1">Portal Status</p>
                  <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Accepting Submissions
                  </p>
                </div>
                <Link href="/register" className="btn-ghost btn-sm">
                  Register <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Tech Domains Section */}
      <section id="domains" className="py-24 px-6 border-t border-border bg-bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4 tracking-tight">
              Choose your domain
            </h2>
            <p className="text-lg text-text-secondary">
              CCC offers focused task pathways for various technologies. Select your domain, complete the assignments, and demonstrate your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <div
                key={domain.title}
                className="bg-bg border border-border p-6 rounded-xl hover:border-border-focus/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-surface border border-border flex items-center justify-center text-text-primary mb-6">
                  {domain.icon}
                </div>
                <h3 className="font-semibold text-base text-text-primary mb-2">{domain.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6 tracking-tight">
              Evaluation Workflow
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              DevJourney streamlines the entire task submission process, completely eliminating scattered email threads and zip files.
            </p>
            
            <div className="space-y-6">
              {[
                { step: "01", title: "Claim Tasks", desc: "View detailed requirements, resources, and deadlines for your domain." },
                { step: "02", title: "Submit Repositories", desc: "Paste your GitHub link and optionally provide live deployment URLs." },
                { step: "03", title: "Receive Verdict", desc: "Get structural code reviews directly from the CCC Admin Team." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 font-mono text-sm font-semibold text-text-muted">{item.step}</div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative p-6 bg-bg-surface border border-border rounded-xl">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5 text-accent" />
               Submission Pipeline
             </h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-bg border border-border rounded-lg opacity-50">
                 <span className="text-sm">Task 1: Basic UI Layout</span>
                 <span className="text-xs font-semibold text-green-400 border border-green-400/20 bg-green-400/10 px-2 py-1 rounded">Approved</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-bg border border-border rounded-lg">
                 <span className="text-sm">Task 2: API Integration</span>
                 <span className="text-xs font-semibold text-yellow-400 border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 rounded">Pending Review</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-bg border border-border border-dashed rounded-lg opacity-30">
                 <span className="text-sm">Task 3: Final Project</span>
                 <span className="text-xs font-semibold text-text-muted">Not Submitted</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-bg border border-border p-6 rounded-xl">
                <h3 className="font-semibold text-text-primary mb-2 flex items-center justify-between">
                  {faq.question}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-6 w-6 flex-shrink-0 bg-bg-hover rounded ring-1 ring-accent/30 overflow-hidden">
                <Image src="/images/ccclogo.png" alt="CCC Logo" fill className="object-contain p-0.5" />
              </div>
              <span className="font-semibold text-sm text-text-primary">CCC DevJourney</span>
            </div>
            <p className="text-sm text-text-secondary max-w-xs">
              The official productivity and evaluation platform developed by the Cloud Computing Cell, AKGEC.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary text-sm mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="#domains" className="hover:text-text-primary transition-colors">Domains</Link></li>
              <li><Link href="#workflow" className="hover:text-text-primary transition-colors">Workflow</Link></li>
              <li><Link href="/login" className="hover:text-text-primary transition-colors">Student Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Cloud Computing Cell, AKGEC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
