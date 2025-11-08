import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
        <div className="border-4 border-gray-200 w-9 h-9 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-semibold">Contacting Gemini...</p>
    </div>
);

const GeminiModal = ({ isOpen, onClose, title, content, isLoading, error }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        {isLoading && <Spinner />}
                        
                        {error && !isLoading && (
                            <div>
                                <h3 className="font-bold text-lg text-red-600 mb-2">An Error Occurred</h3>
                                <p className="text-sm text-gray-700">{error}</p>
                            </div>
                        )}

                        {content && !isLoading && !error && (
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>
                                <div className="text-sm text-gray-700 space-y-2" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GeminiModal;
