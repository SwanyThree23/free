import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import StreamCard from './StreamCard';
import * as api from '../utils/api';

export default function EVMuxDashboard() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStreamName, setNewStreamName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const response = await api.getStreams();
      setStreams(response.data.streams);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    if (!newStreamName.trim()) return;

    setLoading(true);
    try {
      await api.createStream(newStreamName);
      setNewStreamName('');
      setShowCreateForm(false);
      fetchStreams();
    } catch (error) {
      console.error('Failed to create stream:', error);
      alert('Failed to create stream. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartStream = async (id) => {
    setLoading(true);
    try {
      await api.startStream(id);
      fetchStreams();
    } catch (error) {
      console.error('Failed to start stream:', error);
      alert('Failed to start stream. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopStream = async (id) => {
    setLoading(true);
    try {
      await api.stopStream(id);
      fetchStreams();
    } catch (error) {
      console.error('Failed to stop stream:', error);
      alert('Failed to stop stream. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStream = async (id) => {
    if (!confirm('Are you sure you want to delete this stream?')) return;

    setLoading(true);
    try {
      await api.deleteStream(id);
      fetchStreams();
    } catch (error) {
      console.error('Failed to delete stream:', error);
      alert('Failed to delete stream. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-earth-gold">EVMux Streaming</h2>
          <p className="text-earth-text/70 mt-2">Manage your live streams with cloud-powered EVMux</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchStreams}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-earth-card border-2 border-earth-accent/30 text-earth-text rounded-lg hover:border-earth-gold transition-all"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={18} className="mr-2" />
            New Stream
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateStream} className="mb-8 bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-gold/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-earth-text mb-4">Create New Stream</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newStreamName}
              onChange={(e) => setNewStreamName(e.target.value)}
              placeholder="Stream name..."
              className="flex-1 px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-earth-success to-[#5a7340] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 bg-earth-card border-2 border-earth-accent/30 text-earth-text rounded-lg hover:border-earth-warning transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {streams.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-earth-text/50 text-lg">No streams yet. Create your first stream to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map(stream => (
          <StreamCard
            key={stream.id}
            stream={stream}
            onStart={handleStartStream}
            onStop={handleStopStream}
            onDelete={handleDeleteStream}
          />
        ))}
      </div>
    </div>
  );
}
