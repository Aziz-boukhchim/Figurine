import React, { useState, useRef, useEffect } from "react";
import { faq } from "../data/faq";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi there! Click a question below to get an instant answer." }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (faqItem) => {
    setMessages(prev => [...prev, { type: "user", text: faqItem.question }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: faqItem.answer }]);
    }, 400); // small delay for realism
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-bubble" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>💡 Support Bot</span>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-message ${m.type}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-questions">
            {faq.map(f => (
              <button
                key={f.question}
                className="chatbot-question-btn"
                onClick={() => handleQuestionClick(f)}
              >
                {f.question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
