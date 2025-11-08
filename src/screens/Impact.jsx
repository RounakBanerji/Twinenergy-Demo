import React, { useState } from 'react';
import GeminiModal from '../components/GeminiModal';
import { callGeminiAPI } from '../gemini';

const Impact = ({ footprint }) => {
  const [item, setItem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '', isLoading: false, error: '' });

  const handleFindAlternatives = async () => {
    if (!item.trim()) {
      alert('Please enter an item (e.g., Imported Avocados).');
      return;
    }
    setModalContent({ title: `Greener Alternatives to ${item}`, content: '', isLoading: true, error: '' });
    setIsModalOpen(true);

    const prompt = `You are Gemini, a sustainability assistant for a user in Bengaluru, India. Suggest three practical and sustainable alternatives to **${item}**. For each alternative, provide a name and a brief, one-sentence reason why it's greener (local availability, seasonality, lower carbon). Format each suggestion with a bolded title followed by description.`;

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
        <h1 className="text-3xl font-bold text-gray-900">Alternatives</h1>
        <p className="text-gray-500">Dive deep into your footprint.</p>
      </header>
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-lg mb-2">Consumption</h2>
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <p className="text-sm text-gray-600 mb-1">Top Impact Category: <span className="font-semibold">Groceries</span></p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${(footprint?.consumption ?? 0)}%`}}></div>
            </div>

            <p className="text-sm font-medium">Check an item</p>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g., Imported Avocados"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
              <button onClick={handleFindAlternatives} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-200 transition-colors">✨ Find Greener Alternatives</button>
            </div>

          </div>
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

export default Impact;
