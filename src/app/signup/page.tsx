"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ChatCircleDots,
  ArrowRight,
  Lock,
  Envelope,
  User,
  WarningCircle,
} from "@phosphor-icons/react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up user with metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        setErrorMessage(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. If session wasn't auto-created, sign in directly
      if (!signUpData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          // If Supabase still requires email confirmation on backend
          setErrorMessage(
            "Account created! In Supabase Dashboard, toggle 'Confirm email' to OFF for instant login without email checks."
          );
          setLoading(false);
          return;
        }
      }

      // 3. Successfully signed in -> redirect straight to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      </div>

      {/* Brand Header */}
      <Link href="/" className="group mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-400 shadow-sm transition-all duration-200 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10">
          <ChatCircleDots weight="bold" className="h-5 w-5 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-white">
            Chat<span className="text-emerald-400">Molded</span>
          </span>
          <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            .app
          </span>
        </div>
      </Link>

      {/* Signup Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Create your account
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Start molding custom AI chatbots with BYOK.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <WarningCircle weight="fill" className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4 font-sans text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User weight="bold" className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full rounded-lg border border-white/10 bg-[#06080e] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Envelope weight="bold" className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full rounded-lg border border-white/10 bg-[#06080e] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock weight="bold" className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-[#06080e] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-emerald-400 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating account &amp; signing in...</span>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-white/[0.06] pt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
