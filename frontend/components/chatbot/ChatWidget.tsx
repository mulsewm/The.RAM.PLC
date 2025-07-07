// components/chatbot/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, MessageSquare, Bot, User, Loader2, Download } from 'lucide-react';
import styles from './chat-widget.module.css';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isExpanded?: boolean;
};

type QuickReply = {
  text: string;
  action?: () => void;
};

const INITIAL_MESSAGE = {
  id: '1',
  text: "Hello! 👋 I'm the.RAM AI assistant. I can help you with information about our services, company details, and more. How can I assist you today?",
  sender: 'bot' as const,
  timestamp: new Date(),
};

const QUICK_REPLIES: Record<string, QuickReply[]> = {
  'default': [
    { text: 'What services do you offer?' },
    { text: 'How can I contact support?' },
    { text: 'Tell me about your company' },
  ],
  'services': [
    { text: 'Primary Source Verification' },
    { text: 'Background Screening' },
    { text: 'Immigration Compliance' },
  ],
  'contact': [
    { text: 'Email address' },
    { text: 'Phone number' },
    { text: 'Office location' },
  ],
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages and handle keyboard on mobile
  useEffect(() => {
    scrollToBottom();
    
    // Handle mobile keyboard events
    const handleResize = () => {
      if (window.visualViewport) {
        // On mobile, when keyboard appears, scroll to bottom
        if (isOpen && window.innerWidth < 640) {
          scrollToBottom();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [messages, isTyping, isOpen]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior,
      block: 'nearest',
      inline: 'nearest'
    });
  }, []);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Prevent body scroll when chat is open on mobile
    if (typeof document !== 'undefined') {
      document.body.style.overflow = newIsOpen && window.innerWidth < 640 ? 'hidden' : '';
    }
    
    if (newIsOpen) {
      // Focus input when opening chat
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        scrollToBottom();
      }, 100);
    }
  };

  // Format message text with markdown-like syntax
  const formatMessage = (text: string): string => {
    // Convert **bold** to <strong> tags
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert *italic* to <em> tags
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert lists
    formatted = formatted.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
    // Add line breaks for better readability
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isTyping) return;
    
    // Blur input on mobile to hide keyboard after sending
    if (window.innerWidth < 640) {
      inputRef.current?.blur();
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const { text } = await response.json();
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the server. Please try again later or contact support@theramplc.com.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    // Small delay to allow state to update
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Get quick replies based on last message
  const getQuickReplies = (): QuickReply[] => {
    if (messages.length === 0) return [];
    
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.sender === 'user') return [];
    
    const messageText = lastMessage.text.toLowerCase();
    
    if (messageText.includes('service') || messageText.includes('offer') || messageText.includes('provide')) {
      return QUICK_REPLIES.services;
    }
    
    if (messageText.includes('contact') || messageText.includes('email') || messageText.includes('phone')) {
      return QUICK_REPLIES.contact;
    }
    
    return QUICK_REPLIES.default;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleExpandMessage = (id: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  const shouldShowReadMore = (text: string): boolean => {
    return text.length > 200;
  };

  const renderMessageContent = (message: Message) => {
    const isLongMessage = message.text.length > 200;
    const displayText = message.isExpanded || !isLongMessage 
      ? message.text 
      : `${message.text.substring(0, 200)}...`;
    
    return (
      <div className={styles.messageContent}>
        <div dangerouslySetInnerHTML={{ __html: formatMessage(displayText) }} />
        {isLongMessage && (
          <button 
            onClick={() => toggleExpandMessage(message.id)}
            className="text-xs text-teal-600 hover:underline mt-1"
          >
            {message.isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    );
  };

  const quickReplies = getQuickReplies();
  const hasQuickReplies = quickReplies.length > 0 && !isTyping;

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className={styles.chatButton}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  // Close on overlay click (for mobile)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggleChat();
    }
  };

  return (
    <div className={styles.chatWidget}>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-0 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatTitle}>
            <div className={styles.chatAvatar}>
              <Bot size={16} />
            </div>
            <span>the.RAM AI</span>
          </div>
          <button 
            className={styles.closeButton}
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        <div 
          className={styles.messagesContainer} 
          ref={messagesContainerRef}
          onClick={() => {
            // On mobile, focus input when clicking on messages
            if (typeof window !== 'undefined' && window.innerWidth < 640) {
              inputRef.current?.focus();
            }
          }}
        >
          <div className="w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.user : styles.bot
                }`}
              >
                {renderMessageContent(message)}
                <div className={styles.messageMetadata}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {hasQuickReplies && (
          <div className={styles.quickReplies}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className={styles.quickReply}
                onClick={() => handleQuickReply(reply.text)}
              >
                {reply.text}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message..."
            className={styles.inputField}
            disabled={isTyping}
            aria-label="Type your message"
            enterKeyHint="send"
            inputMode="text"
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={styles.sendButton}
            aria-label="Send message"
          >
            {isTyping ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}