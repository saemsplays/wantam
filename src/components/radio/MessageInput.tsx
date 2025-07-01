
import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  currentMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentMessage,
  onMessageChange,
  onSendMessage
}) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={onSendMessage}
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
  );
};
