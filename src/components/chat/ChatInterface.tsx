import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage(""); // clear input immediately

    try {
      const res = await fetch("http://localhost:8000/api/v2/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      // data: { humanReply, habitJson, success }

      if (data.success) {
        // Append AI human-friendly reply
        const aiMessage = { sender: "ai", content: data.humanReply };
        setChatHistory((prev) => [...prev, aiMessage]);

        // If AI suggests a habit, create it immediately
        if (data.habitJson) {
          const habitRes = await fetch("http://localhost:8000/api/v2/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              title: data.habitJson.habitName,
              description: data.habitJson.goal,
              category: data.habitJson.category,
              color: "bg-primary",
            }),
          });

          const createdHabit = await habitRes.json();

          // Append system message showing habit created
          const systemMessage = {
            sender: "system",
            content: `📌 New habit created: "${createdHabit.title}" → ${createdHabit.description}`,
          };

          setChatHistory((prev) => [...prev, systemMessage]);
        }
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "system", content: "Error: Failed to get a response." },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-slate-50">
        {chatHistory.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              Welcome to HabitMate
            </h3>
            <p className="text-gray-500 mt-2">
              Ask me anything about building good habits!
            </p>
          </div>
        ) : (
          chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-3xl px-4 py-3 shadow-sm break-words ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                    : msg.sender === "ai"
                    ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-none"
                    : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                <div className="flex items-start">
                  {msg.sender === "user" && (
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                        YOU
                      </div>
                    </div>
                  )}
                  {msg.sender === "ai" && (
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                    </div>
                  )}
                  {msg.sender === "system" && (
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        SYS
                      </div>
                    </div>
                  )}
                  <div className="min-w-0">{msg.content}</div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex items-center rounded-2xl bg-slate-100 pl-4 pr-2 py-2 shadow-inner">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask HabitMate about building good habits..."
            className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={handleSendMessage}
            className="ml-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
            disabled={!message.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
