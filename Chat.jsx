import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { messageService } from "../services/api";
import { io } from "socket.io-client";

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
    setSocket(newSocket);

    // Join chat room
    newSocket.emit("join_chat", matchId);

    // Load messages
    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender_id: data.senderId,
          content: data.content,
          created_at: data.timestamp,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages(matchId);
      setMessages(data);

      // Get match info from first message or API
      // For now we'll just show the matchId
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const newMessage = await messageService.sendMessage(
        matchId,
        match?.other_user_id || matchId,
        input
      );

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      // Send via socket
      if (socket) {
        socket.emit("send_message", {
          matchId,
          senderId: user.id,
          content: input,
        });
      }
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/matches")}
            className="text-primary font-bold"
          >
            ← Back to Matches
          </button>
          <h1 className="text-xl font-bold">Chat</h1>
          <div></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender_id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === user.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input-field flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="btn-primary px-6">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
