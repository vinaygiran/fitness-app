import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Add user message to conversation history
      const userMessage = { role: "user", content: question };
      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Call backend AI API
      const grokResponse = await axios.post(
        "http://localhost:9123/api/askAI",
        {
          messages: updatedHistory,
          temperature: 0.7,
        }
      );

      const aiResponse = grokResponse.data.response;
      
      // Add AI response to conversation history
      const assistantMessage = { role: "assistant", content: aiResponse };
      setConversationHistory([...updatedHistory, assistantMessage]);
      
      setQuestion("");
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "API authentication failed. Please check your Grok API key."
        );
      } else if (err.response?.status === 429) {
        setError("Rate limit exceeded. Please wait a moment and try again.");
      } else {
        setError(
          err.message || "Failed to get response from AI. Please try again."
        );
      }
      console.error("Grok API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setConversationHistory([]);
    setQuestion("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              AI Fitness Assistant
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get personalized fitness advice, nutrition guidance, and workout recommendations powered by Grok AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="h-screen lg:h-auto flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-6 sm:px-8 sm:py-8 border-b border-white/20">
                  <h2 className="text-2xl font-bold text-white">Chat with AI</h2>
                  <p className="text-purple-200 text-sm mt-1">Multi-turn conversation with persistent history</p>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gradient-to-b from-white/5 to-white/0">
                  {conversationHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full border-2 border-purple-500/30">
                            <span className="text-4xl">💬</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Start Your Conversation
                        </h3>
                        <p className="text-gray-400 text-sm max-w-xs">
                          Ask about workouts, nutrition, meal plans, or any fitness-related questions
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {conversationHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          } animate-fadeIn`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg rounded-br-none"
                                : "bg-white/10 backdrop-blur text-gray-100 border border-white/20 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-white/10 backdrop-blur text-gray-100 px-6 py-4 rounded-2xl rounded-bl-none border border-white/20">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mx-6 mb-4 sm:mx-8 sm:mb-6 px-4 py-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 text-xl mt-0.5">⚠️</span>
                      <div>
                        <p className="text-red-200 text-sm font-medium">Error</p>
                        <p className="text-red-100 text-xs mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t border-white/20 bg-gradient-to-t from-white/5 to-transparent p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <textarea
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur resize-none transition-all"
                        placeholder="Ask me anything about fitness, nutrition, or workouts..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <span>Send</span>
                            <span>→</span>
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="px-4 sm:px-6 py-3 bg-white/10 border border-white/30 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Tips Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6 border-b border-white/20">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>💡</span>
                  <span>Quick Tips</span>
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-orange-300 font-semibold text-sm mb-1">🏋️ Workouts</p>
                  <p className="text-orange-200 text-xs leading-relaxed">
                    Get custom routines for any fitness level
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-green-300 font-semibold text-sm mb-1">🥗 Nutrition</p>
                  <p className="text-green-200 text-xs leading-relaxed">
                    Personalized meal plans and dietary advice
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-cyan-300 font-semibold text-sm mb-1">🎯 Goals</p>
                  <p className="text-cyan-200 text-xs leading-relaxed">
                    Track progress and optimize your fitness journey
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer Card */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚕️</span>
                <div>
                  <p className="text-yellow-200 text-xs font-semibold mb-1">Medical Disclaimer</p>
                  <p className="text-yellow-100 text-xs leading-relaxed">
                    This AI provides general guidance. Always consult healthcare professionals for medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

