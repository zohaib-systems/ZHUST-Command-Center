import zhustLogo from '../assets/zhust-logo.png';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="bg-zhust-primary border-b border-zhust-secondary px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="px-3 py-2 rounded-lg hover:bg-zhust-secondary transition-colors"
        >
          ☰
        </button>
        <div className="flex items-center gap-3">
          <img
            src={zhustLogo}
            alt="ZHUST logo"
            className="h-10 w-10 rounded-xl border border-zhust-secondary bg-black/20 shadow-lg"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Command Center</p>
            <h2 className="text-2xl font-bold text-zhust-accent">ZHUST</h2>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </nav>
  );
}
