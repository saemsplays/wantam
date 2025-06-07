
import { WebPlugin } from '@capacitor/core';

import type { P2pCommunicationPlugin } from './definitions';

export class P2pCommunicationWeb extends WebPlugin implements P2pCommunicationPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async sendMessage(options: { message: string; target: string }): Promise<{ success: boolean }> {
    console.log('SEND_MESSAGE', options);
    return { success: true };
  }

  async receiveMessage(): Promise<{ message: string; from: string }> {
    console.log('RECEIVE_MESSAGE');
    return { message: 'Test message', from: 'test-peer' };
  }

  async startBroadcast(options: { name: string }): Promise<{ success: boolean }> {
    console.log('START_BROADCAST', options);
    return { success: true };
  }

  async stopBroadcast(): Promise<{ success: boolean }> {
    console.log('STOP_BROADCAST');
    return { success: true };
  }
}
