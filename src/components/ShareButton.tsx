import React, { useState } from 'react';
import { Share2, MessageCircle, Mail, Copy, Check, Users, ExternalLink } from 'lucide-react';

const ShareButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = window.location.href;
  const shareText = "Check out the Civic Education Kenya App - Object to the Finance Bill 2025!";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Instagram icon as SVG since lucide-react doesn't have it
  const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  // Twitter/X icon as SVG
  const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const shareOptions = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      message: '🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA',
      action: () => {
        navigator.clipboard.writeText('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA\n\nrejectfinancebill2025.lovable.app');
        alert('Text copied! Open Instagram and paste in your story or post.');
      }
    },
    {
      name: 'X (Twitter)',
      icon: TwitterIcon,
      color: 'bg-gradient-to-r from-black to-gray-800',
      message: 'Hi #KOT #KenyansOnTwitter. You\'ve got to see this app #RFB254 by #CEKA. They\'ve really outdone themselves with this one! #RejectFinanceBill2025 #CivicEducationKenya',
      action: () => {
        const text = encodeURIComponent('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA');
        const url = encodeURIComponent('https://rejectfinancebill2025.lovable.app');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: 'bg-gradient-to-r from-black to-red-600',
      message: '💪 Exercise your constitutional rights! Join the Finance Bill resistance. Your voice matters in democracy! #RejectFinanceBill2025 #CEKA #ConstitutionalRights',
      action: () => {
        navigator.clipboard.writeText('💪 Exercise your constitutional rights! Join the Finance Bill resistance. Your voice matters in democracy! #RejectFinanceBill2025 #CEKA #ConstitutionalRights\n\nrejectfinancebill2025.lovable.app');
        alert('Text copied! Open TikTok and paste in your video description.');
      }
    },
    {
      name: 'Follow CEKA',
      icon: ExternalLink,
      color: 'bg-gradient-to-r from-emerald-600 to-blue-600',
      message: 'Follow us for updates',
      action: () => {
        window.open('https://linktr.ee/civiceducationke', '_blank');
      }
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative flex flex-col items-end">
        {/* Share Options - Horizontal layout */}
        {isExpanded && (
          <div className="flex flex-row gap-2 mb-3 pr-1 transition-all duration-300 ease-in-out">
            {shareOptions.map((option, index) => (
              <button
                key={option.name}
                onClick={option.action}
                className={`p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 transform ${option.color}`}
                title={option.name}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: isExpanded ? 'slideIn 0.3s ease-out forwards' : 'slideOut 0.3s ease-in forwards'
                }}
              >
                <option.icon />
              </button>
            ))}
          </div>
        )}

        {/* Main Share Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
        >
          <div className="relative">
            <Users className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default ShareButton;
