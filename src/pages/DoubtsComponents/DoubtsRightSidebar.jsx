import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Flame, Award, MessageSquare, Zap, X, Send, AlertCircle, RefreshCw, Bot, User } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { askStudyBuddy } from '../../services/groqService';

const RANK_COLORS = {
  Gold: 'text-yellow-500',
  Silver: 'text-gray-400',
  Bronze: 'text-amber-700',
};

const TRENDING_TOPICS = [
  { tag: 'dynamic-programming', count: 23, hot: true },
  { tag: 'newtons-laws', count: 18, hot: true },
  { tag: 'react-hooks', count: 15, hot: false },
  { tag: 'fourier', count: 12, hot: false },
  { tag: 'cnn-vs-rnn', count: 9, hot: false },
];

const LIVE_ACTIVITY = [
  { user: 'Marcus Lee', action: 'answered a doubt', topic: 'DSA', time: '2m ago' },
  { user: 'Priya Sharma', action: 'asked a doubt', topic: 'Coding', time: '5m ago' },
  { user: 'Dr. Lisa Wong', action: 'marked best answer', topic: 'Physics', time: '12m ago' },
  { user: 'Jordan Kim', action: 'upvoted an answer', topic: 'Maths', time: '18m ago' },
];

const SUGGESTED_PROMPTS = [
  "Explain Newton's Laws in simple terms",
  "How does Dynamic Programming differ from recursion?",
  "Give me a quick study tip for exam preparation"
];

export default function DoubtsRightSidebar({ topSolvers }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [smallInput, setSmallInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isLoading, isExpanded]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const reply = await askStudyBuddy(query.trim(), messages);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: err.message || 'Failed to get answer from AI Study Buddy.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmallInputSubmit = (e) => {
    e.preventDefault();
    const query = smallInput.trim();
    setIsExpanded(true);
    if (query) {
      handleSendMessage(query);
      setSmallInput('');
    }
  };

  const handleOpenModal = () => {
    setIsExpanded(true);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto no-scrollbar p-4 bg-(--bg-elevated) border-l border-(--border-default)">

      {/* AI Helper Small Sidebar Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] rounded-2xl p-4 cursor-pointer group hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] transition-all shadow-sm"
        onClick={handleOpenModal}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                AI Study Buddy
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] font-semibold">Groq</span>
              </h4>
              <p className="text-[10px] text-(--text-muted)">Powered by EduWrap AI</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[color:oklch(0.58_0.22_var(--accent-hue))] group-hover:underline">
            Expand ↗
          </span>
        </div>
        <p className="text-xs text-(--text-secondary) mb-3 leading-relaxed">
          Struggling with a concept? Ask the AI for a quick explanation before posting.
        </p>
        <form onSubmit={handleSmallInputSubmit} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          <input
            type="text"
            value={smallInput}
            onChange={(e) => setSmallInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-(--bg-glass) border border-(--border-default) rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors"
          />
          <button type="submit" className="p-1.5 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] hover:bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.25)] transition-colors">
            <Zap size={14} />
          </button>
        </form>
      </motion.div>

      {/* Expanded AI Study Buddy Modal */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl min-w-[25vw] h-[80vh] min-h-[500px] flex flex-col bg-(--bg-elevated) border border-(--border-default) rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-default) bg-(--bg-glass) backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center shadow-inner">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-(--text-primary) flex items-center gap-2">
                      AI Study Buddy
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] font-semibold">
                        Llama 3.1 8B (Groq)
                      </span>
                    </h3>
                    <p className="text-xs text-(--text-muted)">Get instant exam prep answers & explanations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass) transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 my-auto py-8">
                    <div className="w-14 h-14 rounded-2xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center">
                      <Bot size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-(--text-primary) mb-1">How can I help your studies today?</h4>
                      <p className="text-xs text-(--text-muted) leading-relaxed">
                        Ask any academic question, request concept explanations, or get quick revision help.
                      </p>
                    </div>
                    <div className="w-full space-y-2 pt-2">
                      <p className="text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider text-left">Suggested Questions:</p>
                      {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left p-3 rounded-xl bg-(--bg-glass) border border-(--border-default) text-xs font-medium hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.4)] hover:bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] transition-all flex items-center justify-between group"
                        >
                          <span>{prompt}</span>
                          <Zap size={14} className="text-(--text-muted) group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center shrink-0 mt-1">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white rounded-br-none shadow-md'
                          : msg.isError
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400 rounded-bl-none'
                          : 'bg-(--bg-glass) border border-(--border-default) text-(--text-primary) rounded-bl-none shadow-sm'
                      }`}>
                        {msg.isError && (
                          <div className="flex items-center gap-1.5 font-bold mb-1.5 text-red-400">
                            <AlertCircle size={14} />
                            <span>Error</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`block text-[9px] mt-2 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-(--text-muted)'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-(--bg-glass) border border-(--border-default) flex items-center justify-center shrink-0 mt-1 text-(--text-secondary)">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-8 h-8 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center shrink-0">
                      <RefreshCw size={14} className="animate-spin" />
                    </div>
                    <div className="bg-(--bg-glass) border border-(--border-default) rounded-2xl rounded-bl-none px-4 py-3 text-xs text-(--text-muted) flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue))] animate-ping" />
                        AI Study Buddy is thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-4 border-t border-(--border-default) bg-(--bg-glass) backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question or concept to explain..."
                    disabled={isLoading}
                    className="flex-1 bg-(--bg-elevated) border border-(--border-default) rounded-xl px-4 py-3 text-xs text-(--text-primary) focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isLoading}
                    className="px-4 py-3 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-(--shadow-glow)"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-(--text-muted)" />
          <h4 className="text-sm font-bold">Trending Topics</h4>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map(topic => (
            <div key={topic.tag} className="flex items-center justify-between py-1 group cursor-pointer">
              <span className="text-xs text-(--text-secondary) group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors flex items-center gap-1.5">
                {topic.hot && <Flame size={11} className="text-orange-500" />}
                #{topic.tag}
              </span>
              <span className="text-[10px] text-(--text-muted) bg-(--bg-elevated) px-1.5 py-0.5 rounded-full">{topic.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Solvers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award size={15} className="text-yellow-500" />
          <h4 className="text-sm font-bold">Top Solvers</h4>
        </div>
        <div className="space-y-3">
          {topSolvers?.slice(0, 5).map((solver, i) => (
            <div key={solver.id} className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold text-(--text-muted) w-4 text-right">{i + 1}</span>
              <Avatar initials={solver.initials} size="xs" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{solver.name}</div>
                <div className="text-[10px] text-(--text-muted) flex items-center gap-1">
                  <span className={`font-bold ${RANK_COLORS[solver.rank]}`}>{solver.rank}</span>
                  · {solver.solvedCount} solved
                </div>
              </div>
              <span className="text-[10px] font-bold text-[color:oklch(0.58_0.22_var(--accent-hue))]">{solver.xp} XP</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h4 className="text-sm font-bold">Live Activity</h4>
        </div>
        <div className="space-y-2.5">
          {LIVE_ACTIVITY.map((activity, i) => (
            <div key={i} className="flex items-start gap-2">
              <MessageSquare size={12} className="text-(--text-muted) shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-(--text-secondary) leading-snug">
                  <span className="font-semibold text-(--text-primary)">{activity.user}</span>{' '}
                  {activity.action} in <span className="text-[color:oklch(0.58_0.22_var(--accent-hue))]">{activity.topic}</span>
                </p>
                <span className="text-[10px] text-(--text-muted)">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

