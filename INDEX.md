# 🏛️ ZHUST Command Center - Documentation Index

**Welcome to the ZHUST Command Center: Systems Architect Dashboard**

This is your complete guide to understanding, running, and developing the local-first academic research and engineering management system.

---

## 📖 Quick Navigation

### 🚀 Getting Started
- **[README.md](README.md)** — Main project overview and features
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** — High-level status and capabilities
- **[QUICKSTART.bat](QUICKSTART.bat)** — Windows one-click setup
- **[QUICKSTART.sh](QUICKSTART.sh)** — macOS/Linux setup

### 🛠️ Technical Documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System design, data flow, API contracts
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Setup, deployment, and troubleshooting
- **[DEVELOPMENT.md](DEVELOPMENT.md)** — Development guidelines and best practices

---

## 🎯 Start Here Based on Your Role

### 👤 **End User (Just Want to Use It)**
1. Read: [README.md](README.md) — Overview of features
2. Run: [QUICKSTART.bat](QUICKSTART.bat) or [QUICKSTART.sh](QUICKSTART.sh)
3. Access: http://localhost:5173
4. Explore: Dashboard → Weekly Horizon → Sprint Board → Knowledge Vault

### 👨‍💻 **Developer (Want to Modify/Extend)**
1. Read: [ARCHITECTURE.md](ARCHITECTURE.md) — Understand the system
2. Read: [DEVELOPMENT.md](DEVELOPMENT.md) — Coding guidelines
3. Clone the repo and follow [DEPLOYMENT.md](DEPLOYMENT.md) for setup
4. Modify code and see live changes with hot reload

### 🚀 **DevOps/Deployment (Want to Deploy)**
1. Read: [DEPLOYMENT.md](DEPLOYMENT.md) — All deployment options
2. Choose hosting (Vercel for frontend, Railway for backend)
3. Follow production setup instructions
4. Monitor health at `/api/health` endpoint

### 🏫 **Student Researcher**
1. Read: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. Run application locally
3. Use for:
   - 📋 **Weekly Horizon:** Set research goals
   - 🔬 **Sprint Board:** Track lab work and coursework
   - 📚 **Knowledge Vault:** Log learning notes
   - 📄 **PDF Export:** Backup weekly research progress

---

## 🗂️ File Structure Overview

```
System_Architect/
│
├── 📋 DOCUMENTATION
│   ├── README.md                 ← Main project documentation
│   ├── PROJECT_SUMMARY.md        ← Quick overview & status
│   ├── ARCHITECTURE.md           ← Technical deep dive
│   ├── DEPLOYMENT.md             ← Setup & deployment guide
│   ├── DEVELOPMENT.md            ← Development best practices
│   └── INDEX.md                  ← You are here
│
├── 🚀 QUICK START
│   ├── QUICKSTART.bat            ← Windows setup (run this)
│   └── QUICKSTART.sh             ← macOS/Linux setup (run this)
│
├── 🔙 BACKEND (Express.js)
│   └── server/
│       ├── index.js              ← Server logic (Port 5000)
│       ├── data.json             ← Local database
│       └── package.json
│
├── 🎨 FRONTEND (React + Vite)
│   └── client/
│       ├── src/
│       │   ├── components/       ← Navbar, Sidebar
│       │   ├── pages/            ← Dashboard, Goals, Tasks, etc.
│       │   ├── hooks/            ← useApp, usePDFExport
│       │   ├── context/          ← AppContext (state management)
│       │   ├── App.jsx           ← Main app component
│       │   └── main.jsx          ← Entry point
│       ├── index.html
│       ├── vite.config.js
│       ├── tailwind.config.js
│       └── package.json
│
└── 📁 CONFIG
    └── .gitignore

```

---

## 🔄 How It Works (Quick Version)

### Architecture Flow
```
User Browser
    ↓
React App (Vite)
    ↓
HTTP Proxy (to localhost:5000)
    ↓
Express Backend
    ↓
data.json (Local File)
```

### Data Sync Example
```
1. User adds goal in Weekly Horizon
2. Frontend calls POST /api/weekly-goals
3. Backend updates data.json
4. Backend responds with success
5. Frontend updates UI
6. Data persists on disk
```

### PDF Export Flow
```
1. User clicks "Generate Weekly PDF"
2. Frontend requests snapshot via POST /api/snapshot
3. Backend returns all current data
4. jsPDF library generates PDF
5. PDF downloads to user's computer
```

---

## 📊 Core Features

| Feature | Location | Purpose |
|---------|----------|---------|
| **Dashboard** | `/` | Overview and quick access |
| **Weekly Horizon** | `/weekly-horizon` | Strategic goal setting |
| **Sprint Board** | `/sprint-board` | Task management (3 categories) |
| **Knowledge Vault** | `/knowledge-vault` | Learning & note capture |
| **System Toolkit** | `/system-toolkit` | Tool links & documentation |

---

## 🔌 API Quick Reference

```bash
# Health check
curl http://localhost:5000/api/health

# Get all data
curl http://localhost:5000/api/data

# Update goals
curl -X POST http://localhost:5000/api/weekly-goals \
  -H "Content-Type: application/json" \
  -d '{"goals": ["Goal 1", "Goal 2"]}'

# Add note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Note", "content": "Content"}'

# Delete note
curl -X DELETE http://localhost:5000/api/notes/1234567890
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for full API documentation.

---

## 🚀 Quick Commands

### First Time Setup
```bash
# Windows
QUICKSTART.bat

