import { useApp } from '../hooks/useApp';
import { usePDFExport } from '../hooks/usePDFExport';
import { Link } from 'react-router-dom';

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
  const personalOS = data?.personal_os || {};
  const plan = personalOS.plan || {};
  const finances = personalOS.finances || {};
  const financeEntries = Array.isArray(finances.entries) ? finances.entries : [];
  const netWorth = financeEntries.reduce((totals, entry) => {
    const amount = Number(entry.amount || 0);
    if (entry.type === 'income' || entry.type === 'passive') {
      totals.income += amount;
    } else if (entry.type === 'expense') {
      totals.expenses += amount;
    } else if (entry.type === 'asset') {
      totals.assets += amount;
    } else if (entry.type === 'debt') {
      totals.debts += amount;
    }
    return totals;
  }, { income: 0, expenses: 0, assets: 0, debts: 0 });
  const computedNetWorth = netWorth.assets + netWorth.income - netWorth.expenses - netWorth.debts;

  const nextDeadline = [...(personalOS.deadlines || [])]
    .filter((deadline) => new Date(deadline.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const wealthLevel = (() => {
    const passiveIncome = financeEntries
      .filter((entry) => entry.type === 'passive')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    if (netWorth.income <= 0 || netWorth.income < netWorth.expenses) {
      return { level: 0, label: 'Financial Struggle' };
    }

    if (netWorth.income === netWorth.expenses) {
      return { level: 1, label: 'Financial Stability' };
    }

    if (computedNetWorth >= 50000000) {
      return { level: 4, label: 'Business Tycoon' };
    }

    if (netWorth.income >= netWorth.expenses * 2 && passiveIncome >= netWorth.expenses && computedNetWorth >= 1000000) {
      return { level: 3, label: 'Financial Freedom' };
    }

    return { level: 2, label: 'Financial Growth' };
  })();

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="frosted-card rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500">One Page Plan</div>
          <div className="mt-3 space-y-3 text-sm text-gray-300">
            <div>
              <div className="text-zhust-accent font-semibold">Long-term</div>
              <div>{plan.long?.text || 'No long-term goal set'}</div>
            </div>
            <div>
              <div className="text-zhust-accent font-semibold">Mid-term</div>
              <div>{plan.mid?.text || 'No mid-term goal set'}</div>
            </div>
            <div>
              <div className="text-zhust-accent font-semibold">Short-term</div>
              <div>{plan.short?.text || 'No short-term goal set'}</div>
            </div>
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Wealth Level</div>
          <div className="mt-3 text-4xl font-bold text-zhust-accent">L{wealthLevel.level}</div>
          <div className="mt-2 text-lg text-white">{wealthLevel.label}</div>
          <div className="mt-4 text-sm text-gray-300">PKR {computedNetWorth.toLocaleString()} net worth</div>
        </div>

        <div className="frosted-card rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Next Deadline</div>
          <div className="mt-3 text-2xl font-bold text-white">{nextDeadline?.name || 'No deadline set'}</div>
          <div className="mt-2 text-sm text-gray-300">{nextDeadline?.date || 'Add one in Life OS'}</div>
        </div>
      </div>

      <div className="frosted-card rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-zhust-accent">Life OS is available inside ZHUST</h2>
          <p className="text-sm text-gray-400">Open the detailed module page for finances, habits, skills, and live deadlines.</p>
        </div>
        <Link
          to="/life-os"
          className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Open Life OS
        </Link>
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
