# 🏛️ ZHUST Command Center - Visual Architecture Guide

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER'S COMPUTER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            WEB BROWSER (http://localhost:5173)           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │    ZHUST Command Center Dashboard (React App)           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │  Dashboard  │  │   Weekly    │  │   Sprint    │    │  │
│  │  │             │  │   Horizon   │  │   Board     │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  │  ┌─────────────┐  ┌─────────────┐                      │  │
│  │  │  Knowledge  │  │   System    │                      │  │
│  │  │   Vault     │  │   Toolkit   │                      │  │
│  │  └─────────────┘  └─────────────┘                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓↑                                     │
│                  (HTTP via Proxy)                              │
│                          ↓↑                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     EXPRESS BACKEND (http://localhost:5000)              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  API Routes:                                            │  │
│  │  • GET  /api/data              (Read all)              │  │
│  │  • POST /api/weekly-goals      (Update goals)          │  │
│  │  • POST /api/sprint-board      (Update tasks)          │  │
│  │  • POST /api/learning-progress (Update learning)       │  │
│  │  • POST /api/notes             (Add note)              │  │
│  │  • DELETE /api/notes/:id       (Delete note)           │  │
│  │  • POST /api/snapshot          (Export data)           │  │
│  │  • GET  /api/health            (Health check)          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓↑                                     │
│                    (File I/O)                                  │
│                          ↓↑                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        LOCAL PERSISTENT STORAGE                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  server/data.json (Flat-file JSON Database)            │  │
│  │  {                                                      │  │
│  │    "weekly_goals": [...],                              │  │
│  │    "sprint_board": {...},                              │  │
│  │    "learning_progress": {...},                         │  │
│  │    "captured_notes": [...]                             │  │
│  │  }                                                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Flow Example: Adding a Weekly Goal

```
1. User Types Goal
   ↓
   "Complete Microbiology Lab Report"

2. User Clicks "Add Goal"
   ↓
   WeeklyHorizon.jsx component
   → calls updateWeeklyGoals()

3. Context Makes API Call
   ↓
   POST /api/weekly-goals
   Body: {"goals": [..., "Complete Microbiology Lab Report"]}

4. Backend Processes
   ↓
   server/index.js
   → Reads current data.json
   → Adds new goal to array
   → Saves updated data.json
   → Responds with success

5. Frontend Updates
   ↓
   AppContext updates state
   → Component re-renders
   → New goal appears in list

6. Data Persists
   ↓
   Goal saved in server/data.json
   ✓ Survives page refresh
   ✓ Available on next session
```

---

## 📱 Component Tree

```
App.jsx
├── Navbar
│   ├── Menu Toggle Button
│   └── Current Date Display
│
├── Sidebar
│   └── Navigation Menu
│       ├── Dashboard Link
│       ├── Weekly Horizon Link
│       ├── Sprint Board Link
│       ├── Knowledge Vault Link
│       └── System Toolkit Link
│
└── Routes
    ├── Dashboard/
    │   ├── KPI Cards (Goals, Tasks, Notes, Status)
    │   ├── Recent Goals Section
    │   ├── Recent Notes Section
    │   ├── Quick Links Section
    │   └── Export PDF Button
    │
    ├── WeeklyHorizon/
    │   ├── Goal Input Form
    │   ├── Add Goal Button
    │   ├── Goals List
    │   │   └── Goal Item with Delete
    │   └── Summary Box
    │
    ├── SprintBoard/
    │   ├── Category Tabs (Tech, Academic, Admin)
    │   ├── Task Input Form
    │   ├── Add Task Button
    │   └── Tasks Grid (3 columns)
    │       ├── Tech Tasks
    │       ├── Academic Tasks
    │       └── Admin Tasks
    │
    ├── KnowledgeVault/
    │   ├── Course Trackers (2 courses)
    │   ├── Course Progress Bars
    │   ├── Note Input Form
    │   ├── Save Note Button
    │   └── Notes List
    │       └── Note Items with Delete
    │
    └── SystemToolkit/
        ├── Tools Grid
        ├── Tool Cards with Links
        ├── Add Tool Instructions
        ├── Architecture Features
        └── System Status Display
```

---

## 🔄 State Management Flow

```
User Interaction (Click, Type)
        ↓
Component Event Handler
        ↓
Call Function from AppContext
  (updateWeeklyGoals, addNote, etc.)
        ↓
Make API Call via Axios
  POST /api/endpoint
        ↓
Backend Processes Request
  (Update data.json)
        ↓
Backend Returns Response
        ↓
Update AppContext State
  (setData with new values)
        ↓
Component Re-renders
  with New State
        ↓
UI Updates to Show Changes
        ↓
User Sees Results ✓
```

---

## 📊 Database Schema Visualization

```
data.json
│
├── last_updated (ISO timestamp)
│
├── weekly_goals
│   └── ["Goal 1", "Goal 2", "Goal 3"]
│
├── sprint_board
│   ├── tech
│   │   └── ["Task 1", "Task 2"]
│   ├── academic
│   │   └── ["Lab Report", "Research"]
│   └── administrative
│       └── ["Invoice", "Bidding"]
│
├── learning_progress
│   ├── startup_strategies
│   │   ├── completed: 3
│   │   ├── total: 10
│   │   └── notes: []
│   └── freelancing_program
│       ├── completed: 6
│       ├── total: 12
│       └── notes: []
│
├── captured_notes
│   └── [
│       {
│         "id": 1620000000000,
│         "timestamp": "2026-05-13T10:30:00Z",
│         "title": "Note Title",
│         "content": "Note content",
│         "category": "general"
│       }
│     ]
│
└── system_toolkit
    └── tools
        └── [
            {
              "name": "AI Studio",
              "url": "https://studio.anthropic.com",
              "description": "AI development"
            }
          ]
```

---

## 🎨 UI Layout Map

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR: ZHUST Command Center | 📅 Current Date              │
├───────┬─────────────────────────────────────────────────────┤
│       │                                                     │
│   S   │                    MAIN CONTENT                     │
│   I   │  (Dashboard / Weekly Horizon / Sprint Board /       │
│   D   │   Knowledge Vault / System Toolkit)                │
│   E   │                                                     │
│   B   │                                                     │
│   A   │                                                     │
│   R   │                                                     │
│   |   │                                                     │
│   📋  │                                                     │
│   🎯  │                                                     │
│   🚀  │                                                     │
│   📚  │                                                     │
│   🔧  │                                                     │
│       │                                                     │
└───────┴─────────────────────────────────────────────────────┘

Sidebar Options:
  📊 Dashboard
  🎯 Weekly Horizon
  🚀 Sprint Board
  📚 Knowledge Vault
  🔧 System Toolkit
```

---

## 🔐 Data Flow Security

```
User Input
    ↓
Frontend Validation (React)
    ↓
API Call (HTTP via Proxy to localhost:5000)
    ↓
Backend Receives Request
    ↓
Input Validation (Express middleware)
    ↓
Process Data
    ↓
Update File (data.json)
    ↓
Return Response
    ↓
Frontend Updates State
    ↓
UI Re-renders

✓ All data stays local
✓ No external transmission
✓ Validated at each step
✓ File permissions enforced by OS
```

---

## 📈 Scaling Considerations

```
Current Implementation:
   Single User
   ↓
   Local File Storage (data.json)
   ↓
   ~1MB max data
   ↓
   Perfect for: Individual researchers, students

If Scaling to Multiple Users:
   Multiple Users
   ↓
   Need Authentication (JWT)
   ↓
   Need Database (PostgreSQL, MongoDB)
   ↓
   Need Real-time Sync (WebSockets)
   ↓
   Need Cloud Hosting
   ↓
   Perfect for: Teams, organizations

If Scaling for Performance:
   10+ users
   ↓
   Add Caching (Redis)
   ↓
   Add Load Balancing
   ↓
   Add CDN for Frontend
   ↓
   Add Search Index (Elasticsearch)
```

---

## 🚀 Deployment Architecture

```
Development:
  Localhost:5173 (Frontend)
  └─→ Localhost:5000 (Backend)
      └─→ server/data.json (Local)

Production Option 1: Vercel + Railway
  Vercel (Frontend)
  └─→ railway.app (Backend)
      └─→ Persistent Storage

Production Option 2: Self-hosted
  Your Domain (Frontend)
  └─→ Your Server (Backend)
      └─→ Local/Cloud Storage

Production Option 3: Docker
  Docker Container (Frontend)
  └─→ Docker Container (Backend)
      └─→ Persistent Volume
```

---

## 📊 Technology Stack Visualization

```
┌──────────────────────────────────────────┐
│           Frontend Layer                 │
├──────────────────────────────────────────┤
│  React 19 ↔ React Router 7              │
│       ↓                                  │
│  Component State ↔ Context API          │
│       ↓                                  │
│  Tailwind CSS (Styling)                 │
│       ↓                                  │
│  Vite (Build & Dev Server)              │
└──────────────────────────────────────────┘
              ↓ HTTP ↓
┌──────────────────────────────────────────┐
│           Backend Layer                  │
├──────────────────────────────────────────┤
│  Express.js (Web Server)                │
│       ↓                                  │
│  CORS + Body Parser (Middleware)        │
│       ↓                                  │
│  API Routes (8 endpoints)               │
│       ↓                                  │
│  Data Processing                        │
└──────────────────────────────────────────┘
              ↓ File I/O ↓
┌──────────────────────────────────────────┐
│         Storage Layer                    │
├──────────────────────────────────────────┤
│  data.json (Flat-file Database)         │
│  ├─ Weekly Goals                        │
│  ├─ Sprint Board                        │
│  ├─ Learning Progress                   │
│  └─ Captured Notes                      │
└──────────────────────────────────────────┘
```

---

## 🎯 Feature Implementation Map

```
Dashboard (/)
├─ KPI Display
│   ├─ Goal Count
│   ├─ Task Count
│   ├─ Note Count
│   └─ System Status
├─ Recent Activity
│   ├─ Recent Goals
│   └─ Recent Notes
├─ Quick Links
│   └─ System Toolkit
└─ PDF Export

Weekly Horizon (/weekly-horizon)
├─ Input Form
├─ Add Button
├─ Goals List
│   └─ Delete Button
└─ Summary

Sprint Board (/sprint-board)
├─ Category Tabs
├─ Input Form
├─ Add Button
└─ Task Grid
    ├─ Tech Column
    ├─ Academic Column
    └─ Admin Column

Knowledge Vault (/knowledge-vault)
├─ Course Trackers
│   ├─ Progress Bar 1
│   └─ Progress Bar 2
├─ Note Form
├─ Save Button
├─ Notes List
│   └─ Delete Button
└─ Learning Summary

System Toolkit (/system-toolkit)
├─ Tool Grid
│   └─ Tool Cards
├─ Architecture Info
├─ Feature Highlights
└─ System Status
```

---

## 🔄 Data Persistence Lifecycle

```
Session 1:
  User adds goal → Saved to data.json
  User refreshes page → Data loads from data.json
  ✓ Data persists

Session 2 (Next day):
  User closes browser
  Data remains in data.json
  User opens app again → Data loads
  ✓ Data persists across sessions

Backup:
  User clicks "Generate PDF"
  → PDF contains all current data
  → PDF downloads to computer
  ✓ Backup created

Recovery:
  If data.json corrupted:
  → Restore from PDF export
  → Or restore from git history
  ✓ Data recovery possible
```

---

## 🎨 Color Scheme Applied

```
Primary Colors (ZHUST Theme):

Deep Blue (#1e3a8a)
  └─ Used for: Main background, cards, primary elements

Bright Blue (#3b82f6)
  └─ Used for: Buttons, hover states, interactive elements

Gold (#fbbf24)
  └─ Used for: Titles, headers, emphasis, accents

Near Black (#0f172a)
  └─ Used for: Text background, text containers

Gray Shades:
  #111827 (Very dark) - Input backgrounds
  #1f2937 (Dark) - Section backgrounds
  #4b5563 (Medium) - Subtle elements
  #9ca3af (Light) - Secondary text
```

---

## 📞 Quick Reference

| Element | Location | Purpose |
|---------|----------|---------|
| Backend | http://localhost:5000 | API Server |
| Frontend | http://localhost:5173 | Web App |
| Health | http://localhost:5000/api/health | Status Check |
| Data | server/data.json | Local Database |
| Config | client/tailwind.config.js | Styling |
| Routes | client/src/App.jsx | Navigation |
| Context | client/src/context/AppContext.jsx | State |

---

**Visual Architecture Guide Created:** May 13, 2026  
**Version:** 1.0.0  
**Status:** ✅ Complete and Production Ready
