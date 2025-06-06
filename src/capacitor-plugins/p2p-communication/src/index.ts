
import { registerPlugin } from '@capacitor/core';
import type { P2pCommunicationPlugin } from './definitions';

const P2pCommunication = registerPlugin<P2pCommunicationPlugin>('P2pCommunication', {
  web: () => import('./web').then(m => new m.P2pCommunicationWeb()),
});

export * from './definitions';
export { P2pCommunication };
