import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Ban, Send } from 'lucide-react';
import * as api from '../utils/api';
import ws from '../utils/websocket';

export default function ModerationDashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [testMessage, setTestMessage] = useState('');
  const [testUsername, setTestUsername] = useState('TestUser');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchStats();

    // Listen for real-time moderation events
    const handleModerationAction = (data) => {
      fetchLogs();
      fetchStats();
    };

    ws.on('moderation:action', handleModerationAction);

    return () => {
      ws.off('moderation:action', handleModerationAction);
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.getModerationLogs(null, 50);
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getModerationStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAnalyzeMessage = async (e) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    setAnalyzing(true);
    try {
      const response = await api.analyzeMessage(testMessage, testUsername);
      setTestMessage('');
      fetchLogs();
      fetchStats();

      alert(`Analysis Complete:\nToxicity Score: ${response.data.toxicity_score}\nAction: ${response.data.action}`);
    } catch (error) {
      console.error('Failed to analyze message:', error);
      alert('Failed to analyze message. Check console for details.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getToxicityColor = (score) => {
    if (score >= 0.7) return 'text-earth-accent';
    if (score >= 0.5) return 'text-earth-warning';
    return 'text-earth-success';
  };

  const getActionIcon = (action) => {
    if (action === 'ban') return <Ban size={16} className="text-earth-accent" />;
    if (action === 'warning') return <AlertTriangle size={16} className="text-earth-warning" />;
    return <CheckCircle size={16} className="text-earth-success" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-earth-gold">AI Chat Moderation</h2>
        <p className="text-earth-text/70 mt-2">Real-time toxicity detection and automated moderation</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-text/70 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-earth-text mt-1">{stats.total_messages || 0}</p>
              </div>
              <Shield size={32} className="text-earth-gold" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-text/70 text-sm">Avg Toxicity</p>
                <p className="text-3xl font-bold text-earth-success mt-1">
                  {stats.avg_toxicity ? (parseFloat(stats.avg_toxicity) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <CheckCircle size={32} className="text-earth-success" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-text/70 text-sm">Warnings</p>
                <p className="text-3xl font-bold text-earth-warning mt-1">{stats.total_warnings || 0}</p>
              </div>
              <AlertTriangle size={32} className="text-earth-warning" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-text/70 text-sm">Bans</p>
                <p className="text-3xl font-bold text-earth-accent mt-1">{stats.total_bans || 0}</p>
              </div>
              <Ban size={32} className="text-earth-accent" />
            </div>
          </div>
        </div>
      )}

      {/* Test Message Form */}
      <form onSubmit={handleAnalyzeMessage} className="mb-8 bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-gold/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-earth-text mb-4">Test Message Analysis</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={testUsername}
            onChange={(e) => setTestUsername(e.target.value)}
            placeholder="Username..."
            className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
          />
          <div className="flex space-x-3">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Type a message to analyze..."
              className="flex-1 px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={analyzing}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={18} className="mr-2" />
              Analyze
            </button>
          </div>
        </div>
      </form>

      {/* Moderation Logs */}
      <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-earth-text mb-4">Recent Moderation Logs</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-earth-text/50 text-center py-8">No moderation logs yet</p>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="bg-earth-bg/50 border border-earth-accent/20 rounded-lg p-4 hover:border-earth-gold/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    <span className="font-semibold text-earth-text">{log.username}</span>
                    {log.stream_name && (
                      <span className="text-earth-text/50 text-sm">in {log.stream_name}</span>
                    )}
                  </div>
                  <span className={`text-sm font-mono ${getToxicityColor(parseFloat(log.toxicity_score))}`}>
                    {(parseFloat(log.toxicity_score) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-earth-text/80 text-sm mb-2">{log.message}</p>
                <div className="flex items-center justify-between text-xs text-earth-text/50">
                  <span className="px-2 py-1 bg-earth-accent/20 rounded">
                    {log.action.toUpperCase()}
                  </span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
