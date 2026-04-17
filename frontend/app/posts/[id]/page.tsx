'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { likeService } from '@/services/likeService';
import { commentService } from '@/services/commentService';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/context/ToastContext';

interface Post {
    Id: number;
    Title: string;
    Content: string;
    ImageUrl?: string;
    AuthorName: string;
    UserId: number;
    CreatedAt: string;
}

interface Comment {
    Id: number;
    Content: string;
    AuthorName: string;
    CreatedAt: string;
}

const PostDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    
    // UI States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Social States
    const [likes, setLikes] = useState({ count: 0, userLiked: false });
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [postRes, likesRes, commentsRes] = await Promise.all([
                    API.get(`/posts/${id}`),
                    likeService.getLikes(Number(id)),
                    commentService.getComments(Number(id))
                ]);
                setPost(postRes.data);
                setLikes(likesRes);
                setComments(commentsRes);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) return showToast('Please login to like this post', 'info');
        try {
            const data = await likeService.toggleLike(Number(id));
            setLikes(prev => ({
                count: data.liked ? prev.count + 1 : prev.count - 1,
                userLiked: data.liked
            }));
        } catch (err) {
            showToast('Action failed. Please try again.', 'error');
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        
        setIsSubmitting(true);
        try {
            await commentService.addComment(Number(id), newComment);
            setNewComment('');
            const updated = await commentService.getComments(Number(id));
            showToast('Comment published successfully!');
        } catch (err) {
            showToast('Failed to add comment', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await API.delete(`/posts/${id}`);
            showToast('Post destroyed forever.');
            router.push('/');
        } catch (err) {
            showToast('Erasure failed.', 'error');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-sans">
            Post not found. <Link href="/" className="ml-2 text-emerald-500 underline">Go back</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white font-sans">
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                title="Delete Post"
                message="This action is permanent and cannot be undone. All likes and comments associated with this post will also be destroyed."
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                        <span className="text-lg font-light">&larr;</span> Back to gallery
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {user && (
                            <Link 
                                href="/profile" 
                                className="text-xs font-bold text-white hover:text-emerald-500 transition-colors uppercase tracking-widest"
                            >
                                My Profile
                            </Link>
                        )}
                        {user?.id === post.UserId && (
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="text-xs font-bold text-red-500/80 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <article className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <header className="mb-12 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/20">
                                {post.AuthorName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white leading-none">{post.AuthorName}</p>
                                <p className="text-xs text-zinc-500 mt-2 font-medium uppercase tracking-widest">
                                    {new Date(post.CreatedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                            {post.Title}
                        </h1>
                    </header>

                    {post.ImageUrl && (
                        <div className="mb-16 rounded-[2rem] overflow-hidden aspect-video border border-white/5 shadow-2xl">
                            <img src={post.ImageUrl} alt={post.Title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="prose prose-invert prose-zinc max-w-none">
                        <p className="text-xl md:text-2xl leading-[1.6] text-zinc-300 whitespace-pre-wrap tracking-wide font-light">
                            {post.Content}
                        </p>
                    </div>

                    <div className="mt-20 pt-10 border-t border-zinc-800/50 flex items-center gap-8">
                        <motion.button
                            onClick={handleLike}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                                likes.userLiked 
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                        >
                            <svg className="w-6 h-6" fill={likes.userLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-bold text-lg">{likes.count}</span>
                        </motion.button>

                        <div className="flex items-center gap-3 text-zinc-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-medium">{comments.length} Comments</span>
                        </div>
                    </div>
                </motion.div>
            </article>

            <section className="bg-zinc-950/30 border-t border-zinc-900 py-32">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black tracking-tight mb-12">Discourse</h2>
                    
                    {user ? (
                        <form onSubmit={handleAddComment} className="mb-16">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-1 focus-within:border-emerald-500/30 transition-all">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add to the conversation..."
                                    className="w-full bg-transparent p-6 outline-none text-white resize-none h-32 placeholder:text-zinc-700"
                                />
                                <div className="p-3 flex justify-end">
                                    <button
                                        disabled={isSubmitting || !newComment.trim()}
                                        type="submit"
                                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold px-8 py-3 rounded-2xl transition-all"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-16 p-8 rounded-3xl border border-dashed border-zinc-800 text-center">
                            <p className="text-zinc-500 mb-4 font-medium">You must be logged in to comment.</p>
                            <Link href="/login" className="text-emerald-500 font-bold hover:underline underline-offset-8">Sign In &rarr;</Link>
                        </div>
                    )}

                    <div className="space-y-8">
                        <AnimatePresence initial={false}>
                            {comments.map((comment, index) => (
                                <motion.div
                                    key={comment.Id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/40 relative group hover:bg-zinc-900/40 transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                            {comment.AuthorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-none">{comment.AuthorName}</p>
                                            <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-tighter">
                                                {new Date(comment.CreatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 leading-relaxed pl-11 font-light">
                                        {comment.Content}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {comments.length === 0 && (
                            <p className="text-center text-zinc-600 py-10 italic font-medium">No comments yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-zinc-900 flex flex-col items-center gap-6">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                <p className="text-zinc-800 text-xs font-bold tracking-[0.4em] uppercase">DevPulse Interactive Blog</p>
            </footer>
        </div>
    );
};

export default PostDetailsPage;
