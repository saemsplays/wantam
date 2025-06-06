
export interface P2pCommunicationPlugin {
  /**
   * Initialize the P2P communication system
   */
  initialize(): Promise<{ success: boolean }>;

  /**
   * Start Wi-Fi Direct discovery
   */
  startWifiDirectDiscovery(): Promise<{ success: boolean }>;

  /**
   * Stop Wi-Fi Direct discovery
   */
  stopWifiDirectDiscovery(): Promise<{ success: boolean }>;

  /**
   * Start Bluetooth discovery
   */
  startBluetoothDiscovery(): Promise<{ success: boolean }>;

  /**
   * Stop Bluetooth discovery
   */
  stopBluetoothDiscovery(): Promise<{ success: boolean }>;

  /**
   * Send message to all connected peers
   */
  sendMessage(options: { message: string; messageId: string }): Promise<{ success: boolean }>;

  /**
   * Connect to a discovered peer
   */
  connectToPeer(options: { peerId: string; connectionType: 'wifi' | 'bluetooth' }): Promise<{ success: boolean }>;

  /**
   * Disconnect from a peer
   */
  disconnectFromPeer(options: { peerId: string }): Promise<{ success: boolean }>;

  /**
   * Get list of discovered peers
   */
  getDiscoveredPeers(): Promise<{ peers: P2pPeer[] }>;

  /**
   * Get list of connected peers
   */
  getConnectedPeers(): Promise<{ peers: P2pPeer[] }>;

  /**
   * Add listeners for P2P events
   */
  addListener(eventName: 'peerDiscovered', listenerFunc: (event: { peer: P2pPeer }) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'peerConnected', listenerFunc: (event: { peer: P2pPeer }) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'peerDisconnected', listenerFunc: (event: { peer: P2pPeer }) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'messageReceived', listenerFunc: (event: { message: P2pMessage }) => void): Promise<PluginListenerHandle>;
  addListener(eventName: 'connectionError', listenerFunc: (event: { error: string }) => void): Promise<PluginListenerHandle>;

  /**
   * Remove all listeners
   */
  removeAllListeners(): Promise<void>;
}

export interface P2pPeer {
  id: string;
  name: string;
  connectionType: 'wifi' | 'bluetooth';
  isConnected: boolean;
  signalStrength?: number;
}

export interface P2pMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  messageType: 'text' | 'voice' | 'file';
}

export interface PluginListenerHandle {
  remove: () => Promise<void>;
}