# macOS/Linux
chmod +x QUICKSTART.sh && ./QUICKSTART.sh
```

### Manual Setup
```bash
# Backend
cd server && npm install && npm run dev

# Frontend (in new terminal)
cd client && npm install && npm run dev
```

### Build for Production
```bash
cd client
npm run build
# Output: dist/ folder
```

### Preview Production Build
```bash
cd client
npm run preview
```

---

## 🎨 Customization Quick Links

| Element | File | How To |
|---------|------|-------|
| **Colors** | `client/tailwind.config.js` | Update zhust color scheme |
| **Navigation** | `client/src/components/Sidebar.jsx` | Add/remove menu items |
| **API Endpoints** | `server/index.js` | Add new routes |
| **Data Fields** | `server/data.json` | Add new properties |
| **Pages** | `client/src/pages/` | Create new page components |

---

## 🐛 Troubleshooting Quick Links

### "Backend won't start"
→ See [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting → Port Already in Use

### "CORS errors"
→ See [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting → CORS Errors

### "Data not persisting"
→ See [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting → Data Not Persisting

### "Can't add new feature"
→ See [DEVELOPMENT.md](DEVELOPMENT.md) → Adding New Features

### "Want to deploy to cloud"
→ See [DEPLOYMENT.md](DEPLOYMENT.md) → Deployment Options

---

## 📚 Documentation by Task

### ✅ I want to...

**...run the app locally**
- [QUICKSTART.bat](QUICKSTART.bat) or [QUICKSTART.sh](QUICKSTART.sh)
- Then [README.md](README.md)

**...understand how it works**
- [README.md](README.md) → Overview
- [ARCHITECTURE.md](ARCHITECTURE.md) → Deep dive

**...add a new feature**
- [DEVELOPMENT.md](DEVELOPMENT.md) → Adding New Features section

**...fix an error**
- [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting section

**...deploy to production**
- [DEPLOYMENT.md](DEPLOYMENT.md) → Deployment Options

**...develop locally with hot reload**
- [README.md](README.md) → Installation & Setup
- [DEVELOPMENT.md](DEVELOPMENT.md) → Development Guidelines

**...backup my data**
- [DEPLOYMENT.md](DEPLOYMENT.md) → Backup & Recovery
- Or use Dashboard → "Generate Weekly PDF"

**...customize colors/theme**
- [DEVELOPMENT.md](DEVELOPMENT.md) → Adding Styling

**...understand the API**
- [ARCHITECTURE.md](ARCHITECTURE.md) → API Contract

**...scale to multiple users**
- [ARCHITECTURE.md](ARCHITECTURE.md) → Future Enhancements

---

## 📞 Getting Help

1. **Read the relevant doc** from the navigation above
2. **Check your specific role** section (End User / Developer / DevOps)
3. **Use Ctrl+F** to search within documents
4. **Review code comments** in source files
5. **Check examples** in inline code

---

## 🎯 Common Questions

**Q: Where is my data stored?**
A: In `server/data.json` — completely local, never goes to the cloud.

**Q: Can multiple people use this?**
A: Currently designed for single user. Multi-user requires authentication (see Future Enhancements).

**Q: Can I run without port 5000?**
A: Yes, change PORT in `server/index.js` and update frontend proxy in `client/vite.config.js`.

**Q: How do I backup my data?**
A: Click "Generate Weekly PDF" or copy `server/data.json` manually.

**Q: Is this production-ready?**
A: Yes for single-user. See [DEPLOYMENT.md](DEPLOYMENT.md) for production hardening.

**Q: Can I modify the design?**
A: Yes! See [DEVELOPMENT.md](DEVELOPMENT.md) for styling guidelines.

**Q: How do I add a new page/section?**
A: See [DEVELOPMENT.md](DEVELOPMENT.md) → Adding a New Page.

---

## 🔐 Important Notes

✅ **Secure:** All data stored locally  
✅ **Private:** No cloud transmission  
✅ **Fast:** Instant data synchronization  
⚠️ **Single User:** No authentication by default  
⚠️ **Local Only:** Backend not accessible from other machines by default  

For production use, see security checklist in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | ✅ Ready | Express server with all endpoints |
| Frontend | ✅ Ready | React app with all pages |
| Data Layer | ✅ Ready | JSON persistence |
| PDF Export | ✅ Ready | jsPDF integration working |
| Documentation | ✅ Complete | 5 comprehensive guides |
| **Overall** | **✅ PRODUCTION READY** | Ready for immediate use |

---

## 🎉 You're All Set!

Ready to get started?

1. **→ [Run QUICKSTART.bat / QUICKSTART.sh](.)** to set up
2. **→ Open [http://localhost:5173](http://localhost:5173)** in your browser
3. **→ Start adding goals in Weekly Horizon!**

For more details, explore the documentation files linked above.

---

**Last Updated:** May 13, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

## Document Map

```
START HERE
    ↓
Choose Your Role:
├─→ End User → README.md
├─→ Developer → ARCHITECTURE.md + DEVELOPMENT.md
└─→ DevOps → DEPLOYMENT.md

Then Reference:
├─→ Questions about features → README.md
├─→ Questions about code → ARCHITECTURE.md
├─→ Questions about setup → DEPLOYMENT.md
└─→ Questions about development → DEVELOPMENT.md

Quick Status:
└─→ PROJECT_SUMMARY.md
```

Enjoy! 🚀
