import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PinLock from './components/PinLock';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import WeeklyHorizon from './pages/WeeklyHorizon';
import SprintBoard from './pages/SprintBoard';
import KnowledgeVault from './pages/KnowledgeVault';
import SystemToolkit from './pages/SystemToolkit';
import PromptCollection from './pages/PromptCollection';
import LifeOS from './pages/LifeOS';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');

  return (
    <PinLock>
      <BrowserRouter>
        <div className="app-shell flex h-screen bg-zhust-dark text-white" data-theme={themeMode}>
          <Sidebar isOpen={sidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              themeMode={themeMode}
              onThemeChange={setThemeMode}
            />
            <TopBar />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/weekly-horizon" element={<WeeklyHorizon />} />
                <Route path="/sprint-board" element={<SprintBoard />} />
                <Route path="/knowledge-vault" element={<KnowledgeVault />} />
                <Route path="/system-toolkit" element={<SystemToolkit />} />
                <Route path="/prompt-collection" element={<PromptCollection />} />
                <Route path="/life-os" element={<LifeOS />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </PinLock>
  );
}

export default App;
