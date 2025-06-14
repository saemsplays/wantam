import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Radio, Send, X, Mic, MicOff, Volume2, Users, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineRadioSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'voice';
}

// Mesh Network Protocol Implementation
class MeshNode {
  constructor(nodeId, onMessage, onPeerUpdate) {
    this.nodeId = nodeId;
    this.peers = new Map(); // peerId -> RTCDataChannel
    this.connections = new Map(); // peerId -> RTCPeerConnection
    this.routingTable = new Map(); // destination -> { nextHop, hopCount }
    this.messageHistory = new Set(); // for duplicate detection
    this.onMessage = onMessage;
    this.onPeerUpdate = onPeerUpdate;
    this.sequenceNumber = 0;
  }

  // AODV-inspired routing protocol
  updateRoutingTable(destination, nextHop, hopCount) {
    const existing = this.routingTable.get(destination);
    if (!existing || existing.hopCount > hopCount) {
      this.routingTable.set(destination, { nextHop, hopCount });
    }
  }

  broadcastRouteDiscovery(destination) {
    const rreq = {
      type: 'RREQ',
      id: `${this.nodeId}-${++this.sequenceNumber}`,
      source: this.nodeId,
      destination,
      hopCount: 0,
      timestamp: Date.now()
    };
    
    this.broadcast(rreq);
  }

  handleRouteRequest(rreq, fromPeer) {
    const messageId = rreq.id;
    if (this.messageHistory.has(messageId)) return;
    
    this.messageHistory.add(messageId);
    this.updateRoutingTable(rreq.source, fromPeer, rreq.hopCount + 1);

    if (rreq.destination === this.nodeId) {
      // Send route reply
      const rrep = {
        type: 'RREP',
        id: `${this.nodeId}-${++this.sequenceNumber}`,
        source: rreq.source,
        destination: this.nodeId,
        hopCount: 0
      };
      this.sendToPeer(fromPeer, rrep);
    } else {
      // Forward RREQ
      rreq.hopCount++;
      this.broadcast(rreq, fromPeer);
    }
  }

  handleRouteReply(rrep, fromPeer) {
    this.updateRoutingTable(rrep.destination, fromPeer, rrep.hopCount + 1);
    
    if (rrep.source !== this.nodeId) {
      const route = this.routingTable.get(rrep.source);
      if (route) {
        rrep.hopCount++;
        this.sendToPeer(route.nextHop, rrep);
      }
    }
  }

  routeMessage(message) {
    const messageId = `${message.sender}-${message.timestamp}`;
    if (this.messageHistory.has(messageId)) return;
    
    this.messageHistory.add(messageId);

    if (message.destination === this.nodeId || message.destination === 'broadcast') {
      this.onMessage(message);
    }

    if (message.destination === 'broadcast') {
      this.broadcast(message);
    } else {
      const route = this.routingTable.get(message.destination);
      if (route) {
        this.sendToPeer(route.nextHop, message);
      } else {
        this.broadcastRouteDiscovery(message.destination);
        // Queue message for later
        setTimeout(() => this.routeMessage(message), 1000);
      }
    }
  }

  broadcast(message, excludePeer = null) {
    for (const [peerId, channel] of this.peers) {
      if (peerId !== excludePeer && channel.readyState === 'open') {
        this.sendToPeer(peerId, message);
      }
    }
  }

  sendToPeer(peerId, message) {
    const channel = this.peers.get(peerId);
    if (channel && channel.readyState === 'open') {
      try {
        channel.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to peer:', error);
      }
    }
  }

  addPeer(peerId, channel, connection) {
    this.peers.set(peerId, channel);
    this.connections.set(peerId, connection);
    this.updateRoutingTable(peerId, peerId, 1);
    this.onPeerUpdate(Array.from(this.peers.keys()));
  }

  removePeer(peerId) {
    this.peers.delete(peerId);
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.close();
      this.connections.delete(peerId);
    }
    this.routingTable.delete(peerId);
    this.onPeerUpdate(Array.from(this.peers.keys()));
  }
}

// WebRTC Connection Manager
class WebRTCManager {
  constructor(onMessage, onPeerUpdate) {
    this.localId = Math.random().toString(36).substring(2, 15);
    this.meshNode = new MeshNode(this.localId, onMessage, onPeerUpdate);
    this.signalingSocket = null;
    this.isConnected = false;
    this.pendingConnections = new Map();
  }

