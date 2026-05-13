# 🚀 Getting Started with ZHUST Command Center

**Your complete guide to launching the application for the first time**

---

## ⏱️ Time Required
- **5 minutes** to get running (with QUICKSTART)
- **15 minutes** for full manual setup
- **2 minutes** to start using

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js 16+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (included with Node.js)
- [ ] **Git** (optional, for version control)
- [ ] **A modern web browser** (Chrome, Firefox, Safari, Edge)
- [ ] **Terminal/Command Prompt** access
- [ ] **~500MB** of free disk space

**Verify you have Node.js:**
```bash
node --version    # Should be v16.0.0 or higher
npm --version     # Should be v7.0.0 or higher
```

---

## 🟢 Option 1: Quick Start (Recommended - 5 minutes)

### Windows Users
1. Navigate to the project folder
2. **Double-click** `QUICKSTART.bat`
3. Follow the on-screen instructions
4. When prompted, **open two terminal windows** as shown

### macOS/Linux Users
1. Navigate to the project folder
2. Open Terminal
3. Run these commands:
```bash
chmod +x QUICKSTART.sh
./QUICKSTART.sh
```
4. Follow the on-screen instructions

### What QUICKSTART Does
- ✅ Verifies Node.js is installed
- ✅ Installs backend dependencies
- ✅ Installs frontend dependencies
- ✅ Prepares your system
- ✅ Provides next steps

---

## 🔵 Option 2: Manual Setup (15 minutes)

### Step 1: Start Backend

Open **Terminal/Command Prompt** and run:

```bash
cd server
npm install
npm run dev
```

**Expected Output:**
```
> node --watch index.js
🚀 ZHUST Command Center Backend running on http://localhost:5000
📁 Data file: /path/to/server/data.json
```

✅ **Backend is now running** on http://localhost:5000

---

### Step 2: Start Frontend (New Terminal Window)

Open **another Terminal/Command Prompt** and run:

```bash
cd client
npm install
npm run dev
```

**Expected Output:**
```
  VITE v8.0.12  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is now running** on http://localhost:5173

---

### Step 3: Access the Application

**Open your browser and go to:**
```
http://localhost:5173
```

You should see the ZHUST Command Center dashboard loading!

---

## 🎯 First Steps in the App

Once the dashboard loads, try these:

### 1. **Explore the Dashboard** (Home Page)
- View system KPIs
- See quick access links
- Check system status
- Familiarize yourself with the layout

### 2. **Create Your First Goal** (Weekly Horizon)
- Click **"Weekly Horizon"** in sidebar
- Type a strategic goal (e.g., "Complete Microbiology lab report")
- Click **"Add Goal"**
- ✅ Your goal is now saved!

### 3. **Add Sprint Tasks** (Sprint Board)
- Click **"Sprint Board"** in sidebar
- Choose a category (Tech, Academic, or Administrative)
- Add a task (e.g., "Write introduction for research paper")
- ✅ Task is saved by category!

### 4. **Capture Notes** (Knowledge Vault)
- Click **"Knowledge Vault"** in sidebar
- Add a note title and content
- Click **"Save Note"**
- ✅ Note is captured and timestamped!

### 5. **Generate a Report** (Dashboard)
- Go back to **Dashboard**
- Click **"📄 Generate Weekly PDF"**
- PDF downloads automatically
- ✅ Your first backup is created!

---

## 🔍 Verify Everything Works

### Backend Health Check
Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2026-05-13T10:30:00.000Z"}
```

### Frontend Health Check
- Dashboard loads without errors
- Navbar and sidebar visible
- Navigation between pages works
- Data persists after refresh

---

## 🎨 First Customization

### Change Your Name/Title
Edit `server/data.json` → look for `system_toolkit` section → add your custom tools

### Add Your Own Tools
Edit `server/data.json`:
```json
"tools": [
  {
    "name": "Your Tool",
    "url": "https://your-tool.com",
    "description": "Your tool description"
  }
]
```

Refresh the browser to see your changes!

---

## 💾 Data Backup

Your data is stored in:
```
server/data.json
```

### Backup Methods

**Method 1: Manual Backup**
```bash
cp server/data.json server/data.backup.json
```

