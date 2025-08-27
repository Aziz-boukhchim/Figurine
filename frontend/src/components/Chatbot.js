import React, { useState, useRef, useEffect } from "react";
import faqData from "../data/faq";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi there! Click a question below to get an instant answer." }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [availableFaq, setAvailableFaq] = useState(faqData); // store remaining FAQs
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (faqItem) => {
    // Add user question
    setMessages(prev => [...prev, { type: "user", text: faqItem.question }]);

    // Remove asked question from available list
    setAvailableFaq(prev => prev.filter(f => f.question !== faqItem.question));

    // Add bot response after delay
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: faqItem.answer }]);
    }, 400);
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

          {availableFaq.length > 0 && (
            <div className="chatbot-questions">
              {availableFaq.map(f => (
                <button
                  key={f.question}
                  className="chatbot-question-btn"
                  onClick={() => handleQuestionClick(f)}
                >
                  {f.question}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