  async initialize() {
    // Try to connect to signaling server - replace with your actual server URL
    try {
      const wsUrl = window.location.protocol === 'https:' 
        ? 'wss://your-signaling-server.herokuapp.com/signaling'
        : 'ws://localhost:8080/signaling';
        
      this.signalingSocket = new WebSocket(wsUrl);
      
      this.signalingSocket.onopen = () => {
        console.log('✅ Connected to signaling server');
        this.isConnected = true;
        this.signalingSocket.send(JSON.stringify({
          type: 'join',
          id: this.localId,
          room: 'mesh-radio'
        }));
      };

      this.signalingSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleSignalingMessage(data);
      };

      this.signalingSocket.onclose = () => {
        console.log('❌ Signaling server disconnected');
        this.isConnected = false;
        // Attempt reconnection
        setTimeout(() => this.initialize(), 5000);
      };

      this.signalingSocket.onerror = (error) => {
        console.error('Signaling server error:', error);
        // Fallback to local discovery
        this.initializeLocalDiscovery();
      };
    } catch (error) {
      console.error('Failed to connect to signaling server:', error);
      // Fallback to local discovery methods
      this.initializeLocalDiscovery();
    }
  }

  // Fallback for when signaling server is unavailable
  initializeLocalDiscovery() {
    console.log('🔄 Using local discovery fallback');
    // Use localStorage to simulate local peer discovery
    const peers = JSON.parse(localStorage.getItem('meshPeers') || '[]');
    const myInfo = { id: this.localId, timestamp: Date.now() };
    
    peers.push(myInfo);
    // Keep only recent peers (last 5 minutes)
    const recentPeers = peers.filter(p => Date.now() - p.timestamp < 300000);
    localStorage.setItem('meshPeers', JSON.stringify(recentPeers));

    // Try to connect to recent peers
    recentPeers.forEach(peer => {
      if (peer.id !== this.localId) {
        this.createPeerConnection(peer.id, true);
      }
    });
  }

  async handleSignalingMessage(data) {
    switch (data.type) {
      case 'peer-list':
        // Connect to existing peers
        data.peers.forEach(peerId => {
          this.createPeerConnection(peerId, true);
        });
        break;
      case 'peer-joined':
        if (data.id !== this.localId) {
          // Don't initiate connection if we already have one pending
          if (!this.pendingConnections.has(data.id)) {
            await this.createPeerConnection(data.id, true);
          }
        }
        break;
      case 'offer':
        await this.handleOffer(data);
        break;
      case 'answer':
        await this.handleAnswer(data);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(data);
        break;
    }
  }

  async createPeerConnection(peerId, isInitiator = false) {
    if (this.meshNode.peers.has(peerId) || this.pendingConnections.has(peerId)) {
      return; // Already connected or connecting
    }

    console.log(`🔗 Creating connection to ${peerId} (initiator: ${isInitiator})`);
    
    const connection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.pendingConnections.set(peerId, connection);

    const dataChannel = isInitiator ? 
      connection.createDataChannel('mesh', { ordered: false }) : null;

    connection.ondatachannel = (event) => {
      const channel = event.channel;
      this.setupDataChannel(channel, peerId, connection);
    };

    if (dataChannel) {
      this.setupDataChannel(dataChannel, peerId, connection);
    }

    connection.onicecandidate = (event) => {
      if (event.candidate && this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
        this.signalingSocket.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          target: peerId,
          from: this.localId
        }));
      }
    };

    connection.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}: ${connection.connectionState}`);
      if (connection.connectionState === 'failed' || connection.connectionState === 'disconnected') {
        this.meshNode.removePeer(peerId);
        this.pendingConnections.delete(peerId);
      }
    };

    if (isInitiator) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      
      if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
        this.signalingSocket.send(JSON.stringify({
          type: 'offer',
          offer: offer,
          target: peerId,
          from: this.localId
        }));
      }
    }

    return connection;
  }

  setupDataChannel(channel, peerId, connection) {
    channel.onopen = () => {
      console.log(`✅ Data channel open with ${peerId}`);
      this.meshNode.addPeer(peerId, channel, connection);
      this.pendingConnections.delete(peerId);
    };

    channel.onclose = () => {
      console.log(`❌ Data channel closed with ${peerId}`);
      this.meshNode.removePeer(peerId);
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'RREQ') {
          this.meshNode.handleRouteRequest(data, peerId);
        } else if (data.type === 'RREP') {
          this.meshNode.handleRouteReply(data, peerId);
        } else {
          this.meshNode.routeMessage(data);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  async handleOffer(data) {
    if (this.meshNode.peers.has(data.from) || this.pendingConnections.has(data.from)) {
      return; // Already connected
    }

    const connection = await this.createPeerConnection(data.from, false);
    await connection.setRemoteDescription(data.offer);
    
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    
    if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
      this.signalingSocket.send(JSON.stringify({
        type: 'answer',
        answer: answer,
        target: data.from,
        from: this.localId
      }));
    }
  }

  async handleAnswer(data) {
    const connection = this.pendingConnections.get(data.from);
    if (connection) {
      await connection.setRemoteDescription(data.answer);
    }
  }

  async handleIceCandidate(data) {
    const connection = this.pendingConnections.get(data.from) || 
                      this.meshNode.connections.get(data.from);
    if (connection && data.candidate) {
      await connection.addIceCandidate(data.candidate);
    }
  }

  sendMessage(message) {
    const meshMessage = {
      ...message,
      sender: this.localId,
      destination: 'broadcast',
      timestamp: Date.now()
    };
    
    this.meshNode.routeMessage(meshMessage);
  }

  getPeerCount() {
    return this.meshNode.peers.size;
  }

  cleanup() {
    // Close all peer connections
    this.meshNode.connections.forEach(connection => {
      if (connection.connectionState !== 'closed') {
        connection.close();
      }
    });
    
    // Close signaling socket
    if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
      this.signalingSocket.close();
    }
  }
}

// Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const swCode = `
      let messageQueue = [];

      self.addEventListener('message', (event) => {
        if (event.data.type === 'BACKGROUND_MESSAGE') {
          messageQueue.push(event.data.payload);
          console.log('Background message queued:', event.data.payload);
        }
      });

      self.addEventListener('sync', (event) => {
        if (event.tag === 'mesh-radio-sync') {
          event.waitUntil(processMessageQueue());
        }
      });

      async function processMessageQueue() {
        console.log('Processing message queue:', messageQueue.length, 'messages');
        // Process queued messages when connection is restored
        messageQueue = [];
      }

      self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        clients.openWindow('/');
      });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  }
};

