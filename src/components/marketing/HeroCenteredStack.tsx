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
        <div className="flex flex-col justify-center relative pr-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimalist Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-text-primary"></div>
              <span className="text-[10px] font-mono font-medium text-text-primary uppercase tracking-[0.2em]">
                Recruitment 2026
              </span>
            </div>

            {/* Clean, High-Contrast Typography */}
            <h1 className="text-6xl sm:text-7xl lg:text-[5rem] font-bold text-text-primary tracking-tighter mb-8 leading-[1.05]">
              Prove your skills. <br/>
              <span className="text-text-secondary opacity-70">Earn your spot.</span>
            </h1>

            <p className="text-lg text-text-muted mb-12 max-w-md leading-relaxed font-medium">
              Welcome to the Cloud Computing Cell evaluation portal. Pick your domain, tackle real-world engineering tasks, and submit your code for review.
            </p>

            {/* Minimalist Buttons */}
            <div className="flex items-center gap-6">
              <Link 
                href="/register" 
                className="group relative inline-flex items-center gap-4 bg-text-primary text-bg-surface px-6 py-4 rounded hover:bg-text-primary/90 transition-all"
              >
                <span className="text-sm font-semibold tracking-wide">Start evaluation</span>
                <span className="w-8 h-[1px] bg-bg-surface/50 group-hover:w-12 transition-all duration-300"></span>
              </Link>
              
              <Link 
                href="#domains" 
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors underline-offset-4 hover:underline"
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
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4" type="video/mp4" />
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
