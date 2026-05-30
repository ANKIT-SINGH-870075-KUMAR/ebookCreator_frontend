import { useState, useRef, useEffect } from "react";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";
import { MessageCircle, X, Send, Bot, BookOpen, Star, Library, PenTool, FileQuestion, ArrowRight } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const welcomeMessage = {
    id: 1,
    type: "welcome",
    content: {
      title: "Welcome to E-Book Assistant!",
      subtitle: "Your AI-powered book companion",
      description: "I can help you discover amazing books, find top-rated titles, explore categories, and more!",
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const quickActions = [
    { icon: <BookOpen size={16} />, label: "Recommend books", prompt: "Recommend me some books" },
    { icon: <Star size={16} />, label: "Top rated", prompt: "Show me top rated books" },
    { icon: <PenTool size={16} />, label: "Best writers", prompt: "Who are the best writers" },
    { icon: <Library size={16} />, label: "Categories", prompt: "What categories are available" },
  ];

  const exploreMoreActions = [
    { icon: <FileQuestion size={16} />, label: "Fun Quizzes", prompt: "Give me a quiz" },
    { icon: <BookOpen size={16} />, label: "Word Meaning", prompt: "What is the meaning of book" },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    setTimeout(() => {
      const form = document.getElementById("chat-form");
      if (form) form.dispatchEvent(new Event("submit", { bubbles: true }));
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.CHATBOT.MESSAGE, {
        message: userMessage
      });
      
      const responseText = response.data.response;
      const msgType = determineMessageType(responseText);
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: "assistant", 
        type: msgType,
        content: responseText 
      }]);
    } catch (error) {
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: "assistant", 
        type: "general",
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const determineMessageType = (content) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('"') && lowerContent.includes('by') && 
        (lowerContent.includes('book') || lowerContent.includes('title') || lowerContent.includes('recommend'))) {
      if (lowerContent.includes('top') || lowerContent.includes('rating') || lowerContent.includes('highest') || lowerContent.includes('pick')) {
        return 'top_rated_books';
      }
      return 'books';
    }
    if (lowerContent.includes('quiz') || lowerContent.includes('question') || lowerContent.includes('**q')) {
      return 'quiz';
    }
    if (lowerContent.includes('category') || lowerContent.includes('genre') || lowerContent.includes('available')) {
      return 'categories';
    }
    if (lowerContent.includes('writer') || lowerContent.includes('author') || lowerContent.includes('popular') || lowerContent.includes('talented')) {
      return 'writers';
    }
    if (lowerContent.includes('meaning') || lowerContent.includes('definition') || lowerContent.includes('part of speech')) {
      return 'meaning';
    }
    return 'general';
  };

  const parseBookResponse = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const books = [];
    
    lines.forEach(line => {
      let match = line.match(/\d+\.\s+\*\*"([^"]+)"\*\*\s*by\s+([^\n*]+)/);
      if (match) {
        const author = match[2].replace(/\*/g, '').replace('Writer:', '').replace('*Writer:', '').trim();
        books.push({ title: match[1].trim(), author: author });
        return;
      }
      
      match = line.match(/[•*]?\s*"([^"]+)"\s*by\s+([^\n*]+)/);
      if (match) {
        books.push({ title: match[1].trim(), author: match[2].trim() });
        return;
      }
      
      if (line.includes('"') && line.includes('by')) {
        match = line.match(/"([^"]+)"\s*by\s+([^\n]+)/);
        if (match) {
          books.push({ title: match[1].trim(), author: match[2].trim() });
        }
      }
    });
    
    return books.slice(0, 8);
  };

  const parseWritersResponse = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const writers = [];
    
    lines.forEach(line => {
      let match = line.match(/\d+\.\s+\*\*([^*]+)\*\*/);
      if (match) {
        let writerName = match[1].trim();
        let bookCount = 0;
        let notableBook = '';
        
        const countMatch = line.match(/(\d+)\s+book/i);
        if (countMatch) bookCount = parseInt(countMatch[1]);
        
        const bookMatch = line.match(/"([^"]+)"/);
        if (bookMatch) notableBook = bookMatch[1];
        
        if (writerName) {
          writers.push({ name: writerName, bookCount, notableBook });
        }
      } else if (line.includes('**') && line.includes('book')) {
        match = line.match(/\*\*([^*]+)\*\*/);
        if (match) {
          const countMatch = line.match(/(\d+)\s+book/i);
          const bookMatch = line.match(/"([^"]+)"/);
          writers.push({ 
            name: match[1].trim(), 
            bookCount: countMatch ? parseInt(countMatch[1]) : 0,
            notableBook: bookMatch ? bookMatch[1] : ''
          });
        }
      }
    });
    
    return writers.slice(0, 6);
  };

  const renderWriterCard = (writer, index) => (
    <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-rose-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center text-[10px] font-bold text-rose-600">
              {index + 1}
            </span>
            <h4 className="text-sm font-semibold text-gray-800">{writer.name}</h4>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
              {writer.bookCount} {writer.bookCount === 1 ? 'book' : 'books'}
            </span>
            {writer.notableBook && (
              <span className="text-xs text-gray-500 truncate">"{writer.notableBook}"</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <PenTool size={18} className="text-rose-600" />
        </div>
      </div>
    </div>
  );

  const renderBookCard = (book, index) => (
    <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-purple-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-600">
              {index + 1}
            </span>
            <h4 className="text-sm font-semibold text-gray-800 truncate">{book.title}</h4>
          </div>
          <div className="flex items-center gap-1.5 ml-6">
            <PenTool size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">{book.author}</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderWelcomeMessage = () => (
    <div className="w-full shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-white font-bold text-lg">{welcomeMessage.content.title}</h2>
        <p className="text-white/80 text-sm">{welcomeMessage.content.subtitle}</p>
      </div>
      <div className="bg-white p-4 rounded-b-2xl border border-gray-100 space-y-2">
        <p className="text-gray-600 text-sm text-center mb-2">{welcomeMessage.content.description}</p>
        <div className="space-y-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.prompt)}
              className="w-full px-3 py-2.5 text-xs text-purple-600 rounded-lg transition-all font-medium bg-purple-100 hover:bg-purple-200 flex items-center justify-center gap-2"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Explore more</p>
          <div className="grid grid-cols-2 gap-2">
            {exploreMoreActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.prompt)}
                className="w-full px-2 py-2 text-xs text-gray-600 rounded-lg transition-all font-medium bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-1.5"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssistantMessage = (content, type) => {
    const icons = {
      books: <BookOpen size={16} />,
      top_rated_books: <Star size={16} className="fill-white" />,
      quiz: <FileQuestion size={16} />,
      categories: <Library size={16} />,
      writers: <PenTool size={16} />,
      meaning: <PenTool size={16} />,
      general: <Bot size={16} />
    };

    const titles = {
      books: '📚 Book Recommendations',
      top_rated_books: '🏆 Top Rated Books',
      quiz: '🎯 Fun Quiz',
      categories: '📂 Available Categories',
      writers: '✍️ Top Writers',
      meaning: '📖 Word Meaning',
      general: '💬 Assistant'
    };

    const bgColors = {
      books: 'from-violet-500 to-purple-500',
      top_rated_books: 'from-yellow-400 to-orange-400',
      quiz: 'from-green-500 to-emerald-500',
      categories: 'from-blue-500 to-indigo-500',
      writers: 'from-rose-500 to-pink-500',
      meaning: 'from-cyan-500 to-blue-500',
      general: 'from-violet-500 to-purple-500'
    };

    const isBookType = type === 'books' || type === 'top_rated_books';
    const isWriterType = type === 'writers';
    const books = isBookType ? parseBookResponse(content) : [];
    const writers = isWriterType ? parseWritersResponse(content) : [];

    return (
      <div className="w-full max-w-[85%]">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-gray-100">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-r ${bgColors[type]}`}>
              <span className="text-white">{icons[type]}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{titles[type]}</span>
          </div>
          
          {isBookType && books.length > 0 ? (
            <div className="p-3 space-y-2 max-h-auto">
              {books.map((book, idx) => renderBookCard(book, idx))}
            </div>
          ) : isWriterType && writers.length > 0 ? (
            <div className="p-3 space-y-2 max-h-auto">
              {writers.map((writer, idx) => renderWriterCard(writer, idx))}
            </div>
          ) : (
            <div className="p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
            </div>
          )}
          
          {type !== 'general' && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Need more help?</span>
              <button 
                onClick={() => handleQuickAction("Tell me more")}
                className="text-xs text-purple-600 font-medium hover:underline"
              >
                Ask more →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessage = (msg) => {
    if (msg.type === "welcome") {
      return renderWelcomeMessage();
    }

    if (msg.role === "user") {
      return (
        <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-md">
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
      );
    }

    return renderAssistantMessage(msg.content, msg.type);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">E-Book Assistant</h3>
                <p className="text-white/70 text-xs">AI Powered Helper</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {renderMessage(msg)}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form id="chat-form" onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-violet-500 text-white rounded-xl flex items-center justify-center hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;