import React, { useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  ShoppingBag, 
  MessageSquare,
  ArrowRight,
  User
} from "lucide-react";
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

function Message({ msg }) {
  const isUser = msg.role === "user";
  
  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.botWrapper}`}>
      <div className={styles.avatar}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {msg.content.split("\n").map((line, i) => (
          <p key={i} className={styles.messageLine}>
            {renderContent(line)}
          </p>
        ))}
        <span className={styles.timestamp}>
          {msg.timestamp ? msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ''}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
      <div className={styles.avatar}>
        <Bot size={16} />
      </div>
      <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingBubble}`}>
        <div className={styles.typingDots}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

const HISTORY = [
  "Black oversized t-shirts under ₹1500",
  "Casual summer outfit ideas",
  "Compare cargo pants & denim",
  "Top rated streetwear jackets"
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
        
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.newChatBtn} onClick={clearChat}>
            <Plus size={18} /> New Conversation
          </button>

          <div className={styles.historySection}>
            <h3>Suggested Prompts</h3>
            <ul className={styles.historyList}>
              {HISTORY.map((item, idx) => (
                <li key={idx} className={styles.historyItem} onClick={() => sendMessage(item)}>
                  <MessageSquare size={14} /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.aiBadge}>
              <Sparkles size={16} /> Powered by Mistral AI
            </div>
          </div>
        </aside>

        {/* Chat Main Area */}
        <section className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <div className={styles.botTitleGroup}>
              <div className={styles.botBadgeIcon}>
                <Bot size={22} />
              </div>
              <div>
                <h2>Snitch AI Styling Agent</h2>
                <p>Semantic search, outfit coordination & product comparison</p>
              </div>
            </div>

            <button className={styles.resetBtn} onClick={clearChat} title="Reset Chat">
              <RotateCcw size={18} />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyGlowIcon}>
                  <Sparkles size={36} />
                </div>
                <h3>How can Snitch AI assist your style today?</h3>
                <p>Ask anything about fit, sizing, matching items, or discovering trending drops.</p>

                <div className={styles.suggestionsGrid}>
                  <button onClick={() => sendMessage("Show me black oversized t-shirts")}>
                    👕 Show me black oversized t-shirts
                  </button>
                  <button onClick={() => sendMessage("Suggest a casual streetwear outfit under ₹3000")}>
                    🔥 Suggest a casual outfit under ₹3000
                  </button>
                  <button onClick={() => sendMessage("What hoodies do you have in stock?")}>
                    🧥 What hoodies do you have in stock?
                  </button>
                  <button onClick={() => sendMessage("Compare oversized tees with regular fit tees")}>
                    ⚖️ Compare oversized vs regular tees
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.messageList}>
                {messages.map((msg) => (
                  <Message key={msg.id} msg={msg} />
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
                className={styles.input}
                placeholder="Ask Snitch AI anything about fashion & products..."
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
                Send <Send size={16} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AiAssistant;