export const OfflineRadioSystem: React.FC<OfflineRadioSystemProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const webrtcManager = useRef<WebRTCManager | null>(null);

  const handleMessage = useCallback((message) => {
    setMessages(prev => [...prev, {
      id: `${message.sender}-${message.timestamp}`,
      sender: message.sender === webrtcManager.current?.localId ? 'You' : `Peer-${message.sender.slice(-4)}`,
      message: message.message,
      timestamp: new Date(message.timestamp),
      type: message.type || 'text'
    }]);
  }, []);

  const handlePeerUpdate = useCallback((peers) => {
    setPeerCount(peers.length);
    setIsConnected(peers.length > 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && !webrtcManager.current) {
      // Register service worker
      registerServiceWorker();
      
      // Initialize WebRTC manager
      webrtcManager.current = new WebRTCManager(handleMessage, handlePeerUpdate);
      webrtcManager.current.initialize();
    }

    return () => {
      if (webrtcManager.current) {
        webrtcManager.current.cleanup();
        webrtcManager.current = null;
      }
    };
  }, [isOpen, handleMessage, handlePeerUpdate]);

  const handleSendMessage = () => {
    if (currentMessage.trim() && webrtcManager.current) {
      webrtcManager.current.sendMessage({
        message: currentMessage,
        type: 'text'
      });
      setCurrentMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setIsTransmitting(true);
      // Simulate voice message
      setTimeout(() => {
        if (webrtcManager.current) {
          webrtcManager.current.sendMessage({
            message: '[Voice Message]',
            type: 'voice'
          });
        }
        setIsTransmitting(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-50"
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col rounded-r-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-black rounded-lg flex items-center justify-center">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mesh Radio</h2>
                  <div className="flex items-center space-x-2 text-xs">
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-green-600" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-600" />
                    )}
                    <span className="text-gray-600 dark:text-gray-400">
                      {peerCount} peers
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center space-y-4">
                <motion.button
                  onClick={toggleRecording}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-600 to-green-600 shadow-lg shadow-red-500/50' 
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-600 dark:border-gray-300 rounded-full flex items-center justify-center">
                      <div className="grid grid-cols-6 gap-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              isRecording ? 'bg-white' : 'bg-gray-600 dark:bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isRecording ? (
                        <Mic className="w-8 h-8 text-white" />
                      ) : (
                        <MicOff className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                  </div>
                </motion.button>

                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isRecording ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isRecording ? 'Broadcasting...' : 'Press to Talk'}
                  </div>
                  {isTransmitting && (
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Volume2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Transmitting</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                  WebRTC Mesh Network • {peerCount} connected peers
                </div>
                
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-black hover:from-green-700 hover:to-gray-900 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Messages routed via WebRTC mesh network
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
