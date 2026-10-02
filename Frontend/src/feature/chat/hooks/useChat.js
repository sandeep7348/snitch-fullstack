import { useState, useCallback, useRef } from "react";
import { sendChatMessage } from "../service/chat.api";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! 👋 I'm **Snitch AI** — your personal fashion assistant. Ask me anything about our collection!\n\nTry: *\"Show me black t-shirts\"*, *\"Suggest a casual outfit\"*, or *\"Compare two products\"*",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      const content = (text ?? input).trim();
      if (!content || loading) return;

      setInput("");
      setError("");

      const userMsg = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        // Build history for API (exclude welcome message & local ids)
        const history = [
          ...messages.filter((m) => m.id !== "welcome"),
          userMsg,
        ].map(({ role, content }) => ({ role, content }));

        const data = await sendChatMessage(history);

        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error("Chat error:", err);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError("");
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    sendMessage,
    clearChat,
    handleKeyDown,
  };
}
