"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-indigo-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-indigo-500/20 rounded-3xl p-12 sm:p-16 relative overflow-hidden"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-6 shadow-2xl shadow-indigo-500/30">
              <Zap className="w-8 h-8 text-white" fill="white" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Your next interview{" "}
              <span className="gradient-text">starts here</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of engineers who&apos;ve leveled up their interview game
              with PrepIt. Free forever, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto justify-center"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/sign-in"
                className="px-8 py-4 glass border border-white/10 text-slate-300 font-medium rounded-xl hover:border-indigo-500/30 hover:text-white transition-all duration-300 w-full sm:w-auto text-center"
              >
                Already have an account?
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-600">
              Free plan includes 20 questions/day · No credit card needed
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
