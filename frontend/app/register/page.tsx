'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
        } catch (err: any) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative z-10"
            >
                <div className="mb-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Create Account
                    </motion.h1>
                    <p className="text-zinc-500">Join the ultimate 3D blog experience</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-4"
                    >
                        Register
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-zinc-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                        Log In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
