import { useApp } from '../hooks/useApp';
import { usePDFExport } from '../hooks/usePDFExport';

export default function Dashboard() {
  const { data, loading } = useApp();
  const { exportToPDF } = usePDFExport();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zhust-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  const weeklyGoals = data?.weekly_goals;
  const goalsCount = Array.isArray(weeklyGoals)
    ? weeklyGoals.length
    : (weeklyGoals?.daily_tasks?.length || 0) + (weeklyGoals?.other_tasks?.length || 0);
  const tasksCount = (data?.sprint_board?.tech?.length || 0) +
    (data?.sprint_board?.academic?.length || 0) +
    (data?.sprint_board?.administrative?.length || 0);
  const notesCount = data?.captured_notes?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-zhust-accent mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your Systems Architect Command Center</p>
        </div>
        <button
          onClick={exportToPDF}
          className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          📄 Generate Weekly PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="frosted-card rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Weekly Goals</div>
          <div className="text-3xl font-bold text-zhust-accent">{goalsCount}</div>
        </div>
        <div className="frosted-card rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Sprint Tasks</div>
          <div className="text-3xl font-bold text-zhust-accent">{tasksCount}</div>
        </div>
        <div className="frosted-card rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Captured Notes</div>
          <div className="text-3xl font-bold text-zhust-accent">{notesCount}</div>
        </div>
        <div className="frosted-card rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">System Health</div>
          <div className="text-3xl font-bold text-green-400">✓ Online</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Goals */}
        <div className="frosted-card rounded-lg p-6">
          <h2 className="text-xl font-bold text-zhust-accent mb-4">📋 Latest Goals</h2>
          {goalsCount === 0 ? (
            <p className="text-gray-400">No goals defined yet</p>
          ) : (
            <ul className="space-y-2">
              {(() => {
                const normalized = Array.isArray(weeklyGoals)
                  ? { daily_tasks: [], other_tasks: weeklyGoals }
                  : { daily_tasks: weeklyGoals?.daily_tasks || [], other_tasks: weeklyGoals?.other_tasks || [] };
                const items = [
                  ...normalized.daily_tasks.map((goal) => ({
                    goal: typeof goal === 'string' ? goal : goal?.text || '',
                    label: 'Daily'
                  })),
                  ...normalized.other_tasks.map((goal) => ({ goal, label: 'Planned' })),
                ];

                return items.slice(-3).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300">
                    • {item.goal} <span className="text-xs text-gray-500">({item.label})</span>
                  </li>
                ));
              })()}
            </ul>
          )}
        </div>

        {/* Recent Notes */}
        <div className="frosted-card rounded-lg p-6">
          <h2 className="text-xl font-bold text-zhust-accent mb-4">📝 Recent Notes</h2>
          {notesCount === 0 ? (
            <p className="text-gray-400">No notes captured yet</p>
          ) : (
            <ul className="space-y-2">
              {data.captured_notes.slice(-3).map((note) => (
                <li key={note.id} className="text-sm text-gray-300">
                  • {note.title || 'Untitled'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="frosted-card rounded-lg p-6">
        <h2 className="text-xl font-bold text-zhust-accent mb-4">⚡ Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.system_toolkit?.tools?.map((tool, idx) => (
            <a
              key={idx}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-zhust-secondary hover:bg-blue-700 rounded-lg transition-colors text-center"
            >
              <div className="font-semibold text-sm">{tool.name}</div>
              <div className="text-xs text-gray-300 mt-1">{tool.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
