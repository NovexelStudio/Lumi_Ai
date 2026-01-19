const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to find and replace the streaming code
const pattern = /const reader = response\.body\?\.getReader\(\);[\s\S]*?getUserChats\(user\.uid\)\.then\(setChats\);\s*\}/;

const replacement = `const data = await response.json();
      const assistantContent = data.content;
      setStreamingContent(assistantContent);
      
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: assistantContent, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(user.uid, chatId, assistantMessage);
      setStreamingContent('');
      getUserChats(user.uid).then(setChats);
    }`;

const newContent = content.replace(pattern, replacement);

if (newContent !== content) {
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully fixed the response parsing!');
} else {
  console.log('Pattern not found - checking file structure...');
  // Try to find what's actually there
  if (content.includes('const reader = response.body?.getReader()')) {
    console.log('Found reader code, but pattern matching failed');
  } else {
    console.log('Reader code not found in file');
  }
}
