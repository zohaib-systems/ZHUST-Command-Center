# 📚 Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
├─────────────────────────────────────────────────────────────┤
│  React App (Port 5173)                                      │
│  ├─ Dashboard Component                                     │
│  ├─ WeeklyHorizon Component                                 │
│  ├─ SprintBoard Component                                   │
│  ├─ KnowledgeVault Component                                │
│  └─ SystemToolkit Component                                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/Proxy
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS BACKEND (Port 5000)                    │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                    │
│  ├─ GET  /api/data              → Read all data            │
│  ├─ POST /api/weekly-goals      → Update goals             │
│  ├─ POST /api/sprint-board      → Update tasks             │
│  ├─ POST /api/learning-progress → Update progress          │
│  ├─ POST /api/notes             → Add note                 │
│  ├─ DELETE /api/notes/:id       → Delete note              │
│  ├─ POST /api/snapshot          → Generate export          │
│  └─ GET  /api/health            → Health check             │
└────────────────────┬────────────────────────────────────────┘
                     │ File I/O
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           LOCAL PERSISTENT STORAGE                          │
├─────────────────────────────────────────────────────────────┤
│  server/data.json (Flat-file JSON Database)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Frontend (React)

```
App.jsx (Root)
├── Navbar (Navigation bar with menu toggle)
├── Sidebar (Navigation menu)
└── Routes
    ├── Dashboard (/)
    │   └── Displays KPIs, recent activity, quick links
    ├── WeeklyHorizon (/weekly-horizon)
    │   └── Goal management interface
    ├── SprintBoard (/sprint-board)
    │   └── Task categorization (Tech, Academic, Admin)
    ├── KnowledgeVault (/knowledge-vault)
    │   └── Course tracker and note management
    └── SystemToolkit (/system-toolkit)
        └── Tool directory and feature highlights
```

### State Management (React Context)

**AppContext** provides:
- `data` — Current application state
- `loading` — Loading state
- `error` — Error messages
- `updateWeeklyGoals()` — Update goals
- `updateSprintBoard()` — Update tasks
- `updateLearningProgress()` — Update courses
- `addNote()` — Create note
- `removeNote()` — Delete note
- `generateSnapshot()` — Export data

### Custom Hooks

**useApp()** — Access AppContext anywhere in the app

**usePDFExport()** — Generate PDF reports with jsPDF

---

## Data Flow

### Creating a Weekly Goal

```
1. User types in WeeklyHorizon input field
2. Click "Add Goal" button
3. Frontend calls updateWeeklyGoals([...goals, newGoal])
4. AppContext makes POST /api/weekly-goals
5. Backend updates server/data.json
6. Backend responds with updated array
7. Frontend updates state → Component re-renders
```

### Adding a Sprint Task

```
1. User selects category (Tech/Academic/Admin)
2. Types task and clicks "Add Task"
3. Frontend calls updateSprintBoard(newBoard)
4. Backend updates board[category] in data.json
5. Frontend receives updated board
6. Grid component re-renders with new task
```

### Capturing a Note

```
1. User fills Knowledge Vault form
2. Clicks "Save Note"
3. Frontend calls addNote(noteData)
4. Backend creates note with ID and timestamp
5. Backend appends to captured_notes array
6. Frontend updates captured_notes state
7. Note appears in Notes List
```

---

## API Contract

### Request/Response Examples

**Get All Data**
```http
GET /api/data HTTP/1.1
Host: localhost:5000

HTTP/1.1 200 OK
{
  "last_updated": "2026-05-13T10:30:00Z",
  "weekly_goals": ["Goal 1"],
  "sprint_board": {...},
  "learning_progress": {...},
  "captured_notes": [...],
  "system_toolkit": {...}
}
```

**Update Weekly Goals**
```http
POST /api/weekly-goals HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{"goals": ["New Goal", "Another Goal"]}

HTTP/1.1 200 OK
{"success": true, "data": ["New Goal", "Another Goal"]}
```

**Add Note**
```http
POST /api/notes HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Meeting Notes",
  "content": "Discussed project timeline",
  "category": "general"
}

HTTP/1.1 200 OK
{
  "success": true,
  "note": {
    "id": 1620000000000,
    "timestamp": "2026-05-13T10:30:00Z",
    "title": "Meeting Notes",
    "content": "Discussed project timeline",
    "category": "general"
  }
}
```

---

## Styling Architecture

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      zhust: {
        primary: '#1e3a8a',   // Deep blue
        secondary: '#3b82f6', // Bright blue
        accent: '#fbbf24',    // Gold
        dark: '#0f172a'       // Near black
      }
    }
  }
}
```

### Component Styling Patterns

- **Card layouts:** `bg-zhust-primary border border-zhust-secondary rounded-lg p-6`
- **Primary buttons:** `bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold`
- **Input fields:** `bg-gray-900 border border-gray-700 rounded-lg focus:border-zhust-secondary`
- **Accent text:** `text-zhust-accent` for headers and important text

---

## PDF Export Implementation

### jsPDF Integration

```javascript
// usePDFExport.js
const exportToPDF = async () => {
  const snapshot = await generateSnapshot();
  const doc = new jsPDF();
  
  // Add title, date, content
  doc.text('ZHUST Command Center', ...);
  doc.text('Weekly Report', ...);
  
  // Add goals
  doc.text('Weekly Goals', ...);
  snapshot.data.weekly_goals.forEach(goal => {
    doc.text(goal, ...);
  });
  
  // Add sprint board
  doc.text('Sprint Board', ...);
  // ... tasks by category
  
  doc.save(`ZHUST-Report-${date}.pdf`);
};
```

### PDF Structure
1. Title and generation date
2. Weekly goals section
3. Sprint board (Tech, Academic, Administrative)
4. Learning progress summary
5. Notes section (optional)

---

## Error Handling

### Backend Error Handling
```javascript
// Try-catch in all route handlers
try {
  const data = readData();
  // Process...
  res.json({ success: true });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Operation failed' });
}
```

### Frontend Error Handling
```javascript
// In AppContext
try {
  const response = await axios.post(endpoint, data);
  return true;
} catch (err) {
  setError('Failed to update');
  console.error(err);
  return false;
}
```

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting:** React Router enables automatic code splitting per route
2. **CSS Optimization:** Tailwind purges unused styles in production
3. **Asset Optimization:** Vite handles minification and compression
4. **Lazy Loading:** Components load on-demand with React Router
5. **JSON Efficiency:** Flat-file JSON is fast for small datasets (<1MB)

### Scalability Notes

- **Current:** Handles easily up to 1MB of data
- **Limit:** For >10MB data, consider migrating to SQLite or PostgreSQL
- **Concurrency:** Single-threaded Node.js suitable for single user
- **Multiple Users:** Would require authentication + database + WebSocket sync

---

## Security Architecture

### Current Implementation
- **Runs locally** — No external network exposure
- **No authentication** — Designed for single user
- **File permissions** — Relies on OS-level security

### Production Hardening

1. **Implement JWT authentication**
2. **Use environment variables for secrets**
3. **Add request validation with Joi or Yup**
4. **Enable CORS restrictions**
5. **Rate limiting with express-rate-limit**
6. **HTTPS/TLS encryption**
7. **Regular security audits**

---

## Future Enhancements

### Planned Features
- [ ] Multi-user support with authentication
- [ ] Real-time collaboration with WebSockets
- [ ] Database migration (PostgreSQL)
- [ ] Advanced search and filtering
- [ ] Custom themes and personalization
- [ ] Integration with calendar systems
- [ ] Email reminders and notifications
- [ ] Mobile app (React Native)

---

**Last Updated:** May 13, 2026
