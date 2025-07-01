
import React from 'react';
import { ChatMessage } from './types';

interface MessageListProps {
  messages: ChatMessage[];
  peerCount: number;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, peerCount }) => {
  return (
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
  );
};
