
// Mesh Network Protocol Implementation
export class MeshNode {
  public nodeId: string;
  public peers: Map<string, RTCDataChannel>;
  public connections: Map<string, RTCPeerConnection>;
  public routingTable: Map<string, { nextHop: string; hopCount: number }>;
  public messageHistory: Set<string>;
  public onMessage: (message: any) => void;
  public onPeerUpdate: (peers: string[]) => void;
  public sequenceNumber: number;

  constructor(nodeId: string, onMessage: (message: any) => void, onPeerUpdate: (peers: string[]) => void) {
    this.nodeId = nodeId;
    this.peers = new Map();
    this.connections = new Map();
    this.routingTable = new Map();
    this.messageHistory = new Set();
    this.onMessage = onMessage;
    this.onPeerUpdate = onPeerUpdate;
    this.sequenceNumber = 0;
  }

  // AODV-inspired routing protocol
  updateRoutingTable(destination: string, nextHop: string, hopCount: number) {
    const existing = this.routingTable.get(destination);
    if (!existing || existing.hopCount > hopCount) {
      this.routingTable.set(destination, { nextHop, hopCount });
    }
  }

  broadcastRouteDiscovery(destination: string) {
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

  handleRouteRequest(rreq: any, fromPeer: string) {
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

  handleRouteReply(rrep: any, fromPeer: string) {
    this.updateRoutingTable(rrep.destination, fromPeer, rrep.hopCount + 1);
    
    if (rrep.source !== this.nodeId) {
      const route = this.routingTable.get(rrep.source);
      if (route) {
        rrep.hopCount++;
        this.sendToPeer(route.nextHop, rrep);
      }
    }
  }

  routeMessage(message: any) {
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

  broadcast(message: any, excludePeer: string | null = null) {
    for (const [peerId, channel] of this.peers) {
      if (peerId !== excludePeer && channel.readyState === 'open') {
        this.sendToPeer(peerId, message);
      }
    }
  }

  sendToPeer(peerId: string, message: any) {
    const channel = this.peers.get(peerId);
    if (channel && channel.readyState === 'open') {
      try {
        channel.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to peer:', error);
      }
    }
  }

  addPeer(peerId: string, channel: RTCDataChannel, connection: RTCPeerConnection) {
    this.peers.set(peerId, channel);
    this.connections.set(peerId, connection);
    this.updateRoutingTable(peerId, peerId, 1);
    this.onPeerUpdate(Array.from(this.peers.keys()));
  }

  removePeer(peerId: string) {
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
