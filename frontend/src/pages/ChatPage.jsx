// src/pages/ChatPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function formatDateHeader(date) {
  const today = new Date();
  const d = new Date(date);
  const dStr = d.toDateString();
  if (dStr === today.toDateString()) return "Today";
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dStr === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const { therapistId } = useParams();

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef();
  const bottomRef = useRef();

  // 1️⃣ Create or fetch the session
  useEffect(() => {
    API.post("/chat", { therapistId })
      .then(({ data }) => setSessionId(data.sessionId))
      .catch(() => setError("Could not start chat session"));
  }, [therapistId]);

  // 2️⃣ Load history + connect socket
  useEffect(() => {
    if (!sessionId) return;

    API.get(`/chat/${sessionId}`)
      .then((res) => setMessages(res.data.messages))
      .catch(() => setError("Could not load messages"));

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token: user.token },
    });

    socketRef.current.emit("joinSession", sessionId);
    socketRef.current.on("newMessage", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    socketRef.current.on("error", console.error);

    return () => socketRef.current.disconnect();
  }, [sessionId, user.token]);

  // 3️⃣ Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ Send a message
  const sendMessage = () => {
    const content = input.trim();
    if (!content) return;
    socketRef.current.emit("sendMessage", { sessionId, content });
    setInput("");
  };

  // for date headers
  let lastDate = "";

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Chat</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex-1 overflow-auto border rounded-lg p-4 bg-white shadow">
        {messages.map((m) => {
          const msgDate = new Date(m.createdAt);
          const dayString = msgDate.toDateString();
          const showHeader = dayString !== lastDate;
          if (showHeader) lastDate = dayString;

          const isMe = m.sender._id === user.id;
          const initial = m.sender.name.charAt(0).toUpperCase();

          return (
            <React.Fragment key={m._id}>
              {showHeader && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDateHeader(m.createdAt)}
                  </span>
                </div>
              )}

              <div
                className={`mb-4 flex items-start ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar + name for the other side */}
                {!isMe && (
                  <div className="flex flex-col items-center mr-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      {initial}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {m.sender.name}
                    </p>
                  </div>
                )}

                {/* Message bubble */}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      isMe
                        ? "bg-indigo-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                  <p
                    className={`mt-1 text-xs text-gray-500 ${
                      isMe ? "text-right" : ""
                    }`}
                  >
                    {msgDate.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Avatar + name for self */}
                {isMe && (
                  <div className="flex flex-col items-center ml-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {initial}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{user.name}</p>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
