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
  Smartphone,
  Palette,
  Cloud
} from "lucide-react";
import { HeroCenteredStack } from "@/components/marketing/HeroCenteredStack";
import { HeroOverlapCollage } from "@/components/marketing/HeroOverlapCollage";
import { HeroGutterSplit } from "@/components/marketing/HeroGutterSplit";

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
  {
    icon: <Palette className="h-5 w-5" />,
    title: "UI/UX Design",
    description: "Craft intuitive, beautiful, and user-centered digital experiences.",
  },
  {
    icon: <Cloud className="h-5 w-5" />,
    title: "Cloud Computing",
    description: "Deploy, scale, and manage applications in the cloud infrastructure.",
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
    <div className="min-h-screen bg-bg-canvas text-text-primary overflow-x-hidden font-sans selection:bg-accent-violet/20 selection:text-accent-violet">
      
      {/* Glassmorphic Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-surface/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 flex-shrink-0 rounded-[4px] border border-border-hairline bg-transparent overflow-hidden">
              <Image 
                src="/images/ccclogo.png" 
                alt="CCC Logo" 
                fill 
                className="object-contain p-0.5 invert opacity-80"
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
      <HeroCenteredStack />

      {/* Tech Domains Section */}
      <motion.section 
        id="domains" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-24 px-6 border-t border-border-hairline bg-bg-surface"
      >
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
                className="bg-transparent border border-border-hairline p-6 rounded-xl hover:border-accent-violet/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-wash-violet border border-border-hairline flex items-center justify-center text-text-primary mb-6">
                  {domain.icon}
                </div>
                <h3 className="font-semibold text-base text-text-primary mb-2">{domain.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Cinematic Video Intermission */}
      <section className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        >
          <source src="/metal-human/metal-human.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 z-0 bg-black/40"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Precision engineering.
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto font-medium">
            Join a collective of developers building robust, scalable solutions for the modern web.
          </p>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <motion.section 
        id="workflow" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-24 px-6 border-t border-border-hairline"
      >
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
          
          <div className="relative p-6 bg-bg-surface border border-border-hairline rounded-xl">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <CheckCircle2 className="h-5 w-5 text-accent-violet" />
               Submission Pipeline
             </h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-transparent border border-border-hairline rounded-lg opacity-50">
                 <span className="text-sm">Task 1: Basic UI Layout</span>
                 <span className="badge-mint">Approved</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-transparent border border-border-hairline rounded-lg">
                 <span className="text-sm">Task 2: API Integration</span>
                 <span className="badge-violet">Pending Review</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-transparent border border-border-hairline border-dashed rounded-lg opacity-30">
                 <span className="text-sm">Task 3: Final Project</span>
                 <span className="badge-gray">Not Submitted</span>
               </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        id="faq" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-24 px-6 bg-bg-surface border-t border-border-hairline"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-transparent border border-border-hairline p-6 rounded-xl">
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
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border-hairline bg-transparent py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-6 w-6 flex-shrink-0 bg-transparent rounded ring-1 ring-border-hairline overflow-hidden">
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
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Cloud Computing Cell, AKGEC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
