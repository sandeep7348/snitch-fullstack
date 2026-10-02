import React, { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useNavigate } from "react-router-dom";
import styles from "./aiAssistant.module.scss";

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

function Message({ msg, navigate }) {
  const isUser = msg.role === "user";
  
  // Extract product recommendations if present (format: [title](url))
  // For the UI, we'll assume the LLM might return Markdown links to products
  
  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.botWrapper}`}>
      {!isUser && (
        <div className={styles.botAvatar}>
          <span>🤖</span>
        </div>
      )}
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {msg.content.split("\n").map((line, i) => (
          <p key={i} className={styles.messageLine}>
            {renderContent(line)}
          </p>
        ))}
        <span className={styles.timestamp}>
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
      <div className={styles.botAvatar}>
        <span>🤖</span>
      </div>
      <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingBubble}`}>
        <div className={styles.typing}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

const HISTORY = [
  "Running shoes under 10k",
  "Best laptops for coding",
  "Compare iPhone models",
  "Winter jackets for men"
];

export const AiAssistant = () => {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.layout}>
        
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <button className={styles.newChatBtn} onClick={clearChat}>
              <span>+</span> New Chat
            </button>
          </div>

          <div className={styles.historySection}>
            <h3>Chat History</h3>
            <ul className={styles.historyList}>
              {HISTORY.map((item, idx) => (
                <li key={idx} className={styles.historyItem}>
                  <span>💬</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Chat Area */}
        <section className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <h2>AI Shopping Assistant</h2>
            <p>Ask anything about products, get recommendations, compare items and more!</p>
          </div>

          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🤖</div>
                <h3>How can I help you shop today?</h3>
                <div className={styles.suggestions}>
                  <button onClick={() => sendMessage("Show me best running shoes under 10k")}>
                    Show me best running shoes under 10k
                  </button>
                  <button onClick={() => sendMessage("Suggest a casual outfit for summer")}>
                    Suggest a casual outfit for summer
                  </button>
                  <button onClick={() => sendMessage("What are the top rated jackets?")}>
                    What are the top rated jackets?
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.messageList}>
                {messages.map((msg) => (
                  <Message key={msg.id} msg={msg} navigate={navigate} />
                ))}
                {loading && <TypingIndicator />}
                {error && <div className={styles.errorAlert}>{error}</div>}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputBox}>
              <textarea
                ref={inputRef}
                placeholder="Ask me anything about products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
              />
              <button 
                className={styles.sendBtn}
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
              >
                Send <span>🚀</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AiAssistant;
