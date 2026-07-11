"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardList, Trophy, CalendarDays } from "lucide-react";

export function HeroGutterSplit() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 bg-gradient-to-br from-bg-wash-violet to-bg-wash-mint">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-start py-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-hairline text-xs font-mono font-medium text-text-secondary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet"></span>
            </span>
            Cloud Computing Cell, AKGEC
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Learn. <span className="font-serif italic font-normal text-accent-violet">Build.</span><br/>
            <span className="text-text-secondary">Innovate.</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-lg mb-10 leading-relaxed">
            The official task evaluation and recruitment portal for the Cloud Computing Cell. Submit your domain tasks, track deadlines, and receive expert code reviews.
          </p>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-auto">
            <Link href="/register" className="btn-primary btn-lg w-full sm:w-auto">
              Join the Platform
            </Link>
            <Link href="#domains" className="btn-secondary btn-lg w-full sm:w-auto">
              View Domains
            </Link>
          </div>
        </motion.div>

        {/* Gutter Split */}
        <div className="hidden lg:block w-px bg-border-hairline shrink-0"></div>
        <div className="block lg:hidden h-px w-full bg-border-hairline shrink-0 my-4"></div>

        {/* Right Side: Clean CCC Event Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 lg:max-w-md relative"
        >
          <div className="h-full bg-transparent border-0 md:bg-bg-surface md:border md:border-border-hairline shadow-none rounded-xl overflow-hidden relative z-10 flex flex-col p-0 md:p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-hairline">
              <div className="relative h-16 w-16 bg-transparent border border-border-hairline rounded-xl shrink-0">
                <Image src="/images/ccclogo.png" alt="CCC" fill className="object-contain p-2" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Annual Recruitment Drive</h3>
                <p className="text-sm text-text-secondary">Cloud Computing Cell</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <ClipboardList className="h-5 w-5 text-accent-violet shrink-0" />
                <span>5 specialized technical domains</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <CalendarDays className="h-5 w-5 text-accent-violet shrink-0" />
                <span>Strict task deadlines & evaluation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <Trophy className="h-5 w-5 text-accent-violet shrink-0" />
                <span>Live leaderboards and scoring</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-transparent rounded-lg border border-border-hairline flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">Portal Status</p>
                <p className="text-sm font-semibold text-accent-mint flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
                  Accepting Submissions
                </p>
              </div>
              <Link href="/register" className="btn-ghost btn-sm whitespace-nowrap">
                Register <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
