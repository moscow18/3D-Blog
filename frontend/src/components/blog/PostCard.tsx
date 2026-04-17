'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { likeService } from '@/services/likeService';
import { useAuth } from '@/context/AuthContext';

interface PostCardProps {
    post: {
        Id: number;
        Title: string;
        Content: string;
        ImageUrl?: string;
        AuthorName: string;
        CreatedAt: string;
    };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState({ count: 0, userLiked: false });
    const [isLiking, setIsLiking] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const data = await likeService.getLikes(post.Id);
                setLikes(data);
            } catch (err) {
                console.error('Error fetching likes for card:', err);
            }
        };
        fetchLikes();
    }, [post.Id, user]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to post page
        e.stopPropagation();

        if (!user) {
            alert('Please login to like posts');
            return;
        }

        setIsLiking(true);
        try {
            const data = await likeService.toggleLike(post.Id);
            setLikes(prev => ({
                count: data.liked ? prev.count + 1 : prev.count - 1,
                userLiked: data.liked
            }));
        } catch (err) {
            console.error('Like failed:', err);
        } finally {
            setTimeout(() => setIsLiking(false), 400);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={`/posts/${post.Id}`}>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateY,
                    rotateX,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                className="relative h-96 w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-end overflow-hidden group transition-colors hover:border-emerald-500/50"
            >
                {/* Background Image */}
                {post.ImageUrl && (
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-40 group-hover:opacity-60" 
                        style={{ backgroundImage: `url(${post.ImageUrl})` }}
                    />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Like Button & Count */}
                <div className="absolute top-4 right-4 z-30 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                        onClick={handleLike}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className={`p-2 rounded-full backdrop-blur-md border ${
                            likes.userLiked 
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-rose-500'
                        } transition-colors ring-0 outline-none`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.svg 
                                key={likes.userLiked ? 'full' : 'empty'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="w-5 h-5" 
                                fill={likes.userLiked ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </motion.svg>
                        </AnimatePresence>
                    </motion.button>
                    <span className="text-white/60 text-xs font-medium">{likes.count}</span>
                </div>

                {/* Content */}
                <div className="relative z-20" style={{ transform: "translateZ(50px)" }}>
                    <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">
                        {new Date(post.CreatedAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                        {post.Title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                            {post.AuthorName.charAt(0)}
                        </div>
                        <span className="text-zinc-400 text-sm">{post.AuthorName}</span>
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                </div>
            </motion.div>
        </Link>
    );
};

export default PostCard;
