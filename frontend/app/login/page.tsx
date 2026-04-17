'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl relative z-10 shadow-2xl"
            >
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Welcome Back</h1>
                        <p className="text-zinc-500 text-lg">Enter your details to continue</p>
                    </motion.div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-700"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2.5 ml-1">
                            <label className="block text-zinc-400 text-sm font-medium">Password</label>
                            <Link href="#" className="text-emerald-500/80 text-xs hover:text-emerald-400 transition-colors">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-700"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(16,185,129,0.2)] mt-5 flex items-center justify-center gap-2"
                    >
                        Sign In
                    </motion.button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-zinc-500 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-emerald-500/30">
                            Create for free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
