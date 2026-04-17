'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
                    >
                        <div className="bg-zinc-900/90 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                    {message}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        disabled={isLoading}
                                        onClick={onConfirm}
                                        className="w-full py-4 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20"
                                    >
                                        {isLoading ? 'Processing...' : confirmText}
                                    </button>
                                    <button
                                        disabled={isLoading}
                                        onClick={onCancel}
                                        className="w-full py-4 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold rounded-2xl transition-all"
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
