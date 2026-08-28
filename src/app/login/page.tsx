"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChatCircleDots, ArrowRight, Lock, Envelope, WarningCircle } from "@phosphor-icons/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(errorParam || null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Welcome back
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Sign in to manage your custom chatbots, knowledge files, and API keys.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <WarningCircle weight="fill" className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="mt-6 space-y-4 font-sans text-xs">
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
              placeholder="you@domain.com"
              className="w-full rounded-lg border border-white/10 bg-[#06080e] pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-medium text-slate-300">Password</label>
          </div>
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
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign in to Dashboard</span>
              <ArrowRight weight="bold" className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 border-t border-white/[0.06] pt-4 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign up free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      {/* Ambient light */}
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

      <Suspense fallback={<div className="text-xs text-slate-400">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
