import React, { useEffect, useState } from 'react';
import { loadData, saveData } from '../utils/storage';

const BADGE_CONFIG = [
  { id: 'eco_starter', title: 'Eco Starter', rule: (s) => s.totalReduction >= 5 },
  { id: 'travel_saver', title: 'Travel Saver', rule: (s) => s.travelSaved >= 5 },
  { id: 'power_saver', title: 'Power Saver', rule: (s) => s.electricitySaved >= 10 },
];

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', joined: '', avatarUrl: '' });
  const [meta, setMeta] = useState(loadData('userMeta') || { totalReduction: 0, travelSaved: 0, electricitySaved: 0 });
  const [badges, setBadges] = useState(() => loadData('userBadges') || {});

  useEffect(() => {
    const saved = loadData('userProfile');
    if (saved) setProfile(saved);
  }, []);

  useEffect(() => saveData('userProfile', profile), [profile]);
  useEffect(() => saveData('userMeta', meta), [meta]);

  useEffect(() => {
    // compute badges
    const newBadges = { ...badges };
    BADGE_CONFIG.forEach(b => {
      if (!newBadges[b.id] && b.rule(meta)) newBadges[b.id] = { unlockedAt: new Date().toISOString(), title: b.title };
    });
    if (JSON.stringify(newBadges) !== JSON.stringify(badges)) {
      setBadges(newBadges);
      saveData('userBadges', newBadges);
    }
  }, [meta]);

  const handleChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const resetAll = () => {
    if (!confirm('Reset all local data? This cannot be undone.')) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500">Manage your account and achievements.</p>
      </header>

      <div className="text-center mb-6">
        <img src={profile.avatarUrl || 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=U'} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-3 ring-4 ring-emerald-200"/>
        <h2 className="text-2xl font-bold">{profile.name || 'Your name'}</h2>
        <p className="text-gray-500">Joined: {profile.joined || '—'}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md space-y-3">
        <label className="text-sm block">Full name
          <input name="name" value={profile.name} onChange={handleChange} className="w-full mt-1 border rounded p-2 text-sm"/>
        </label>
        <label className="text-sm block">Joined
          <input name="joined" value={profile.joined} onChange={handleChange} className="w-full mt-1 border rounded p-2 text-sm"/>
        </label>
        <label className="text-sm block">Avatar URL
          <input name="avatarUrl" value={profile.avatarUrl} onChange={handleChange} className="w-full mt-1 border rounded p-2 text-sm"/>
        </label>
        <button onClick={() => { saveData('userProfile', profile); alert('Saved'); }} className="w-full mt-2 bg-emerald-500 text-white py-2 rounded-lg font-semibold">Save</button>
      </div>

      <div className="mt-6 bg-white p-4 rounded-2xl shadow-md">
        <h3 className="font-bold mb-3">Your Badges</h3>
        <div className="flex gap-3 flex-wrap">
          {Object.keys(badges).length === 0 && <p className="text-sm text-gray-500">No badges yet — keep going!</p>}
          {Object.entries(badges).map(([id, b]) => (
            <div key={id} className="p-3 bg-emerald-50 rounded-lg border">
              <div className="font-semibold">{b.title}</div>
              <div className="text-xs text-gray-500">{new Date(b.unlockedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button onClick={resetAll} className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-100 transition-colors">Reset All Local Data</button>
      </div>
    </>
  );
};

export default Profile;
