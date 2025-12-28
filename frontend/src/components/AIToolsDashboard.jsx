import React, { useState } from 'react';
import { MessageSquare, Compress, Mic, Send, Sparkles } from 'lucide-react';
import * as api from '../utils/api';

export default function AIToolsDashboard() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [compressText, setCompressText] = useState('');
  const [compressRate, setCompressRate] = useState(0.5);
  const [compressResult, setCompressResult] = useState(null);
  const [compressLoading, setCompressLoading] = useState(false);

  const [podcastTopic, setPodcastTopic] = useState('');
  const [podcastDuration, setPodcastDuration] = useState('medium');
  const [podcastResult, setPodcastResult] = useState(null);
  const [podcastLoading, setPodcastLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await api.chatCompletion(updatedMessages);
      if (response.data.success) {
        setChatMessages([...updatedMessages, {
          role: 'assistant',
          content: response.data.content
        }]);
      } else {
        alert('Chat failed: ' + response.data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      alert('Chat failed. Check console for details.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleCompress = async (e) => {
    e.preventDefault();
    if (!compressText.trim()) return;

    setCompressLoading(true);
    try {
      const response = await api.compressText(compressText, compressRate);
      setCompressResult(response.data);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Compression failed. Check console for details.');
    } finally {
      setCompressLoading(false);
    }
  };

  const handlePodcastGenerate = async (e) => {
    e.preventDefault();
    if (!podcastTopic.trim()) return;

    setPodcastLoading(true);
    try {
      const response = await api.generatePodcast(podcastTopic, podcastDuration);
      setPodcastResult(response.data);
    } catch (error) {
      console.error('Podcast generation error:', error);
      alert('Podcast generation failed. Check console for details.');
    } finally {
      setPodcastLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'compress', label: 'Text Compression', icon: Compress },
    { id: 'podcast', label: 'Podcast Generator', icon: Mic }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-earth-gold">AI Tools Wrapper</h2>
        <p className="text-earth-text/70 mt-2">Multi-model AI capabilities in one unified interface</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white'
                  : 'bg-earth-card border-2 border-earth-accent/30 text-earth-text hover:border-earth-gold'
              }`}
            >
              <Icon size={18} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Sparkles size={24} className="text-earth-gold mr-2" />
            <h3 className="text-xl font-bold text-earth-text">OpenRouter Chat</h3>
          </div>

          <div className="bg-earth-bg/50 rounded-lg p-4 mb-4 h-96 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-earth-text/50 text-center py-16">Start a conversation...</p>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-earth-accent/20 ml-12'
                      : 'bg-earth-success/20 mr-12'
                  }`}
                >
                  <p className="text-sm text-earth-gold mb-1">{msg.role === 'user' ? 'You' : 'AI'}</p>
                  <p className="text-earth-text whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="text-center text-earth-text/50">
                <Sparkles size={24} className="animate-spin inline" />
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Compress Tab */}
      {activeTab === 'compress' && (
        <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Compress size={24} className="text-earth-gold mr-2" />
            <h3 className="text-xl font-bold text-earth-text">LLMLingua Text Compression</h3>
          </div>

          <form onSubmit={handleCompress} className="space-y-4">
            <textarea
              value={compressText}
              onChange={(e) => setCompressText(e.target.value)}
              placeholder="Enter text to compress..."
              rows={6}
              className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
            />

            <div>
              <label className="block text-earth-text mb-2">
                Compression Rate: {(compressRate * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={compressRate}
                onChange={(e) => setCompressRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={compressLoading}
              className="px-6 py-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {compressLoading ? 'Compressing...' : 'Compress Text'}
            </button>
          </form>

          {compressResult && compressResult.success && (
            <div className="mt-6 p-4 bg-earth-bg/50 rounded-lg border border-earth-gold/30">
              <h4 className="text-earth-gold font-semibold mb-2">Result</h4>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-earth-text/70">Original Length</p>
                  <p className="text-earth-text font-mono">{compressResult.original_length}</p>
                </div>
                <div>
                  <p className="text-earth-text/70">Compressed Length</p>
                  <p className="text-earth-text font-mono">{compressResult.compressed_length}</p>
                </div>
                <div>
                  <p className="text-earth-text/70">Ratio</p>
                  <p className="text-earth-success font-mono">{compressResult.compression_ratio}</p>
                </div>
              </div>
              <p className="text-earth-text whitespace-pre-wrap">{compressResult.compressed_text}</p>
            </div>
          )}
        </div>
      )}

      {/* Podcast Tab */}
      {activeTab === 'podcast' && (
        <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Mic size={24} className="text-earth-gold mr-2" />
            <h3 className="text-xl font-bold text-earth-text">NotebookLM Podcast Generator</h3>
          </div>

          <form onSubmit={handlePodcastGenerate} className="space-y-4">
            <input
              type="text"
              value={podcastTopic}
              onChange={(e) => setPodcastTopic(e.target.value)}
              placeholder="Enter podcast topic..."
              className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
            />

            <div>
              <label className="block text-earth-text mb-2">Duration</label>
              <select
                value={podcastDuration}
                onChange={(e) => setPodcastDuration(e.target.value)}
                className="w-full px-4 py-2 bg-earth-bg border-2 border-earth-accent/30 text-earth-text rounded-lg focus:border-earth-gold focus:outline-none"
              >
                <option value="short">Short (~500 words)</option>
                <option value="medium">Medium (~1000 words)</option>
                <option value="long">Long (~2000 words)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={podcastLoading}
              className="px-6 py-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {podcastLoading ? 'Generating...' : 'Generate Podcast'}
            </button>
          </form>

          {podcastResult && podcastResult.success && (
            <div className="mt-6 p-4 bg-earth-bg/50 rounded-lg border border-earth-gold/30">
              <h4 className="text-earth-gold font-semibold mb-2">Podcast Script</h4>
              <div className="flex items-center justify-between text-sm text-earth-text/70 mb-4">
                <span>Topic: {podcastResult.topic}</span>
                <span>Words: {podcastResult.word_count}</span>
              </div>
              <div className="text-earth-text whitespace-pre-wrap max-h-96 overflow-y-auto">
                {podcastResult.script}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
