// src/components/common/AIAssistant.jsx
// Trợ lý ảo AI: Tư vấn và thu thập SĐT khách hàng
// Floating component với animation mượt mà

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Phone } from "lucide-react";
import { saveLead } from "../../utils/leadStore";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Tôi là trợ lý ảo BĐS Chơn Thành. Bạn cần thông tin về dự án nào?" },
  ]);
  const [input, setInput] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Giả lập AI phản hồi
    setTimeout(() => {
      let botResponse = "";
      
      // Logic đơn giản: Nếu tin nhắn chứa số điện thoại
      const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/;
      const match = userMsg.match(phoneRegex);

      if (match) {
        saveLead({
          name: "Khách từ AI Chat",
          phone: match[1],
          message: userMsg,
          source: "AI Assistant"
        });
        botResponse = "Cảm ơn bạn! Tôi đã ghi lại số điện thoại. Chuyên viên sẽ gọi cho bạn ngay trong ít phút nữa.";
        setHasPhone(true);
      } else if (!hasPhone) {
        botResponse = "Để tôi hỗ trợ bạn tốt nhất, bạn vui lòng để lại Số điện thoại nhé. Tôi sẽ gửi thông tin qua Zalo cho bạn.";
      } else {
        botResponse = "Vâng, tôi đang kiểm tra thông tin này. Bạn đợi một lát nhé!";
      }

      setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[60] flex flex-col items-end">
      {/* Messages Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Trợ lý BĐS Chơn Thành</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-blue-100 font-medium">Đang trực tuyến</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none font-medium"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập nội dung cần hỏi..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all shadow-inner"
            />
            <button 
              type="submit"
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-blue-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative ${
          isOpen ? "bg-white text-blue-600 border border-gray-100" : "bg-blue-600 text-white"
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-black items-center justify-center text-white">1</span>
          </span>
        )}
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
