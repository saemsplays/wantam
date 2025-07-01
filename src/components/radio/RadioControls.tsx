
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface RadioControlsProps {
  isRecording: boolean;
  isTransmitting: boolean;
  onToggleRecording: () => void;
}

export const RadioControls: React.FC<RadioControlsProps> = ({
  isRecording,
  isTransmitting,
  onToggleRecording
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          onClick={onToggleRecording}
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
  );
};
