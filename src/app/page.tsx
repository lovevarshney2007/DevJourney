"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Trophy,
  Zap,
  GitBranch,
  Shield,
  LayoutDashboard,
  Code2,
  Star
} from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Domain-wise Tasks",
    description: "Backend, Frontend, AI/ML, Cloud, and Android — structured tasks organized by your tech stack.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Seamless GitHub Integration",
    description: "Submit your repositories, video demos, and live deployments through a unified interface.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Expert Code Review",
    description: "Get detailed, actionable feedback from administrators to improve your code quality.",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Internal Leaderboard",
    description: "Track your progress and benchmark your skills against peers within the community.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Real-time Feedback",
    description: "Receive instant notifications for approvals, rejections, and requested changes.",
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Streamlined Evaluation",
    description: "A centralized platform replacing scattered spreadsheets and manual tracking forms.",
  },
];

const faqs = [
  {
    question: "Who can join the platform?",
    answer: "Currently, DevJourney is exclusive to members of the Cloud Computing Cell at AKGEC. You must use your official college email to register."
  },
  {
    question: "How are tasks evaluated?",
    answer: "Admins review your GitHub submissions and live deployments. You will receive feedback directly on the platform—either approved, rejected, or requiring changes."
  },
  {
    question: "Can I switch domains later?",
    answer: "Yes, you can explore tasks across multiple domains to broaden your skill set, though focusing on one initially is recommended."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden font-sans selection:bg-accent/10 selection:text-accent bg-hero-gradient">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/60 backdrop-blur-xl border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex-shrink-0 bg-text-primary rounded-lg flex items-center justify-center shadow-subtle">
              <span className="text-bg font-bold text-sm">DJ</span>
            </div>
            <div>
              <span className="font-bold text-base text-text-primary tracking-tight">DevJourney</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#roadmap" className="hover:text-text-primary transition-colors">Roadmap</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-text-secondary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Cloud Computing Cell, AKGEC
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-text-primary">
              <span className="text-gradient">Learn faster.</span> <br/>
              Build real projects.
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-lg mb-10 leading-relaxed">
              The professional developer platform to track your progress, submit technical tasks, and get expert code reviews in one centralized workspace.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="btn-primary btn-lg w-full sm:w-auto">
                Start Your Journey
              </Link>
              <Link href="/login" className="btn-secondary btn-lg w-full sm:w-auto">
                Explore Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Realistic UI Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="glass overflow-hidden relative z-10 flex flex-col p-0">
              {/* Fake Window Header */}
              <div className="h-10 bg-secondary border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                </div>
                <div className="mx-auto bg-bg border border-border rounded-md text-[10px] text-text-muted px-24 py-1 font-mono hidden sm:block">
                  app.devjourney.com
                </div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="p-6 bg-bg flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Task: REST API</h3>
                    <p className="text-sm text-text-secondary mt-1">Backend Development</p>
                  </div>
                  <span className="badge badge-green">Approved</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 bg-secondary">
                    <p className="text-xs text-text-muted font-medium mb-1">Status</p>
                    <p className="text-sm font-semibold text-text-primary">Completed</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-secondary">
                    <p className="text-xs text-text-muted font-medium mb-1">Points</p>
                    <p className="text-sm font-semibold text-text-primary">+500 XP</p>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-secondary px-4 py-3 border-b border-border flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-text-secondary" />
                    <span className="text-sm font-medium">Submission Details</span>
                  </div>
                  <div className="p-4 space-y-3 bg-bg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Repository</span>
                      <span className="font-mono text-text-primary text-xs border border-border rounded px-2 py-1 bg-secondary">github.com/api-task</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Reviewer</span>
                      <span className="text-text-primary font-medium">Admin Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Soft background decoration */}
            <div className="absolute -inset-4 bg-accent/20 rounded-2xl -z-10 blur-3xl opacity-50"></div>
          </motion.div>
          
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8">
            Trusted by developers building the future
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">500+</p>
              <p className="text-sm text-text-secondary">Students Onboarded</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">2,000+</p>
              <p className="text-sm text-text-secondary">Tasks Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">10,000+</p>
              <p className="text-sm text-text-secondary">Code Reviews</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary mb-1">5</p>
              <p className="text-sm text-text-secondary">Tech Domains</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Everything you need to grow
            </h2>
            <p className="text-lg text-text-secondary">
              A complete toolkit designed to streamline task submission, code review, and progress tracking for modern software engineering students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="glass"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-text-primary mb-6 shadow-glow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
              Structured learning paths.
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Stop guessing what to build next. DevJourney provides a clear roadmap of industry-standard tasks curated by experts to take you from beginner to professional.
            </p>
            
            <div className="space-y-6">
              {[
                { step: "01", title: "Select a Domain", desc: "Choose your focus area: Backend, Frontend, Cloud, etc." },
                { step: "02", title: "Complete Tasks", desc: "Build real-world projects following detailed specifications." },
                { step: "03", title: "Get Feedback", desc: "Submit code and receive architectural reviews." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 font-mono text-sm font-bold text-text-muted">{item.step}</div>
                  <div>
                    <h4 className="font-bold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/register" className="btn-secondary mt-10">
              Explore Roadmaps
            </Link>
          </div>
          
          <div className="relative">
            {/* Fake Roadmap UI */}
            <div className="glass p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <Code2 className="h-5 w-5 text-text-primary" />
                <h3 className="font-bold text-text-primary">Frontend Developer Roadmap</h3>
              </div>
              
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-border">
                {/* Node 1 */}
                <div className="relative flex gap-4 pl-10">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-text-primary outline outline-4 outline-bg"></div>
                  <div className="flex-1 bg-secondary border border-border rounded-lg p-3">
                    <p className="text-xs font-medium text-text-secondary mb-1">Task 1</p>
                    <p className="font-semibold text-sm">Build a Component Library</p>
                  </div>
                </div>
                {/* Node 2 */}
                <div className="relative flex gap-4 pl-10">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-text-primary outline outline-4 outline-bg"></div>
                  <div className="flex-1 bg-secondary border border-border rounded-lg p-3">
                    <p className="text-xs font-medium text-text-secondary mb-1">Task 2</p>
                    <p className="font-semibold text-sm">Implement State Management</p>
                  </div>
                </div>
                {/* Node 3 (Locked) */}
                <div className="relative flex gap-4 pl-10 opacity-60">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-border outline outline-4 outline-bg"></div>
                  <div className="flex-1 border border-border rounded-lg p-3 border-dashed">
                    <p className="text-xs font-medium text-text-muted mb-1">Task 3</p>
                    <p className="font-semibold text-sm text-text-muted">Next.js App Router Setup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Loved by engineering students
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6">
                <div className="flex text-accent mb-4">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-text-primary text-sm leading-relaxed mb-6">
                  "DevJourney completely transformed how we handle assignments. No more sending zip files over email. The GitHub integration and automated feedback pipeline is just like working in a real software company."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-semibold text-sm">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Student #{i}</p>
                    <p className="text-xs text-text-secondary">Backend Developer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-secondary border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass p-6">
                <h3 className="font-bold text-text-primary mb-2 flex items-center justify-between">
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

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            Ready to build?
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
            Join the platform designed to turn students into professional software engineers.
          </p>
          <Link href="/register" className="btn-primary btn-lg inline-flex items-center group">
            Create an account
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 flex-shrink-0 bg-text-primary rounded flex items-center justify-center">
                <span className="text-bg font-bold text-[10px]">DJ</span>
              </div>
              <span className="font-bold text-sm text-text-primary">DevJourney</span>
            </div>
            <p className="text-sm text-text-secondary max-w-xs">
              A premium productivity and evaluation platform developed by the Cloud Computing Cell, AKGEC.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="#features" className="hover:text-text-primary transition-colors">Features</Link></li>
              <li><Link href="#roadmap" className="hover:text-text-primary transition-colors">Roadmaps</Link></li>
              <li><Link href="/login" className="hover:text-text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a></li>
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
