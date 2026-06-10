import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { X, Send, Heart, ThumbsUp, Laugh, PartyPopper } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onEmote: (emote: string) => void;
  onClose: () => void;
}

export function ChatPanel({ messages, onSendMessage, onEmote, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const emotes = [
    { icon: <Heart size={16} />, label: '❤️', action: '❤️' },
    { icon: <ThumbsUp size={16} />, label: '👍', action: '👍' },
    { icon: <Laugh size={16} />, label: '😂', action: '😂' },
    { icon: <PartyPopper size={16} />, label: '🎉', action: '🎉' },
  ];

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <span className="chat-title">Nearby Chat</span>
          <span className="chat-subtitle">💬 Only people close to you can hear</span>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={18} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            Say hello to people nearby! 👋
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-message ${msg.type === 'emote' ? 'emote' : ''}`}
          >
            <div className="message-header">
              <span className="message-name">{msg.playerName}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emote Buttons */}
      <div className="emote-bar">
        {emotes.map((emote, idx) => (
          <button 
            key={idx}
            className="emote-btn"
            onClick={() => onEmote(emote.action)}
            title={emote.action}
          >
            {emote.icon}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something nearby..."
          className="chat-input"
          maxLength={120}
        />
        <button type="submit" className="send-btn" disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}