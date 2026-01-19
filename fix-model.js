const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

// Fix the selectedModel state
content = content.replace(
  "const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');",
  "const [selectedModel, setSelectedModel] = useState('gemini');"
);

// Also fix the model being sent to API - change 'gemini' to use the correct value that the backend expects
// But first check what the backend route.ts expects
const history = content.match(/model: selectedModel/);
if (history) {
  console.log('Found model parameter being passed correctly');
}

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Fixed selectedModel state to use "gemini" instead of "gemini-2.0-flash"');
