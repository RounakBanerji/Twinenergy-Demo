import React, { useEffect, useState } from 'react';
import { callGeminiAPI } from '../gemini';
import { loadData, saveData } from '../utils/storage';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(loadData('todayChallenge') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadData('todayChallenge');
    // if saved and same day, keep; otherwise clear
    if (saved && new Date(saved.date).toDateString() === new Date().toDateString()) {
      setChallenge(saved);
    } else {
      setChallenge(null);
    }
  }, []);

  const generate = async () => {
    setLoading(true);
    const prompt = `You are a friendly sustainability assistant. Create a single very short daily challenge for a user in Bengaluru (one sentence). The challenge should be actionable (e.g., "Skip using plastic bottles today").`;
    const res = await callGeminiAPI(prompt);
    setLoading(false);
    if (res) {
      const obj = { date: new Date().toISOString(), text: res.trim() };
      setChallenge(obj);
      saveData('todayChallenge', obj);
    } else {
      alert('Could not fetch challenge right now.');
    }
  };

  const markDone = () => {
    if (!challenge) return;
    // increment simple metric
    const meta = loadData('userMeta') || { totalReduction: 0, travelSaved: 0, electricitySaved: 0 };
    meta.totalReduction = (meta.totalReduction || 0) + 1;
    saveData('userMeta', meta);
    alert('Great! Marked complete.');
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
      <h3 className="font-bold mb-2">Daily Eco Challenge</h3>
      {challenge ? (
        <>
          <div className="text-sm mb-2" style={{ whiteSpace: 'pre-wrap' }}>{challenge.text}</div>
          <div className="flex gap-2">
            <button onClick={markDone} className="bg-emerald-500 text-white px-3 py-1.5 rounded-full">Done</button>
            <button onClick={generate} className="bg-gray-100 px-3 py-1.5 rounded-full">Regenerate</button>
          </div>
        </>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-2">No challenge for today yet.</p>
          <button onClick={generate} className="bg-indigo-600 text-white px-4 py-2 rounded-full">Generate Today's Challenge</button>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;
