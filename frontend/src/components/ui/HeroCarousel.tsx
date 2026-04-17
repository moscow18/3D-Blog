'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Project {
  Id: number;
  Title: string;
  ImageUrl?: string;
  AuthorName: string;
}

interface HeroCarouselProps {
  posts: Project[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ posts }) => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % posts.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  if (posts.length === 0) return null;

  return (
    <div className="relative h-[500px] w-full max-w-5xl mx-auto flex items-center justify-center perspective-1000">
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence initial={false}>
          {posts.map((post, i) => {
            const isCenter = i === index;
            const isLeft = i === (index - 1 + posts.length) % posts.length;
            const isRight = i === (index + 1) % posts.length;

            if (!isCenter && !isLeft && !isRight) return null;

            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 0;
            let scale = 0.8;

            if (isCenter) {
              x = 0;
              z = 0;
              rotateY = 0;
              opacity = 1;
              scale = 1;
            } else if (isLeft) {
              x = -300;
              z = -200;
              rotateY = 35;
              opacity = 0.4;
            } else if (isRight) {
              x = 300;
              z = -200;
              rotateY = -35;
              opacity = 0.4;
            }

            return (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  x,
                  z,
                  rotateY,
                  opacity,
                  scale,
                  zIndex: isCenter ? 10 : 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute w-[350px] h-full rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl cursor-pointer"
                onClick={() => isCenter ? null : setIndex(i)}
              >
                <div className="absolute inset-0 z-0">
                  {post.ImageUrl ? (
                    <img 
                      src={post.ImageUrl} 
                      alt={post.Title} 
                      className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 h-full p-10 flex flex-col justify-end gap-4">
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]"
                    >
                        Featured Story
                    </motion.p>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-black text-white leading-tight tracking-tighter"
                    >
                        {post.Title}
                    </motion.h2>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
                            {post.AuthorName.charAt(0)}
                        </div>
                        <span className="text-zinc-400 text-sm font-medium">{post.AuthorName}</span>
                    </div>
                    {isCenter && (
                        <Link 
                            href={`/posts/${post.Id}`}
                            className="mt-6 px-8 py-4 bg-white text-black text-sm font-black rounded-full hover:bg-emerald-500 transition-all text-center"
                        >
                            Read Full Article
                        </Link>
                    )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-[-80px] flex gap-4">
        <button 
            onClick={prev}
            className="w-14 h-14 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-xl"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <button 
            onClick={next}
            className="w-14 h-14 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-xl"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
