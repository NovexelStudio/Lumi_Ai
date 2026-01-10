"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const updatedConversation = `${conversation}\n\n🧍 You: ${input}`;
    setConversation(updatedConversation);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setConversation(
      `${updatedConversation}\n🤖 Bot: ${data.reply || "No reply"}`
    );

    setInput("");
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">School Chatbot</h1>

      <textarea
        className="border p-2 w-full max-w-md rounded h-64 mb-3"
        value={conversation}
        readOnly
      />

      <textarea
        className="border p-2 w-full max-w-md rounded"
        rows={3}
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </main>
  );
}
