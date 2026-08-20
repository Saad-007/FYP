import { useState } from 'react';

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [resultData, setResultData] = useState(null); // Stores the full response object containing answer and sources
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        setResultData(data.data); // Expected format: { answer: "...", sources: [...] }
      } else {
        setError("An error occurred: " + data.error);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please ensure the backend service is running.");
      console.error("Search API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🤖</span> EduAIQuest Smart Tutor
      </h2>
      
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about the course... (e.g., What is React?)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      {/* Generated Answer Section */}
      {resultData && resultData.answer && (
        <div className="mb-8 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <h3 className="font-bold text-blue-800 mb-2">AI Answer:</h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{resultData.answer}</p>
        </div>
      )}

      {/* Sources Section */}
      {resultData && resultData.sources && resultData.sources.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-600 mb-3 text-sm uppercase tracking-wider">Sources</h4>
          <div className="space-y-3">
            {resultData.sources.map((item) => (
              <div key={item.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-600">{item.metadata.source}</span>
                  <span className="text-xs text-green-600 font-semibold">Match: {(item.similarity * 100).toFixed(1)}%</span>
                </div>
                <p className="text-gray-600 italic">"{item.content}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}