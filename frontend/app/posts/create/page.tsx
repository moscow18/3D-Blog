'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;
        
        setLoading(true);
        setError('');
        
        try {
            await API.post('/posts', { title, content, imageUrl, tags });
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <p className="text-zinc-500">Please <Link href="/login" className="text-emerald-500 hover:underline">sign in</Link> to write a post.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-20 font-sans">
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        &larr; Back to gallery
                    </Link>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 bg-emerald-500 text-black text-sm font-bold rounded-full hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article Title"
                        className="w-full bg-transparent text-5xl md:text-7xl font-black tracking-tighter outline-none placeholder:text-zinc-900 border-none ring-0 p-0"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">Cover Image URL</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://source.unsplash.com/..."
                                className="w-full bg-zinc-900/30 border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-emerald-500/30 transition-all text-sm text-zinc-300 placeholder:text-zinc-700"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">Category Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. Technology, Design, 3D"
                                className="w-full bg-zinc-900/30 border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-emerald-500/30 transition-all text-sm text-zinc-300 placeholder:text-zinc-700"
                            />
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing your story..."
                        rows={12}
                        className="w-full bg-transparent text-xl md:text-2xl leading-relaxed outline-none placeholder:text-zinc-900 resize-none font-light text-zinc-300"
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default CreatePostPage;
