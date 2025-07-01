
export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'voice';
}

export interface OfflineRadioSystemProps {
  isOpen: boolean;
  onClose: () => void;
}
