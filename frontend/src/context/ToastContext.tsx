'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                px-6 py-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-center gap-4 min-w-[300px]
                                ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                  toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
                                  'bg-blue-500/10 border-blue-500/20 text-blue-400'}
                            `}>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    toast.type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                                    toast.type === 'error' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 
                                    'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
                                }`} />
                                
                                <span className="text-sm font-bold tracking-tight">{toast.message}</span>
                                
                                <button 
                                    onClick={() => removeToast(toast.id)}
                                    className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
