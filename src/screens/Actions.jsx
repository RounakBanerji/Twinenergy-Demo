import DailyChallenge from './DailyChallenge';
import React, { useState } from 'react';
import GeminiModal from '../components/GeminiModal';
import { callGeminiAPI } from '../gemini';

const Actions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '', isLoading: false, error: '' });

    const handlePlanWeek = async () => {
        setModalContent({ title: "Your Sustainable Week Plan", content: '', isLoading: true, error: '' });
        setIsModalOpen(true);

        const goal = "Reduce consumption footprint by 15%";
        const prompt = `You are Gemini, a sustainability assistant for a user in Bengaluru, India. Their goal is to **${goal}**. Create a simple, 3-point sustainable action plan for their upcoming week. The plan should be encouraging and easy to follow. Provide one specific food tip, one travel tip, and one digital usage tip. Format each tip with a bolded title (e.g., **Food Tip:**) followed by the suggestion.`;
        
        const result = await callGeminiAPI(prompt);

        if (result) {
            setModalContent(prev => ({ ...prev, content: result, isLoading: false }));
        } else {
            setModalContent(prev => ({ ...prev, error: "Could not get a response from Gemini. Please try again later.", isLoading: false }));
        }
    };

    return (
        <>
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Life Tips</h1>
                <p className="text-gray-500">Your personalized path to sustainability.</p>
            </header>
            <div className="space-y-4">
                <h2 className="font-bold text-lg">Your Goals</h2>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                    <p className="font-semibold">Reduce consumption footprint by 15%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <p className="text-sm text-gray-500">You're 45% of the way there this month!</p>
                </div>

                <h2 className="font-bold text-lg pt-4">Gemini Planner</h2>
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <p className="text-gray-600 text-sm mb-3">Let Gemini help you build a sustainable weekly routine based on your goals.</p>
                    <button onClick={handlePlanWeek} className="bg-indigo-500 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-600 transition-colors">✨ Plan My Sustainable Week</button>
                </div>
            </div>
             <GeminiModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalContent.title}
                content={modalContent.content}
                isLoading={modalContent.isLoading}
                error={modalContent.error}
            />
        </>
    );
};
<DailyChallenge />
export default Actions;
