"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/admin");
            } else {
                setError(data.error || "Invalid password");
            }
        } catch (error) {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-multiply pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            <div className="w-full max-w-sm relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4 shadow-sm border border-red-100">
                        <Lock className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-black">Admin Access</h1>
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mt-1">Bella Ciao System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 bg-white text-black rounded-xl border border-zinc-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-300 placeholder:text-zinc-400 text-lg text-center tracking-widest"
                            placeholder="ENTER PASSWORD"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !password}
                        className="w-full py-4 bg-accent text-white font-black rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-lg uppercase tracking-[0.1em]"
                    >
                        {isSubmitting ? "UNLOCKING..." : "UNLOCK DASHBOARD"}
                    </button>
                </form>

                <p className="text-center text-zinc-400 text-[10px] uppercase tracking-[0.2em] mt-8">
                    For Authorized Personnel Only
                </p>
            </div>
        </div>
    );
}
