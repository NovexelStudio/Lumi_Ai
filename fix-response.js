const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

// Replace the streaming reader code with JSON parsing
const oldCode = `const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          setStreamingContent(assistantContent);
        }
        const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: assistantContent, timestamp: Date.now() };
        setMessages(prev => [...prev, assistantMessage]);
        await saveMessage(user.uid, chatId, assistantMessage);
        setStreamingContent('');
        getUserChats(user.uid).then(setChats);
      }`;

const newCode = `const data = await response.json();
      const assistantContent = data.content;
      setStreamingContent(assistantContent);
      
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: assistantContent, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(user.uid, chatId, assistantMessage);
      setStreamingContent('');
      getUserChats(user.uid).then(setChats);`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('app/page.tsx', content, 'utf8');
  console.log('Fixed!');
} else {
  console.log('Old code pattern not found. File may have different formatting.');
}
