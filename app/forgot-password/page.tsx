'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hexagon, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF9F5] p-4 dark:bg-[#0E1712]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173426] text-[#22C55E] shadow-md dark:bg-[#1C3D26]">
            <Hexagon className="h-8 w-8 stroke-[2.2] fill-[#173426]/50" />
            <span className="absolute text-xs font-bold text-white">FS</span>
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[#18251C] dark:text-white">
            Reset Password
          </h1>
          <p className="mt-2 text-xs text-[#526054] dark:text-[#A7B8AA]">
            Enter your email to receive password recovery instructions for your FarmSync account.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-[#ECE6DB] bg-white p-6 sm:p-8 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          {submitted ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D47] dark:bg-[#1C3A25] dark:text-[#4ADE80]">
                <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#18251C] dark:text-white">
                Password Reset Sent
              </h3>
              <p className="mt-1 text-xs text-[#6A786E] dark:text-[#8E9F92]">
                We sent instructions to <strong className="text-[#18251C] dark:text-white">{email}</strong>.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#173426] hover:underline dark:text-[#4ADE80]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Registered Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. manager@farmsync.io"
                    className="w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-3 text-xs font-bold text-white shadow-md hover:bg-[#204533] transition-colors dark:bg-[#22C55E] dark:text-black"
              >
                Send Reset Instructions
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6A786E] hover:text-[#18251C] dark:text-[#8E9F92] dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
