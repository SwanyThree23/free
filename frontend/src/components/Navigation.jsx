import React from 'react';
import { Radio, Shield, Sparkles, LogOut } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, user, onLogout }) {
  const tabs = [
    { id: 'streams', label: 'Streams', icon: Radio },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
  ];

  return (
    <nav className="bg-gradient-to-r from-earth-card to-earth-bg border-b-2 border-earth-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-earth-gold">SwanyThree</h1>
            <span className="ml-3 text-sm text-earth-text/60">Ultimate Edition</span>
          </div>

          <div className="flex items-center space-x-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white shadow-lg'
                      : 'text-earth-text/70 hover:text-earth-gold hover:bg-earth-card/50'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-earth-text/70 text-sm">{user?.email}</span>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-lg text-earth-warning hover:bg-earth-card/50 transition-all"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
