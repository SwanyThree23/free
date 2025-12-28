import React from 'react';
import { Play, Square, Trash2, Copy, ExternalLink } from 'lucide-react';

export default function StreamCard({ stream, onStart, onStop, onDelete }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const statusColors = {
    live: 'text-earth-success',
    stopped: 'text-earth-text/50',
    starting: 'text-earth-warning'
  };

  return (
    <div className="bg-gradient-to-br from-earth-card to-earth-bg border-2 border-earth-accent/30 rounded-lg p-6 hover:border-earth-gold/50 transition-all shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-earth-text">{stream.name}</h3>
          <p className={`text-sm mt-1 ${statusColors[stream.status]}`}>
            Status: {stream.status.toUpperCase()}
          </p>
        </div>
        <div className="flex space-x-2">
          {stream.status === 'stopped' && (
            <button
              onClick={() => onStart(stream.id)}
              className="p-2 bg-gradient-to-r from-earth-success to-[#5a7340] text-white rounded-lg hover:shadow-lg transition-all"
              title="Start Stream"
            >
              <Play size={18} />
            </button>
          )}
          {stream.status === 'live' && (
            <button
              onClick={() => onStop(stream.id)}
              className="p-2 bg-gradient-to-r from-earth-warning to-[#a66840] text-white rounded-lg hover:shadow-lg transition-all"
              title="Stop Stream"
            >
              <Square size={18} />
            </button>
          )}
          <button
            onClick={() => onDelete(stream.id)}
            className="p-2 bg-gradient-to-r from-earth-accent to-[#6b1f2a] text-white rounded-lg hover:shadow-lg transition-all"
            title="Delete Stream"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-earth-bg/50 p-3 rounded border border-earth-accent/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-earth-text/70">RTMP URL</span>
            <button
              onClick={() => copyToClipboard(stream.rtmp_url)}
              className="text-earth-gold hover:text-earth-text transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
          <p className="text-sm text-earth-text font-mono break-all">{stream.rtmp_url}</p>
        </div>

        <div className="bg-earth-bg/50 p-3 rounded border border-earth-accent/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-earth-text/70">Stream Key</span>
            <button
              onClick={() => copyToClipboard(stream.stream_key)}
              className="text-earth-gold hover:text-earth-text transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
          <p className="text-sm text-earth-text font-mono break-all">
            {stream.stream_key ? '••••••••' : 'Not available'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-earth-text/50">
          <span>Created: {new Date(stream.created_at).toLocaleDateString()}</span>
          <span>ID: {stream.id}</span>
        </div>
      </div>
    </div>
  );
}