**Method 2: Use Dashboard Export**
- Click "Generate Weekly PDF" button
- PDF contains all your goals and tasks
- Download automatically creates backup

**Method 3: Git Backup** (if using version control)
```bash
git add server/data.json
git commit -m "Weekly backup"
git push
```

---

## 🐛 Troubleshooting

### "Backend won't start"

**Problem:** Error when running `npm run dev` in server folder

**Solution:**
1. Check if port 5000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```
2. Kill the process using port 5000
3. Try `npm run dev` again

### "Frontend won't connect to backend"

**Problem:** CORS errors or API not working

**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check console errors (F12 in browser)
3. Restart both services

### "Data not persisting"

**Problem:** Changes disappear after refresh

**Solution:**
1. Check if `server/data.json` has write permissions
2. Verify backend is actually saving (check console logs)
3. Check browser console for API errors (F12)

### "Port 5173 is in use"

**Problem:** Frontend won't start on default port

**Solution:**
1. Try a different terminal
2. Or edit `client/vite.config.js` and change the port

### "npm install fails"

**Problem:** Dependencies won't install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

---

## 📚 Learn More

After getting started, explore these docs:

| Document | When to Read |
|----------|-------------|
| [README.md](../README.md) | Understand all features |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Learn how it works internally |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Deploy to production |
| [DEVELOPMENT.md](../DEVELOPMENT.md) | Add your own features |

---

## 🎓 Common Use Cases

### Academic Researcher
1. **Weekly Horizon:** Set research goals
2. **Sprint Board:** Track lab work and coursework
3. **Knowledge Vault:** Log learning notes
4. **PDF Export:** Backup weekly progress

### Professional Developer
1. **Weekly Horizon:** Plan development sprints
2. **Sprint Board:** Track MERN/Next.js projects
3. **Knowledge Vault:** Capture technical notes
4. **System Toolkit:** Quick access to dev tools

### Freelancer
1. **Weekly Horizon:** Client project goals
2. **Sprint Board:** Admin tasks, deliverables
3. **Knowledge Vault:** Client requirements
4. **PDF Export:** Invoice documentation

---

## ✅ Success Checklist

- [ ] Node.js is installed
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Browser shows dashboard
- [ ] Can add goals and tasks
- [ ] Data persists after refresh
- [ ] PDF export works
- [ ] All documentation is accessible

---

## 🎉 You're Ready!

**Congratulations!** You have successfully set up the ZHUST Command Center. You're now ready to:

- ✅ Manage academic research
- ✅ Track professional development
- ✅ Organize engineering projects
- ✅ Generate automated reports
- ✅ Maintain local data backups

---

## 🚀 Next Steps

### Today
- [ ] Explore all five main sections
- [ ] Add your first week's goals
- [ ] Generate a test PDF report
- [ ] Share feedback if using with team

### This Week
- [ ] Populate with real goals and tasks
- [ ] Set up regular backup routine
- [ ] Customize system toolkit links
- [ ] Start weekly PDF exports

### This Month
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Deploy backend to Railway or Render
- [ ] Invite team members (if expanding)
- [ ] Integrate with other tools (if needed)

---

## 💬 Support

**Have a question?**

1. Check the [INDEX.md](../INDEX.md) for documentation
2. Review [DEPLOYMENT.md](../DEPLOYMENT.md) troubleshooting section
3. Check code comments in source files
4. Review inline documentation

**Something not working?**

1. Check your terminal for error messages
2. Verify all prerequisites are installed
3. Try the manual setup steps again
4. Check that both servers are running

---

## 📞 Contact & Resources

- **Node.js:** https://nodejs.org/
- **React:** https://react.dev
- **Express.js:** https://expressjs.com
- **Tailwind CSS:** https://tailwindcss.com
- **Vite:** https://vitejs.dev

---

## 🎊 Welcome to ZHUST Command Center!

You're now part of a powerful local-first system for managing academic research and professional development. Make the most of it!

**Happy building! 🚀**

---

**Last Updated:** May 13, 2026  
**Status:** ✅ Ready to use  
**Time to First Success:** ~5 minutes

---

**Quick Reference:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Dashboard: http://localhost:5173/
- Data File: `server/data.json`
- Documentation: [INDEX.md](../INDEX.md)
