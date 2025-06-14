
import type { P2pCommunicationPlugin } from './definitions';

// Simple mock implementation for web
const P2pCommunication: P2pCommunicationPlugin = {
  async initialize() {
    console.log('P2P Communication initialized (Web fallback)');
    return { success: true };
  },

  async startWifiDirectDiscovery() {
    console.log('Wi-Fi Direct discovery started (Web fallback)');
    return { success: true };
  },

  async stopWifiDirectDiscovery() {
    console.log('Wi-Fi Direct discovery stopped (Web fallback)');
    return { success: true };
  },

  async startBluetoothDiscovery() {
    console.log('Bluetooth discovery started (Web fallback)');
    return { success: true };
  },

  async stopBluetoothDiscovery() {
    console.log('Bluetooth discovery stopped (Web fallback)');
    return { success: true };
  },

  async sendMessage() {
    console.log('Message sent (Web fallback)');
    return { success: true };
  },

  async connectToPeer() {
    console.log('Connecting to peer (Web fallback)');
    return { success: true };
  },

  async disconnectFromPeer() {
    console.log('Disconnecting from peer (Web fallback)');
    return { success: true };
  },

  async getDiscoveredPeers() {
    return { peers: [] };
  },

  async getConnectedPeers() {
    return { peers: [] };
  },

  async addListener() {
    return { remove: async () => {} };
  },

  async removeAllListeners() {
    return;
  }
};

export * from './definitions';
export { P2pCommunication };
