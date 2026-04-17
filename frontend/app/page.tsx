'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import PostCard from '@/components/blog/PostCard';
import HeroCarousel from '@/components/ui/HeroCarousel';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const tags = ['All', 'Technology', 'Design', '3D', 'Future', 'Code'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (activeTag !== 'All') params.append('tag', activeTag);
      
      const res = await API.get(`/posts?${params.toString()}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchPosts();
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [search, activeTag]);

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:text-emerald-500 transition-colors">
            3D<span className="text-emerald-500">.</span>BLOG
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  href="/posts/create" 
                  className="px-6 py-2.5 bg-emerald-500 text-black text-sm font-bold rounded-full hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Write Post
                </Link>
                <Link 
                  href="/profile" 
                  className="text-sm font-bold text-white hover:text-emerald-500 transition-colors uppercase tracking-widest"
                >
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 border border-white/10 text-sm font-bold rounded-full hover:bg-white/5 transition-all text-zinc-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center space-y-6"
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            EYE ON THE <br/><span className="text-emerald-500">UNEXPECTED.</span>
          </h1>

          {/* Featured 3D Carousel */}
          {!loading && posts.length > 0 && search === '' && activeTag === 'All' && (
              <div className="py-20">
                  <HeroCarousel posts={posts.slice(0, 5)} />
              </div>
          )}
          
          {/* Advanced Search Bar */}
          <div className="max-w-2xl mx-auto mt-12 relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl group-focus-within:bg-emerald-500/20 transition-all rounded-full" />
            <div className="relative flex items-center bg-zinc-900/40 border border-zinc-800 rounded-full px-6 py-2 focus-within:border-emerald-500/50 transition-all">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for articles, designers, topics..."
                    className="w-full bg-transparent px-4 py-3 outline-none text-white placeholder:text-zinc-600"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeTag === tag 
                        ? 'bg-white text-black scale-105 shadow-xl' 
                        : 'bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-800'
                    }`}
                >
                    {tag}
                </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid */}
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post: any) => (
                <PostCard key={post.Id} post={post} />
              ))}
              
              {posts.length === 0 && (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="col-span-full py-40 text-center border border-dashed border-zinc-800/50 rounded-[3rem] bg-zinc-900/10"
                >
                  <p className="text-zinc-500 text-lg">No results match your criteria.</p>
                  <button 
                    onClick={() => { setSearch(''); setActiveTag('All'); }}
                    className="text-emerald-500 mt-4 font-bold hover:underline underline-offset-8"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} 3D Blog Platform. Built for the future.</p>
      </footer>
    </div>
  );
}
