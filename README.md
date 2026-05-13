# 🏛️ ZHUST Command Center: Systems Architect Dashboard

**A locally-hosted, persistent engine for academic research and full-stack engineering.**

---

## 🛠️ Architecture Overview

This dashboard operates as a **"Local-First"** application, utilizing a React frontend and a Node.js/Express backend to ensure data persists directly to your hardware, bypassing browser volatility.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js (Port 5000)
- **Data Layer:** `data.json` (Flat-file database)
- **Backup:** Automated PDF snapshots via `jsPDF`

---

## 🚀 Core Sections

### 1. **Dashboard** (`/`)
Real-time overview of your system status:
- Weekly goal count and sprint task summary
- Captured notes overview
- Quick access to system toolkit
- PDF export button for weekly reports

### 2. **Weekly Horizon** (`/weekly-horizon`)
- **Input:** High-level strategic goals for the week
- **Logic:** Persisted in `data.json` under `weekly_goals` key
- **Focus:** Bridge Microbiology research with ZHUST agency growth

### 3. **Sprint Board** (`/sprint-board`)
- **Categorization:**
  - `💻 Tech`: MERN/Next.js development (BioSync AI, WasteWise)
  - `🔬 Academic`: UVAS Microbiology lab reports and theory
  - `📋 Administrative`: Freelance bidding and financial tracking

### 4. **Knowledge Vault** (`/knowledge-vault`)
- **Course Tracker:** Monitor progress for "Startup Strategies" and "Freelancing Program"
- **Integrated Notes:** Capture and view notes from ZHUST Extension
- **Learning Management:** Track completed modules and progress

### 5. **System Toolkit** (`/system-toolkit`)
- Quick-launch links for:
  - AI Studio
  - Cursor IDE
  - GitHub
  - Local development environments

---

## 💾 Data Persistence & Safety

### Local Backend (`server/index.js`)
The backend serves two primary functions:

#### 1. **Data Synchronization**
Every state change in the UI triggers a `POST` to update the local JSON:
- `POST /api/weekly-goals` — Update weekly goals
- `POST /api/sprint-board` — Update sprint board tasks
- `POST /api/learning-progress` — Update learning progress
- `POST /api/notes` — Add captured notes
- `DELETE /api/notes/:id` — Remove notes

#### 2. **Data Archiving**
The "Generate Weekly PDF" button triggers a formatted export of all goals and completed tasks for long-term record-keeping.

### Data Structure (`server/data.json`)
```json
{
  "last_updated": "2026-05-13T10:30:00Z",
  "weekly_goals": [
    "Goal 1",
    "Goal 2"
  ],
  "sprint_board": {
    "tech": ["Task 1", "Task 2"],
    "academic": ["Lab report", "Research"],
    "administrative": ["Invoice", "Bidding"]
  },
  "learning_progress": {
    "startup_strategies": {
      "completed": 3,
      "total": 10,
      "notes": []
    },
    "freelancing_program": {
      "completed": 6,
      "total": 12,
      "notes": []
    }
  },
  "captured_notes": [],
  "system_toolkit": {
    "tools": [
      {
        "name": "AI Studio",
        "url": "https://studio.anthropic.com",
        "description": "AI development environment"
      }
    ]
  }
}
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ (verify with `node --version`)
- npm (included with Node.js)

### Backend Setup
```bash
cd server
npm install
npm run dev  # Start with --watch mode
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev  # Start Vite dev server
# Frontend runs on http://localhost:5173
```

### Full Stack Startup (One Terminal)
From project root:
```bash
# Terminal 1: Start backend
cd server && npm install && npm run dev

# Terminal 2: Start frontend (in parallel)
cd client && npm install && npm run dev
```

---

## 🔌 API Reference

### Health Check
```bash
GET http://localhost:5000/api/health
```
Response: `{ "status": "ok", "timestamp": "..." }`

### Get All Data
```bash
GET http://localhost:5000/api/data
```

### Update Weekly Goals
```bash
POST http://localhost:5000/api/weekly-goals
Body: { "goals": ["Goal 1", "Goal 2"] }
```

### Update Sprint Board
```bash
POST http://localhost:5000/api/sprint-board
Body: { "board": { "tech": [], "academic": [], "administrative": [] } }
```

### Add Note
```bash
POST http://localhost:5000/api/notes
Body: { "title": "Note Title", "content": "Content here", "category": "general" }
```

### Delete Note
```bash
DELETE http://localhost:5000/api/notes/:noteId
```

### Generate Snapshot
```bash
POST http://localhost:5000/api/snapshot
```

---

## 🎨 Styling & Customization

The project uses **Tailwind CSS** with a custom ZHUST color scheme:

```javascript
// tailwind.config.js
colors: {
  zhust: {
    primary: '#1e3a8a',    // Deep blue
    secondary: '#3b82f6',  // Bright blue
    accent: '#fbbf24',     // Gold
    dark: '#0f172a'        // Near black
  }
}
```

Modify `client/tailwind.config.js` to customize colors.

---

## 📄 PDF Export

The **Generate Weekly PDF** button exports:
- All weekly goals
- Sprint board tasks by category
- Generation timestamp
- Formatted report suitable for archiving

File naming: `ZHUST-Report-YYYY-MM-DD.pdf`

---

## 🚢 Build for Production

### Frontend
```bash
cd client
npm run build
# Output: client/dist/
```

### Frontend Preview
```bash
cd client
npm run preview
# Runs built version on http://localhost:4173
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux
```

### CORS errors
Ensure backend is running on `http://localhost:5000` before starting frontend.

### Data not persisting
Check that `server/data.json` has write permissions and sufficient disk space.

### Frontend won't connect to backend
- Verify backend health: `curl http://localhost:5000/api/health`
- Check Vite proxy settings in `client/vite.config.js`

---

## 📋 Project Structure

```
System_Architect/
├── server/
│   ├── index.js           # Express backend
│   ├── data.json          # Local database
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🔐 Security Notes

1. **Local Data Only:** All data stored in `server/data.json` — never transmitted externally
2. **No Authentication:** Designed for single-user, local environment
3. **Backup Regularly:** Export weekly PDFs as archival backups
4. **Port Isolation:** Backend only accessible on `localhost:5000`

---

## 🎯 Next Steps

1. **Clone/Initialize:** Set up both frontend and backend
2. **Install Dependencies:** Run `npm install` in both directories
3. **Start Services:** Run backend on port 5000, frontend on port 5173
4. **Add Goals:** Start with Weekly Horizon to define strategic goals
5. **Break Down Tasks:** Use Sprint Board to categorize into actionable items
6. **Track Progress:** Update Learning Vault as you complete modules
7. **Export Reports:** Generate weekly PDFs for archival

---

## 📝 License

This project is part of the ZHUST research initiative. All rights reserved.

---

## 📞 Support

For issues or feature requests, refer to the inline code comments or enhance the API routes in `server/index.js`.

**Last Updated:** May 13, 2026
