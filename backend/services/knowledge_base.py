import os
import re

class KnowledgeBase:
    def __init__(self, data_path="data/counseling_handbook.txt"):
        self.data_path = os.path.join(os.getcwd(), data_path)
        self.documents = []
        self.is_loaded = False
        
    def load_data(self):
        """Loads and pre-indexes the counseling handbook text map."""
        if not os.path.exists(self.data_path):
            print(f"[WARN] Knowledge Base not found at: {self.data_path}")
            return False
            
        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                raw_text = f.read()
                
            # Split by pages
            self.documents = raw_text.split("--- PAGE ")
            
            # Pre-index for faster search (term frequencies)
            self._doc_indices = []
            for doc in self.documents:
                words = re.findall(r'\b[a-z]{3,}\b', doc.lower())
                freq_map = {}
                for w in words:
                    freq_map[w] = freq_map.get(w, 0) + 1
                self._doc_indices.append({
                    "content": doc,
                    "length": len(words),
                    "freq": freq_map
                })
                
            self.is_loaded = True
            print(f"[OK] Knowledge Base Loaded: {len(self.documents)} pages indexed.")
            return True
        except Exception as e:
            print(f"[ERR] Error loading Knowledge Base: {e}")
            return False

    def search(self, query: str, limit: int = 3):
        """
        Optimized keyword/relevance search using pre-indexed term frequencies.
        """
        if not self.is_loaded:
            if not self.load_data():
                return []

        query_terms = [t.lower() for t in re.findall(r'\b[a-z]{3,}\b', query)]
        if not query_terms:
            return []
            
        scored_docs = []
        
        for i, idx in enumerate(self._doc_indices):
            score = 0
            for term in query_terms:
                # Add score weighted by term frequency in document
                score += idx["freq"].get(term, 0)
                
            if score > 0:
                scored_docs.append((score, idx["content"], i))

        
        # Sort by score descending
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        
        # Return top K
        results = []
        for score, content, page_num in scored_docs[:limit]:
            # Snippet: grab meaningful chunk around best match or just first 500 chars
            snippet = content[:1000] + "..." 
            results.append({
                "page": page_num,
                "score": score,
                "content": snippet.strip()
            })
            
        return results

# Singleton instance
kb = KnowledgeBase()
