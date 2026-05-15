import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Rocket,
  Library,
  Wrench,
  MessageSquarePlus,
  Sparkles,
} from 'lucide-react';
import zhustLogo from '../assets/zhust-logo.png';

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Target, label: 'Weekly Horizon', path: '/weekly-horizon' },
    { icon: Rocket, label: 'Sprint Board', path: '/sprint-board' },
    { icon: Library, label: 'Knowledge Vault', path: '/knowledge-vault' },
    { icon: Wrench, label: 'System Toolkit', path: '/system-toolkit' },
    { icon: MessageSquarePlus, label: 'Prompt Collection', path: '/prompt-collection' },
    { icon: Sparkles, label: 'Life OS', path: '/life-os' },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-[rgba(0,0,51,0.7)] border-r border-[rgba(255,191,0,0.1)] backdrop-blur-xl transition-all duration-300 overflow-hidden`}
    >
      <div className={`p-6 border-b border-zhust-secondary ${isOpen ? 'flex items-center gap-3' : 'flex items-center justify-center'}`}>
        <img
          src={zhustLogo}
          alt="ZHUST logo"
          className="h-8 w-8 rounded-lg border border-zhust-secondary bg-black/20 shadow-lg"
        />
        <div className={isOpen ? '' : 'hidden'}>
          <p className="text-sm font-semibold text-zhust-accent">ZHUST</p>
          <p className="text-xs text-gray-400">Command Center</p>
        </div>
      </div>
      <nav className={`p-4 ${isOpen ? '' : 'flex flex-col items-center gap-3'}`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              `transition-colors relative ${
                isOpen
                  ? 'mb-2 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-zhust-secondary justify-start'
                  : 'flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/60 hover:border-zhust-accent hover:bg-gray-900/80'
              } ${isActive ? 'sidebar-active' : ''}`
            }
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <>
                  <Icon
                    size={isOpen ? 18 : 22}
                    className={`sidebar-icon ${isActive ? 'sidebar-icon-active' : ''}`}
                  />
                  <span className={isOpen ? 'text-sm font-medium' : 'hidden'}>{item.label}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
