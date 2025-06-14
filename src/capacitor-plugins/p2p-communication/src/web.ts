
import type { P2pCommunicationPlugin, P2pPeer, P2pMessage, PluginListenerHandle } from './definitions';

export class P2pCommunicationWeb implements P2pCommunicationPlugin {
  private peers: P2pPeer[] = [];
  private messages: P2pMessage[] = [];
  private isInitialized = false;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  async initialize(): Promise<{ success: boolean }> {
    console.log('P2P Communication initialized (Web fallback)');
    this.isInitialized = true;
    return { success: true };
  }

  async startWifiDirectDiscovery(): Promise<{ success: boolean }> {
    console.log('Wi-Fi Direct discovery started (Web fallback)');
    // Simulate peer discovery
    setTimeout(() => {
      const mockPeer: P2pPeer = {
        id: 'web-peer-1',
        name: 'Web Simulator Peer',
        connectionType: 'wifi',
        isConnected: false,
        signalStrength: 80
      };
      this.peers.push(mockPeer);
      this.notifyListeners('peerDiscovered', { peer: mockPeer });
    }, 2000);
    return { success: true };
  }

  async stopWifiDirectDiscovery(): Promise<{ success: boolean }> {
    console.log('Wi-Fi Direct discovery stopped (Web fallback)');
    return { success: true };
  }

  async startBluetoothDiscovery(): Promise<{ success: boolean }> {
    console.log('Bluetooth discovery started (Web fallback)');
    return { success: true };
  }

  async stopBluetoothDiscovery(): Promise<{ success: boolean }> {
    console.log('Bluetooth discovery stopped (Web fallback)');
    return { success: true };
  }

  async sendMessage(options: { message: string; messageId: string }): Promise<{ success: boolean }> {
    console.log('Message sent (Web fallback):', options.message);
    // Simulate message delivery
    setTimeout(() => {
      const mockResponse: P2pMessage = {
        id: `response-${Date.now()}`,
        senderId: 'web-peer-1',
        senderName: 'Web Simulator',
        content: `Echo: ${options.message}`,
        timestamp: Date.now(),
        messageType: 'text'
      };
      this.notifyListeners('messageReceived', { message: mockResponse });
    }, 1000);
    return { success: true };
  }

  async addListener(
    eventName: string,
    listenerFunc: (data: any) => void
  ): Promise<PluginListenerHandle> {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listenerFunc);

    return {
      remove: async () => {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
          const index = eventListeners.indexOf(listenerFunc);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      }
    };
  }

  async removeAllListeners(): Promise<void> {
    this.listeners.clear();
  }

  async connectToPeer(options: { peerId: string; connectionType: 'wifi' | 'bluetooth' }): Promise<{ success: boolean }> {
    console.log('Connecting to peer (Web fallback):', options.peerId);
    const peer = this.peers.find(p => p.id === options.peerId);
    if (peer) {
      peer.isConnected = true;
      this.notifyListeners('peerConnected', { peer });
    }
    return { success: true };
  }

  async disconnectFromPeer(options: { peerId: string }): Promise<{ success: boolean }> {
    console.log('Disconnecting from peer (Web fallback):', options.peerId);
    const peer = this.peers.find(p => p.id === options.peerId);
    if (peer) {
      peer.isConnected = false;
      this.notifyListeners('peerDisconnected', { peer });
    }
    return { success: true };
  }

  async getDiscoveredPeers(): Promise<{ peers: P2pPeer[] }> {
    return { peers: this.peers };
  }

  async getConnectedPeers(): Promise<{ peers: P2pPeer[] }> {
    return { peers: this.peers.filter(p => p.isConnected) };
  }

  private notifyListeners(eventName: string, data: any): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in listener for ${eventName}:`, error);
        }
      });
    }
  }
}
