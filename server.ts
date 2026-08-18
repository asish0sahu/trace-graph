import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/db';
import { PREDEFINED_SCENARIOS } from './server/cypherQueries';
import { naturalLanguageToCypher } from './server/gemini';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health / Status & CognoDB Info
  app.get('/api/status', async (req, res) => {
    try {
      const status = await dbService.getStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reconnect / Configure CognoDB Credentials dynamically
  app.post('/api/connect', async (req, res) => {
    const { uri, user, password } = req.body;
    try {
      const result = await dbService.initDriver(uri, user, password);
      const status = await dbService.getStatus();
      res.json({ ...result, status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Run Seed script on CognoDB
  app.post('/api/seed', async (req, res) => {
    try {
      const result = await dbService.seedDatabase();
      const status = await dbService.getStatus();
      res.json({ ...result, status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Pre-configured Scenarios
  app.get('/api/scenarios', (req, res) => {
    res.json(PREDEFINED_SCENARIOS);
  });

  // Execute arbitrary or parameterised openCypher query
  app.post('/api/cypher', async (req, res) => {
    const { query, params } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    try {
      const result = await dbService.runCypher(query, params || {});
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get full graph or filtered view
  app.get('/api/graph/overview', (req, res) => {
    try {
      const graph = dbService.getFullGraph();
      res.json(graph);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Entity detail neighborhood
  app.get('/api/graph/entity/:id', (req, res) => {
    try {
      const details = dbService.getEntityDetails(req.params.id);
      if (!details) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      res.json(details);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create node with parameterised Cypher
  app.post('/api/graph/nodes', (req, res) => {
    try {
      const newNode = dbService.createNode(req.body);
      res.json(newNode);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Create relationship with parameterised Cypher
  app.post('/api/graph/relationships', (req, res) => {
    try {
      const newRel = dbService.createRelationship(req.body);
      res.json(newRel);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // AI Assistant: Natural language to Cypher
  app.post('/api/ai/ask', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    try {
      const translation = await naturalLanguageToCypher(prompt);
      res.json(translation);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Vite Frontend Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CognoDB Graph Intelligence Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
