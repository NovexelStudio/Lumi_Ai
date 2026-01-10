export async function POST(req) {
  const { message } = await req.json();

  let reply = "I don't understand.";

  if (message.toLowerCase().includes("hello")) {
    reply = "Hello! How can I help you?";
  } else if (message.toLowerCase().includes("your name")) {
    reply = "I am a school chatbot.";
  } else if (message.toLowerCase().includes("bye")) {
    reply = "Goodbye! Have a nice day.";
  }

  return Response.json({ reply });
}
