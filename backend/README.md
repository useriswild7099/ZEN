# ZenGuard AI - Backend

Privacy-first mental health sentiment monitoring API powered by Gemma 3:4B.

## Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Make sure Ollama is running with Gemma 3
ollama serve
# In another terminal: ollama run gemma3:4b

# Run the server
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /api/analyze` - Full sentiment analysis
- `POST /api/quick-check` - Real-time feedback while typing
- `GET /health` - Health check

## Privacy Guarantees

- No database connections
- No logging of request bodies
- Stateless processing
- Immediate garbage collection after response
