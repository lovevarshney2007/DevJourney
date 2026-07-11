"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Terminal, CheckCircle2 } from "lucide-react";

export function HeroCenteredStack() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center bg-bg pt-20">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-accent-mint/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 relative z-10">
        
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-border-hairline text-[11px] font-mono font-medium text-text-secondary uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Recruitment 2026
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight mb-6 leading-[1.1]">
              Prove your <span className="text-accent-violet">skills.</span><br/>Earn your spot.
            </h1>

            <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-lg leading-relaxed">
              Welcome to the Cloud Computing Cell evaluation portal. Pick your domain, tackle real-world engineering tasks, and submit your code for review.
            </p>

            <div className="flex items-center gap-4">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-text-primary border border-text-primary rounded-lg px-7 py-3.5 hover:bg-text-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Start your evaluation
              </Link>
              <Link 
                href="#domains" 
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-text-primary bg-transparent border border-border-hairline rounded-lg px-7 py-3.5 hover:bg-bg-surface transition-all duration-200"
              >
                View domains
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Video & Floating UI */}
        <div className="hidden lg:flex items-center justify-center relative h-[500px]">
          
          {/* Glass Flower Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden rounded-3xl"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-3xl mix-blend-multiply opacity-90"
            >
              <source src="/glass-flower.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-surface/40 to-transparent rounded-3xl mix-blend-overlay"></div>
          </motion.div>

          {/* Main Code Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute z-20 w-80 bg-bg-surface/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden"
            style={{ left: '-5%', top: '5%' }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-hairline bg-white/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-success/80"></div>
              </div>
              <span className="ml-2 text-[10px] font-mono text-text-muted">submission.ts</span>
            </div>
            <div className="p-4 bg-bg-surface">
              <pre className="text-[11px] font-mono leading-relaxed text-text-secondary">
                <span className="text-accent-violet">export async function</span> <span className="text-blue-500">evaluateTask</span>() {'{\n'}
                {'  '}const status = <span className="text-accent-mint">await</span> checkTests();{'\n'}
                {'  '}<span className="text-accent-violet">if</span> (status.passed) {'{\n'}
                {'    '}<span className="text-accent-violet">return</span> <span className="text-success">"Approved"</span>;{'\n'}
                {'  }'}{'\n'}
                {'}'}
              </pre>
            </div>
          </motion.div>

          {/* Floating Review Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, rotate: 4 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute z-30 w-64 bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-4 flex items-start gap-4"
            style={{ right: '-10%', bottom: '10%' }}
          >
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary mb-1">Code Review Passed</p>
              <p className="text-[10px] text-text-secondary leading-tight">Excellent use of hooks! Your submission has been approved.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
