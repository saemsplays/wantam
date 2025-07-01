import { MeshNode } from './MeshNode';

// WebRTC Connection Manager
export class WebRTCManager {
  public localId: string;
  public meshNode: MeshNode;
  public signalingSocket: WebSocket | null;
  public isConnected: boolean;
  public pendingConnections: Map<string, RTCPeerConnection>;

  constructor(onMessage: (message: any) => void, onPeerUpdate: (peers: string[]) => void) {
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
        this.signalingSocket!.send(JSON.stringify({
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
    const recentPeers = peers.filter((p: any) => Date.now() - p.timestamp < 300000);
    localStorage.setItem('meshPeers', JSON.stringify(recentPeers));

    // Try to connect to recent peers
    recentPeers.forEach((peer: any) => {
      if (peer.id !== this.localId) {
        this.createPeerConnection(peer.id, true);
      }
    });
  }

  async handleSignalingMessage(data: any) {
    switch (data.type) {
      case 'peer-list':
        // Connect to existing peers
        data.peers.forEach((peerId: string) => {
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

  async createPeerConnection(peerId: string, isInitiator: boolean = false) {
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

  setupDataChannel(channel: RTCDataChannel, peerId: string, connection: RTCPeerConnection) {
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

  async handleOffer(data: any) {
    if (this.meshNode.peers.has(data.from) || this.pendingConnections.has(data.from)) {
      return; // Already connected
    }

    const connection = await this.createPeerConnection(data.from, false);
    if (connection) {
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
  }

  async handleAnswer(data: any) {
    const connection = this.pendingConnections.get(data.from);
    if (connection) {
      await connection.setRemoteDescription(data.answer);
    }
  }

  async handleIceCandidate(data: any) {
    const connection = this.pendingConnections.get(data.from) || 
                      this.meshNode.connections.get(data.from);
    if (connection && data.candidate) {
      await connection.addIceCandidate(data.candidate);
    }
  }

  sendMessage(message: any) {
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
