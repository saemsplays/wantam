
import { WebPlugin } from '@capacitor/core';
import type { P2pCommunicationPlugin } from './definitions';
import type { PluginListenerHandle } from '@capacitor/core';

export class P2pCommunicationWeb extends WebPlugin implements P2pCommunicationPlugin {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async startAdvertising(options: { serviceName: string; displayName: string }): Promise<void> {
    console.log('Starting advertising:', options);
    // Simulate peer discovery in web environment
    setTimeout(() => {
      this.notifyListeners('peerFound', { 
        peerId: 'web-peer-1', 
        displayName: 'Web Peer' 
      });
    }, 2000);
  }

  async stopAdvertising(): Promise<void> {
    console.log('Stopping advertising');
  }

  async startBrowsing(options: { serviceName: string }): Promise<void> {
    console.log('Starting browsing:', options);
    // Simulate finding peers
    setTimeout(() => {
      this.notifyListeners('peerFound', { 
        peerId: 'web-peer-2', 
        displayName: 'Another Web Peer' 
      });
    }, 3000);
  }

  async stopBrowsing(): Promise<void> {
    console.log('Stopping browsing');
  }

  async sendData(options: { peerId: string; data: string }): Promise<void> {
    console.log('Sending data:', options);
    // Simulate receiving data back
    setTimeout(() => {
      this.notifyListeners('dataReceived', {
        peerId: options.peerId,
        data: `Echo: ${options.data}`
      });
    }, 1000);
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting');
    this.notifyListeners('connectionStateChanged', { connected: false });
  }

  async addListener(
    eventName: string, 
    listenerFunc: (data: any) => void
  ): Promise<PluginListenerHandle> {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);

    return {
      remove: async () => {
        const index = this.listeners[eventName]?.indexOf(listenerFunc);
        if (index !== undefined && index > -1) {
          this.listeners[eventName].splice(index, 1);
        }
      }
    };
  }

  async removeAllListeners(): Promise<void> {
    this.listeners = {};
  }

  private notifyListeners(eventName: string, data: any): void {
    const eventListeners = this.listeners[eventName] || [];
    eventListeners.forEach(listener => listener(data));
  }
}
