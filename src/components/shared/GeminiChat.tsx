import { useState } from 'react';
import { prepareListingsForGemini } from '@/lib/appwrite/api';
import { Listing } from '@/types';

interface GeminiChatProps {
  onResults: (results: Listing[]) => void;
}

const GeminiChat = ({ onResults }: GeminiChatProps) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const listingsData = await prepareListingsForGemini();
      console.log("Appwrite Listings Data:", listingsData);

      // Send the results back to the Home component
      onResults(listingsData);

      const aiResponse = `Rex: showing you ${listingsData.length} listings matching your criteria`;
      setMessages([...messages, { text: input, sender: 'user' }, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error("Error handling message:", error);
      setMessages([...messages, { text: input, sender: 'user' }, { text: "Sorry, something went wrong. Please try again later.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat p-4 bg-dark-2 rounded flex flex-col h-full">
      <h3 className="h3-bold text-light-1 mb-3">I'm Rex, your personal AI realtor</h3>
      <div className="ai-chat-box flex-1 overflow-auto bg-dark-3 p-3 rounded border border-dark-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`message p-2 mb-2 rounded ${msg.sender === 'user' ? 'bg-primary-500 text-light-1 self-end' : 'bg-dark-4 text-light-1 self-start'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="ai-chat-input mt-3 flex items-center border-t border-dark-4 pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-dark-4 rounded bg-dark-3 text-light-1 placeholder:text-light-4"
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="ml-2 p-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 transition" disabled={loading}>
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;