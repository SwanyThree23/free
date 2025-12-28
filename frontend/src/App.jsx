import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import Navigation from './components/Navigation';
import EVMuxDashboard from './components/EVMuxDashboard';
import ModerationDashboard from './components/ModerationDashboard';
import AIToolsDashboard from './components/AIToolsDashboard';
import * as api from './utils/api';
import ws from './utils/websocket';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('streams');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      connectWebSocket();
    }
  }, []);

  const connectWebSocket = () => {
    ws.connect();

    ws.on('connected', () => {
      setWsConnected(true);
      console.log('WebSocket connected');
    });

    ws.on('disconnected', () => {
      setWsConnected(false);
      console.log('WebSocket disconnected');
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin
        ? await api.login(email, password)
        : await api.register(email, password);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        connectWebSocket();
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    ws.disconnect();
    setWsConnected(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-earth-bg flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-earth-gold mb-2">SwanyThree</h1>
            <p className="text-earth-text/70">Ultimate AI Streaming Platform</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-earth-text mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-earth-text mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <LogIn size={18} className="mr-2" />
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-earth-gold hover:text-earth-text transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-earth-bg/50 rounded border border-earth-gold/30">
            <h3 className="text-earth-gold font-semibold mb-2">Features:</h3>
            <ul className="text-sm text-earth-text/70 space-y-1">
              <li>• EVMux Cloud Streaming</li>
              <li>• AI Chat Moderation</li>
              <li>• Multi-Tool AI Wrapper</li>
              <li>• Real-time WebSocket Updates</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* WebSocket Status Indicator */}
      <div className="fixed top-20 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          wsConnected
            ? 'bg-earth-success/20 text-earth-success border border-earth-success/30'
            : 'bg-earth-warning/20 text-earth-warning border border-earth-warning/30'
        }`}>
          {wsConnected ? '● Live' : '○ Connecting...'}
        </div>
      </div>

      <main>
        {activeTab === 'streams' && <EVMuxDashboard />}
        {activeTab === 'moderation' && <ModerationDashboard />}
        {activeTab === 'ai-tools' && <AIToolsDashboard />}
      </main>

      <footer className="bg-earth-card border-t-2 border-earth-accent/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-earth-text/50 text-sm">
              SwanyThree Ultimate Edition © 2024
            </p>
            <div className="flex items-center space-x-6 text-sm text-earth-text/50">
              <span>Powered by EVMux, Claude & OpenRouter</span>
              <span className="text-earth-gold">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
