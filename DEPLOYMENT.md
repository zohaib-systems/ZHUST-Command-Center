# 🚀 Deployment Guide

## Local Development Environment

### Prerequisites
- Node.js 16.x or higher
- npm (included with Node.js)
- Git (optional, for version control)

### Quick Setup (Windows)
```bash
QUICKSTART.bat
```

### Quick Setup (macOS/Linux)
```bash
chmod +x QUICKSTART.sh
./QUICKSTART.sh
```

---

## Manual Setup

### Step 1: Backend Installation
```bash
cd server
npm install
npm run dev
```
Backend will be available at `http://localhost:5000`

### Step 2: Frontend Installation (New Terminal)
```bash
cd client
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## Production Build

### Build Frontend
```bash
cd client
npm run build
```
Output: `client/dist/` directory

### Preview Production Build
```bash
cd client
npm run preview
```
Available at `http://localhost:4173`

### Deploy Frontend
The `dist/` folder can be deployed to any static hosting service:
- **Vercel** (Recommended for Next.js-like apps)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Deploy Backend
The backend can be deployed to:
- **Heroku** (Deprecated)
- **Railway**
- **Render**
- **AWS EC2**
- **DigitalOcean**

**Important:** When deploying:
1. Set `PORT` environment variable (default: 5000)
2. Ensure data persistence (use persistent storage for `data.json`)
3. Update CORS settings for production domain
4. Enable HTTPS only

---

## Docker Deployment (Optional)

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## Environment Variables

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend (client/.env)
```
VITE_API_URL=http://localhost:5000
```

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
Update `server/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // or production URL
  credentials: true
}));
```

### Data Not Persisting
- Check `server/data.json` permissions
- Ensure sufficient disk space
- Verify backend is running before making changes

---

## Monitoring & Logging

### Backend Logs
Backend logs are printed to console. For production:
```bash
npm install -g pm2
pm2 start server/index.js --name "zhust-backend"
pm2 logs zhust-backend
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## Backup & Recovery

### Backup data.json
```bash
cp server/data.json server/data.backup.json
```

### Export Weekly Report
Use the "Generate Weekly PDF" button in the dashboard to create automated backups.

---

## Performance Optimization

### Frontend
- Built-in Vite optimization
- React code splitting via routes
- CSS minification

### Backend
- Simple Express server (highly performant)
- Flat-file JSON is suitable for <1MB data
- For larger datasets, consider SQLite or PostgreSQL

---

## Security Checklist

- [ ] Change default port if needed
- [ ] Implement authentication for production
- [ ] Use HTTPS/TLS in production
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Regular data backups
- [ ] Monitor file permissions
- [ ] Disable debug mode in production

---

**Last Updated:** May 13, 2026
