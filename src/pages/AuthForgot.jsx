import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthForgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive reset instructions.</p>
        {sent ? (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">If an account exists, a reset link has been sent.</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl">Send Reset Link</button>
          </form>
        )}
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 mt-6 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    </div>
  );
}


