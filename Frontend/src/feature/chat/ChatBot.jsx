import React, { useEffect, useRef, useState } from "react";
import { useChat } from "./hooks/useChat";
import styles from "./ChatBot.module.scss";

// Simple markdown-like renderer for bold and italic
function renderContent(text) {
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

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.botMessage}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <span>🛍️</span>
        </div>
      )}
      <div className={styles.bubble}>
        <p className={styles.bubbleText}>
          {msg.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {renderContent(line)}
              {i < msg.content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <span className={styles.timestamp}>
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={`${styles.message} ${styles.botMessage}`}>
      <div className={styles.avatar}>
        <span>🛍️</span>
      </div>
      <div className={`${styles.bubble} ${styles.typingBubble}`}>
        <div className={styles.typing}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Show me black t-shirts",
  "Suggest a casual outfit",
  "What hoodies do you have?",
  "Best sellers under ₹1000",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!open && messages.length > 1) setHasUnread(true);
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {hasUnread && !open && <span className={styles.unreadDot} />}
      </button>

      {/* Chat panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`} role="dialog" aria-label="AI Shopping Assistant">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.botIcon}>🛍️</div>
            <div>
              <p className={styles.botName}>Snitch AI</p>
              <p className={styles.botStatus}>
                <span className={styles.onlineDot} />
                Fashion Assistant
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.clearBtn} onClick={clearChat} title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.74" />
              </svg>
            </button>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages} id="chat-messages">
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          {error && <p className={styles.error}>{error}</p>}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (only shown when minimal messages) */}
        {messages.length <= 1 && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className={styles.suggestion}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            id="chat-input"
            className={styles.input}
            rows={1}
            placeholder="Ask about products, outfits..."
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
