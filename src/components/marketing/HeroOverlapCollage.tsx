"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardList, Trophy, CalendarDays } from "lucide-react";

export function HeroOverlapCollage() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 bg-gradient-to-br from-bg-wash-violet to-bg-wash-mint overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start max-w-2xl relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-hairline text-xs font-mono font-medium text-text-secondary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet"></span>
            </span>
            Cloud Computing Cell, AKGEC
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-none text-text-primary -ml-1">
            Learn.<br/>
            <span className="font-serif italic font-normal text-accent-violet">Build.</span><br/>
            Innovate.
          </h1>

          <p className="text-lg text-text-secondary max-w-md mb-10 leading-relaxed">
            The official task evaluation and recruitment portal for the Cloud Computing Cell. Submit your domain tasks, track deadlines, and receive expert code reviews.
          </p>

          <div className="flex flex-col items-start gap-4 w-full sm:w-auto">
            <Link href="/register" className="btn-primary btn-lg w-full sm:w-64 justify-center">
              Join the Platform
            </Link>
            <Link href="#domains" className="btn-secondary btn-lg w-full sm:w-64 justify-center">
              View Domains
            </Link>
          </div>
        </motion.div>

        {/* Recruitment Card Overlapping */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-12 md:mt-0 md:absolute md:bottom-12 md:right-0 lg:right-12 z-30 w-full md:w-[400px]"
        >
          <div className="bg-bg-surface border border-border-hairline shadow-2xl rounded-xl overflow-hidden flex flex-col p-8 transform md:-rotate-2 md:translate-x-8 md:translate-y-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-hairline">
              <div className="relative h-16 w-16 bg-transparent border border-border-hairline rounded-xl">
                <Image src="/images/ccclogo.png" alt="CCC" fill className="object-contain p-2" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Annual Recruitment Drive</h3>
                <p className="text-sm text-text-secondary">Cloud Computing Cell</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <ClipboardList className="h-5 w-5 text-accent-violet" />
                <span>5 specialized technical domains</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <CalendarDays className="h-5 w-5 text-accent-violet" />
                <span>Strict task deadlines & evaluation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-primary">
                <Trophy className="h-5 w-5 text-accent-violet" />
                <span>Live leaderboards and scoring</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-transparent rounded-lg border border-border-hairline flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">Portal Status</p>
                <p className="text-sm font-semibold text-accent-mint flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
                  Accepting
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
  );
}
