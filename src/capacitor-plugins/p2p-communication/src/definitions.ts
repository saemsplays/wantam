
import type { PluginListenerHandle as CapacitorPluginListenerHandle } from '@capacitor/core';

export interface P2pCommunicationPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  startAdvertising(options: { serviceName: string; displayName: string }): Promise<void>;
  stopAdvertising(): Promise<void>;
  startBrowsing(options: { serviceName: string }): Promise<void>;
  stopBrowsing(): Promise<void>;
  sendData(options: { peerId: string; data: string }): Promise<void>;
  disconnect(): Promise<void>;
  addListener(
    eventName: 'peerFound' | 'peerLost' | 'dataReceived' | 'connectionStateChanged',
    listenerFunc: (data: any) => void,
  ): Promise<CapacitorPluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}
