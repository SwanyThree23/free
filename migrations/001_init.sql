-- SwanyThree Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS streams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    evmux_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'stopped',
    rtmp_url TEXT,
    stream_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moderation_logs (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER REFERENCES streams(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    toxicity_score DECIMAL(3,2),
    action VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_streams_user_id ON streams(user_id);
CREATE INDEX idx_moderation_stream_id ON moderation_logs(stream_id);
CREATE INDEX idx_moderation_timestamp ON moderation_logs(timestamp DESC);
