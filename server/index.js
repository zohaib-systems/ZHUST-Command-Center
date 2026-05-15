import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (
      origin.startsWith('chrome-extension://') ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(bodyParser.json());

// Utility function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

// Utility function to write data
const writeData = (data) => {
  try {
    data.last_updated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ZHUST Command Center API is running. Use /api/* endpoints.'
  });
});

// GET: Retrieve all data
app.get('/api/data', (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Update weekly goals
app.post('/api/weekly-goals', (req, res) => {
  const data = readData();
  if (data) {
    const incomingGoals = req.body.goals;
    data.weekly_goals = Array.isArray(incomingGoals)
      ? { daily_tasks: [], other_tasks: incomingGoals }
      : (incomingGoals || { daily_tasks: [], other_tasks: [] });
    if (writeData(data)) {
      res.json({ success: true, data: data.weekly_goals });
    } else {
      res.status(500).json({ error: 'Failed to update weekly goals' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Update sprint board
app.post('/api/sprint-board', (req, res) => {
  const data = readData();
  if (data) {
    data.sprint_board = req.body.board || { tech: [], academic: [], administrative: [] };
    if (writeData(data)) {
      res.json({ success: true, data: data.sprint_board });
    } else {
      res.status(500).json({ error: 'Failed to update sprint board' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Update learning progress
app.post('/api/learning-progress', (req, res) => {
  const data = readData();
  if (data) {
    data.learning_progress = req.body.progress || {};
    if (writeData(data)) {
      res.json({ success: true, data: data.learning_progress });
    } else {
      res.status(500).json({ error: 'Failed to update learning progress' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Add captured notes
app.post('/api/notes', (req, res) => {
  const data = readData();
  if (data) {
    const { title = 'Untitled', content = '', source = 'manual', url = '', tags = [] } = req.body || {};
    const newNote = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      title,
      content,
      source,
      url,
      tags: Array.isArray(tags) ? tags : [],
    };
    data.captured_notes.push(newNote);
    if (writeData(data)) {
      res.json({ success: true, note: newNote });
    } else {
      res.status(500).json({ error: 'Failed to add note' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// DELETE: Remove a note
app.delete('/api/notes/:id', (req, res) => {
  const data = readData();
  if (data) {
    data.captured_notes = data.captured_notes.filter(note => note.id !== parseInt(req.params.id));
    if (writeData(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Add a prompt
app.post('/api/prompts', (req, res) => {
  const data = readData();
  if (data) {
    const { topic = 'Untitled', prompt = '' } = req.body || {};
    const newPrompt = {
      id: Date.now(),
      topic,
      prompt,
      created_at: new Date().toISOString(),
    };
    data.prompt_collection = data.prompt_collection || [];
    data.prompt_collection.push(newPrompt);
    if (writeData(data)) {
      res.json({ success: true, prompt: newPrompt });
    } else {
      res.status(500).json({ error: 'Failed to add prompt' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// DELETE: Remove a prompt
app.delete('/api/prompts/:id', (req, res) => {
  const data = readData();
  if (data) {
    data.prompt_collection = (data.prompt_collection || []).filter(
      entry => entry.id !== parseInt(req.params.id)
    );
    if (writeData(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete prompt' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// GET: Retrieve personal OS module state
app.get('/api/personal-os', (req, res) => {
  const data = readData();
  if (data) {
    res.json({
      success: true,
      data: data.personal_os || {
        plan: {
          long: { text: '', date: '', purpose: '' },
          mid: { text: '', date: '', purpose: '' },
          short: { text: '', date: '', purpose: '' }
        },
        finances: { income: 0, expenses: 0, assets: 0, debts: 0 },
        habits: [],
        skills: [],
        deadlines: []
      }
    });
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Save personal OS module state
app.post('/api/personal-os', (req, res) => {
  const data = readData();
  if (data) {
    const fallback = {
      plan: {
        long: { text: '', date: '', purpose: '' },
        mid: { text: '', date: '', purpose: '' },
        short: { text: '', date: '', purpose: '' }
      },
      finances: { income: 0, expenses: 0, assets: 0, debts: 0 },
      habits: [],
      skills: [],
      deadlines: []
    };

    data.personal_os = req.body.personal_os || fallback;

    if (writeData(data)) {
      res.json({ success: true, data: data.personal_os });
    } else {
      res.status(500).json({ error: 'Failed to update personal OS' });
    }
  } else {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST: Generate data snapshot
app.post('/api/snapshot', (req, res) => {
  const data = readData();
  if (data) {
    res.json({
      success: true,
      snapshot: {
        generatedAt: new Date().toISOString(),
        data: data
      }
    });
  } else {
    res.status(500).json({ error: 'Failed to generate snapshot' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ZHUST Command Center Backend running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ${DATA_FILE}`);
});
