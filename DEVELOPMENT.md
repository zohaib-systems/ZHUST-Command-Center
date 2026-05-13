# 🔧 Development Guidelines

## Code Style

### JavaScript/React Standards
- Use ES6+ syntax (arrow functions, destructuring, const/let)
- Functional components with hooks (no class components)
- Descriptive variable and function names
- Comment complex logic
- 2-space indentation

### File Naming
- Components: `PascalCase` (e.g., `WeeklyHorizon.jsx`)
- Utilities/hooks: `camelCase` (e.g., `useApp.js`)
- Pages: `PascalCase` in pages/ directory (e.g., `Dashboard.jsx`)
- CSS modules: same as component name (e.g., `Dashboard.module.css`)

### Folder Structure
```
client/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── hooks/         # Custom React hooks
│   ├── context/       # Context providers
│   ├── utils/         # Utility functions (add as needed)
│   ├── App.jsx        # Root component
│   └── main.jsx       # Entry point
└── public/            # Static assets
```

---

## Adding New Features

### Adding a New Page

1. Create component in `src/pages/`:
```jsx
// src/pages/NewPage.jsx
import { useApp } from '../hooks/useApp';

export default function NewPage() {
  const { data } = useApp();
  
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-zhust-accent">Page Title</h1>
      {/* Content */}
    </div>
  );
}
```

2. Add route in `App.jsx`:
```jsx
import NewPage from './pages/NewPage';

// Inside <Routes>
<Route path="/new-page" element={<NewPage />} />
```

3. Add menu item in `Sidebar.jsx`:
```jsx
{ name: '📌 New Page', path: '/new-page' },
```

### Adding a New API Endpoint

1. Add route in `server/index.js`:
```javascript
app.post('/api/new-endpoint', (req, res) => {
  const data = readData();
  if (data) {
    // Update data
    data.newField = req.body.value;
    if (writeData(data)) {
      res.json({ success: true, data: data.newField });
    } else {
      res.status(500).json({ error: 'Failed to update' });
    }
  }
});
```

2. Add method in `AppContext.jsx`:
```javascript
const updateNewField = async (value) => {
  try {
    const response = await axios.post(`${API_BASE}/new-endpoint`, { value });
    setData(prev => ({ ...prev, newField: response.data.data }));
    return true;
  } catch (err) {
    console.error('Failed to update:', err);
    return false;
  }
};
```

3. Export new method:
```javascript
<AppContext.Provider value={{ ..., updateNewField }}>
```

### Adding Styling

Use Tailwind classes first. For custom styles:
1. Add to `src/index.css` if global
2. Create `.module.css` for component-specific styles
3. Update `tailwind.config.js` for new colors/themes

---

## Testing Locally

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Get all data
curl http://localhost:5000/api/data

# Create goal
curl -X POST http://localhost:5000/api/weekly-goals \
  -H "Content-Type: application/json" \
  -d '{"goals": ["Test Goal"]}'
```

### Test Frontend
1. Open `http://localhost:5173` in browser
2. Open DevTools (F12)
3. Navigate through pages
4. Check Console for errors
5. Verify data persists in Network tab

### Test PDF Export
1. Add some goals and tasks
2. Click "Generate Weekly PDF" on Dashboard
3. Verify PDF downloads and contains correct data

---

## Debugging

### Frontend Debugging
```javascript
// Add in any component
import { useApp } from '../hooks/useApp';
const { data } = useApp();

// Log to browser console
useEffect(() => {
  console.log('Current data:', data);
}, [data]);
```

### Backend Debugging
```javascript
// Add console logs in server/index.js
app.post('/api/endpoint', (req, res) => {
  console.log('Request body:', req.body);
  const data = readData();
  console.log('Current data:', data);
  // ... rest of logic
});

// Check logs in terminal where you ran `npm run dev`
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make an action in the app
4. Click on the request
5. Check request/response details

---

## Common Tasks

### Modify Data Structure
1. Edit `server/data.json` schema
2. Update `AppContext.jsx` with new field handling
3. Update components to use new field
4. Test full flow

### Change Colors
```javascript
// tailwind.config.js
colors: {
  zhust: {
    primary: '#new-color',
    // ...
  }
}
```

### Add Environment Variables
1. Create `.env` file in `server/` or `client/`
2. Reference with `process.env.VAR_NAME` (backend) or `import.meta.env.VITE_VAR_NAME` (frontend)
3. Never commit `.env` files

### Performance Optimization
```javascript
// Use useMemo for expensive calculations
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return data.items.filter(...).map(...);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

---

## Troubleshooting

### "Cannot find module" Error
- Run `npm install` in the appropriate directory
- Check that all imports have correct paths
- Verify file extensions (.js, .jsx, .json)

### State Not Updating
- Ensure you're awaiting async functions: `await updateGoals(...)`
- Check browser DevTools → check if API call was successful
- Verify backend is running and accessible

### Styling Not Applied
- Clear Vite cache: delete `.vite` folder
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check class names match Tailwind config
- Verify CSS is imported in `main.jsx`

### CORS Errors
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy settings
- Verify API base URL in `AppContext.jsx`

---

## Git Workflow

### Before Committing
```bash
# Check status
git status

# Stage changes
git add .

# Create meaningful commit
git commit -m "feat: add weekly goals feature"

# Push to remote
git push origin main
```

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests

---

## Resources

- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Express.js:** https://expressjs.com
- **Vite:** https://vitejs.dev
- **jsPDF:** https://github.com/parallax/jspdf

---

## Performance Checklist

- [ ] Components use React.memo for large lists
- [ ] useCallback for event handlers passed to children
- [ ] useMemo for expensive calculations
- [ ] Remove console.logs before production
- [ ] Lazy load images with loading="lazy"
- [ ] Code splitting via React Router
- [ ] Minify CSS (Tailwind does this)
- [ ] No large bundle sizes (check with `npm run build`)

---

## Security Checklist

- [ ] Validate all user inputs
- [ ] No sensitive data in comments
- [ ] No hardcoded API keys or secrets
- [ ] HTTPS in production
- [ ] Sanitize user-generated content before display
- [ ] Regular dependency updates
- [ ] No SQL injection risks (currently using JSON)
- [ ] No XSS vulnerabilities (React escapes by default)

---

**Last Updated:** May 13, 2026
