import axios from 'axios';

class EVMuxService {
  constructor() {
    this.apiKey = process.env.EVMUX_API_KEY;
    this.appId = process.env.EVMUX_APP_ID;
    this.baseUrl = 'https://api.evmux.com/v1';
  }

  async createStream(name) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/streams`,
        {
          name,
          app_id: this.appId,
          recording_enabled: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        evmux_id: response.data.id,
        rtmp_url: response.data.rtmp_url,
        stream_key: response.data.stream_key,
        status: 'stopped'
      };
    } catch (error) {
      console.error('EVMux create stream error:', error.response?.data || error.message);
      throw new Error('Failed to create stream');
    }
  }

  async startStream(evmuxId) {
    try {
      await axios.post(
        `${this.baseUrl}/streams/${evmuxId}/start`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return { status: 'live' };
    } catch (error) {
      console.error('EVMux start stream error:', error.response?.data || error.message);
      throw new Error('Failed to start stream');
    }
  }

  async stopStream(evmuxId) {
    try {
      await axios.post(
        `${this.baseUrl}/streams/${evmuxId}/stop`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return { status: 'stopped' };
    } catch (error) {
      console.error('EVMux stop stream error:', error.response?.data || error.message);
      throw new Error('Failed to stop stream');
    }
  }

  async deleteStream(evmuxId) {
    try {
      await axios.delete(
        `${this.baseUrl}/streams/${evmuxId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return { success: true };
    } catch (error) {
      console.error('EVMux delete stream error:', error.response?.data || error.message);
      throw new Error('Failed to delete stream');
    }
  }

  async getStreamStatus(evmuxId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/streams/${evmuxId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return {
        status: response.data.status,
        viewers: response.data.viewer_count || 0
      };
    } catch (error) {
      console.error('EVMux get status error:', error.response?.data || error.message);
      throw new Error('Failed to get stream status');
    }
  }
}

export default new EVMuxService();
