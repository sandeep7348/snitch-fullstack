import React, { useEffect, useRef, useState } from "react";
import { 
  Bot, 
  Send, 
  X, 
  RotateCcw, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "./hooks/useChat";
import styles from "./ChatBot.module.scss";

function renderContent(text, navigate) {
  // Regex to detect markdown links [title](url) or bold/italics
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Message({ msg, navigate }) {
  const isUser = msg.role === "user";
  
  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.botMessage}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <Bot size={16} />
        </div>
      )}
      <div className={styles.bubble}>
        <div className={styles.bubbleText}>
          {msg.content.split("\n").map((line, i) => (
            <p key={i} className={styles.line}>
              {renderContent(line, navigate)}
            </p>
          ))}
        </div>
        <span className={styles.timestamp}>
          {msg.timestamp ? msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ''}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={`${styles.message} ${styles.botMessage}`}>
      <div className={styles.avatar}>
        <Bot size={16} />
      </div>
      <div className={`${styles.bubble} ${styles.typingBubble}`}>
        <div className={styles.typingDots}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "🔥 Black Oversized Tees",
  "👖 Cargo Pants under ₹2000",
  "💡 Suggest a casual summer outfit",
  "⭐ Top Rated Hoodies"
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    messages,
    input,
    setInput,
    loading,
    error,
    sendMessage,
    clearChat,
    handleKeyDown,
  } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!open && messages.length > 1) setHasUnread(true);
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  if (location.pathname === "/ai-assistant") return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="chatbot-trigger"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Shopping Assistant"
      >
        {open ? (
          <X size={24} />
        ) : (
          <div className={styles.triggerInner}>
            <Sparkles size={22} className={styles.sparkleIcon} />
            {hasUnread && <span className={styles.unreadDot} />}
          </div>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label="AI Shopping Assistant">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.botIcon}>
                <Bot size={20} />
              </div>
              <div>
                <p className={styles.botName}>Snitch AI Agent</p>
                <p className={styles.botStatus}>
                  <span className={styles.onlineDot} />
                  Mistral Vector Search Active
                </p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button 
                className={styles.actionBtn} 
                onClick={clearChat} 
                title="Clear conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={() => setOpen(false)} 
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyBotBadge}>
                  <Sparkles size={28} />
                </div>
                <h4>What are you looking for today?</h4>
                <p>Ask me about products, recommendations, outfits, sizes or compare styles!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <Message key={msg.id} msg={msg} navigate={navigate} />
              ))
            )}

            {loading && <TypingIndicator />}
            {error && <div className={styles.errorAlert}>{error}</div>}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className={styles.suggestionsRow}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.suggestionChip}
                  onClick={() => sendMessage(s.replace(/^[^\w]+/, ''))}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className={styles.inputArea}>
            <div className={styles.inputBox}>
              <textarea
                ref={inputRef}
                id="chat-input"
                className={styles.input}
                rows={1}
                placeholder="Ask Snitch AI for style advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                id="chat-send"
                className={styles.sendBtn}
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
