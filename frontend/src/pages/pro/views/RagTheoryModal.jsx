import { useState } from 'react';
import { Send, X, CheckCircle } from 'lucide-react';

export default function RagTheoryModal({ zone, onClose, onComplete }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Welcome to the theory section for ${zone.title}. What concepts would you like to understand before jumping into the code?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // ✅ YAHAN CHANGE KIYA HAI: Hardcoded IP hata kar Environment Variable laga diya
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, zoneId: zone.id })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection to RAG engine failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#0D0F12', width: '600px', height: '600px', borderRadius: 12,
        border: '1px solid #1E2028', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #1E2028', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#CDD6F4' }}>AI Theory: {zone.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6C7086', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{
                background: msg.role === 'user' ? '#4F8EF7' : '#1E2028',
                color: '#fff', padding: '10px 15px', borderRadius: 8, fontSize: '14px', lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#6C7086', fontSize: 12 }}>AI is searching documents...</div>}
        </div>

        {/* Action Area */}
        <div style={{ padding: '15px 20px', borderTop: '1px solid #1E2028' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about formulas, concepts, or docs..."
              style={{ flex: 1, background: '#0A0B0E', border: '1px solid #1E2028', color: '#fff', padding: '10px 15px', borderRadius: 6, outline: 'none' }}
            />
            <button onClick={handleSend} style={{ background: '#4F8EF7', border: 'none', padding: '0 15px', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => onComplete(zone.id)}
            style={{ width: '100%', background: '#34D399', border: 'none', padding: '12px', borderRadius: 6, color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            <CheckCircle size={18} /> Mark as Understood & Start Practical
          </button>
        </div>
      </div>
    </div>
  );
}