
import React, { useState, useRef, useEffect } from 'react';
import { Radio, Send, X, Mic, MicOff, Volume2 } from 'lucide-react';
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

export const OfflineRadioSystem: React.FC<OfflineRadioSystemProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: currentMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setIsTransmitting(true);
      setTimeout(() => setIsTransmitting(false), 3000);
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Offline Radio</h2>
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
                  Peer-to-peer communication active
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
                  Messages sent via Wi-Fi Direct & Bluetooth mesh
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
