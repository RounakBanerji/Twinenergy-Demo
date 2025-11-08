import React, { useEffect, useState } from 'react';
import GeminiModal from '../components/GeminiModal';
import { callGeminiAPI } from '../gemini';
import { loadData, saveData } from '../utils/storage';

const Community = () => {
  const [challengeTheme, setChallengeTheme] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '', isLoading: false, error: '' });
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const saved = loadData('communityChallenges');
    if (saved) setChallenges(saved);
  }, []);

  useEffect(() => {
    saveData('communityChallenges', challenges);
  }, [challenges]);

  const handleBrainstorm = async () => {
    if (!challengeTheme.trim()) {
      alert("Please enter a theme for the challenge.");
      return;
    }

    setModalContent({ title: `Challenge Ideas for "${challengeTheme}"`, content: '', isLoading: true, error: '' });
    setIsModalOpen(true);

    const prompt = `You are a creative assistant for a sustainability app. Generate 3 creative and engaging community challenge ideas based on the theme: **"${challengeTheme}"**. For each idea, provide a catchy title and a one-sentence description. Format each suggestion with a bolded title followed by the description.`;
    const result = await callGeminiAPI(prompt);

    if (result) {
      setModalContent(prev => ({ ...prev, content: result, isLoading: false }));
      // Also add a simple challenge entry locally so user sees it immediately
      setChallenges(prev => [{ id: Date.now(), title: challengeTheme, description: result, joined: false }, ...prev]);
      setChallengeTheme('');
    } else {
      setModalContent(prev => ({ ...prev, error: "Could not get a response from Gemini. Please try again later.", isLoading: false }));
    }
  };

  const toggleJoin = (id) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined } : c));
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-500">Take collective action for a bigger impact.</p>
      </header>
      <div className="space-y-6">
        <h2 className="font-bold text-lg">Active Challenges</h2>
        <div className="space-y-3">
          {challenges.length === 0 && (
            <div className="bg-white p-4 rounded-2xl shadow-md">No challenges yet — suggest one below!</div>
          )}
          {challenges.map(ch => (
            <div key={ch.id} className="bg-white p-4 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <h3 className="font-bold text-lg text-emerald-700">{ch.title}</h3>
              <div className="text-sm text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: ch.description.replace(/\n/g, '<br/>') }} />
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{ch.joined ? 'Joined' : 'Not joined'}</p>
                <button onClick={() => toggleJoin(ch.id)} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${ch.joined ? 'bg-gray-200' : 'bg-emerald-500 text-white'}`}>{ch.joined ? 'Leave' : 'Join'}</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-bold text-lg pt-4">Suggest a New Challenge</h2>
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-sm text-gray-600 mb-2">Have an idea? Let's brainstorm with AI!</p>
          <input
            type="text"
            value={challengeTheme}
            onChange={(e) => setChallengeTheme(e.target.value)}
            placeholder="E.g., 'Reduce plastic waste'"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button onClick={handleBrainstorm} className="w-full mt-3 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-600">✨ Brainstorm Ideas</button>
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

export default Community;
