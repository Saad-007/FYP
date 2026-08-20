import { searchSimilarDocuments } from '../services/aiService.js';

export const handleSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Service ko call kiya
    const results = await searchSimilarDocuments(query);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};