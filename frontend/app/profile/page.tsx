'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface Stats {
    PostCount: number;
    TotalLikes: number;
    Bio?: string;
    Name: string;
}

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const { showToast } = useToast();
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfileData = async () => {
            if (!user?.id) return;
            
            try {
                setLoading(true);
                // Fetch stats and posts in parallel
                const [statsRes, postsRes] = await Promise.all([
                    API.get(`/users/${user.id}/stats`),
                    API.get(`/posts?userId=${user.id}`)
                ]);
                
                setStats(statsRes.data);
                setPosts(postsRes.data);
                
                // Prefill edit fields
                setEditName(statsRes.data.Name);
                setEditBio(statsRes.data.Bio || '');
                
            } catch (err: any) {
                console.error(`Error fetching data for user ID ${user.id}:`, err);
                
                if (err.response?.status === 404) {
                    showToast('Profile not found. Your session might be outdated.', 'error');
                } else {
                    showToast('Failed to load profile data', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (!user) return;
        fetchProfileData();
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await API.put('/users/profile', { name: editName, bio: editBio });
            showToast('Identity updated.');
            setIsEditing(false);
            fetchProfileData(); // Refresh data
        } catch (err) {
            showToast('Failed to update identity', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <p className="text-zinc-500">You must be logged in to view your profile.</p>
                <Link href="/login" className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-full">Sign In</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20 px-6">
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                        3D<span className="text-emerald-500">.</span>Blog
                    </Link>
                    <button 
                        onClick={logout}
                        className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
                    >
                        <div className="space-y-4 max-w-2xl">
                            <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-4xl font-black text-black shadow-2xl shadow-emerald-500/20">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
                                    {stats?.Name || user.name}
                                </h1>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 text-zinc-600 hover:text-emerald-500 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M17.141 11.393a1.5 1.5 0 010 2.121l-5.304 5.303a1.5 1.5 0 01-1.06.44l-3.535.884.884-3.536a1.5 1.5 0 01.44-1.06l5.303-5.304a1.5 1.5 0 012.121 0z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-zinc-300 text-lg leading-relaxed font-light">
                                {stats?.Bio || "Verified Creator & Visionary"}
                            </p>
                        </div>

                        <div className="flex gap-12 border-l border-zinc-800 pl-12">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-white">{stats?.PostCount || 0}</p>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Creations</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-emerald-500">{stats?.TotalLikes || 0}</p>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Global LIKES</p>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Edit Profile Modal */}
                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditing(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl"
                            >
                                <h2 className="text-3xl font-black tracking-tight mb-8">Edit Identity</h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Public Name</label>
                                        <input 
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Vision / Bio</label>
                                        <textarea 
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all h-32 resize-none"
                                            placeholder="Write something about your creative journey..."
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? 'Synchronizing...' : 'Save Changes'}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Personal Gallery */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">My Creative Space</h2>
                        <Link href="/posts/create" className="text-emerald-500 font-bold hover:underline">
                            + Share Something New
                        </Link>
                    </div>

                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {posts.map((post: any) => (
                                    <PostCard key={post.Id} post={post} />
                                ))}

                                {posts.length === 0 && (
                                    <div className="col-span-full py-40 text-center border border-dashed border-zinc-800 bg-zinc-900/10 rounded-[3rem]">
                                        <p className="text-zinc-600 text-lg mb-4">Your gallery is currently empty.</p>
                                        <Link href="/posts/create" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all">
                                            Begin Your First Story
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
