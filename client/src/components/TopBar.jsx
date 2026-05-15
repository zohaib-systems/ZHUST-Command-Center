import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../hooks/useApp';

export default function TopBar() {
  const { data } = useApp();
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const personalOS = data?.personal_os || {};
  const finances = personalOS.finances || {};
  const entries = Array.isArray(finances.entries) ? finances.entries : [];

  const wealthLevel = useMemo(() => {
    const totals = entries.reduce((accumulator, entry) => {
      const amount = Number(entry.amount || 0);

      if (entry.type === 'income' || entry.type === 'passive') {
        accumulator.income += amount;
      } else if (entry.type === 'expense') {
        accumulator.expenses += amount;
      } else if (entry.type === 'asset') {
        accumulator.assets += amount;
      } else if (entry.type === 'debt') {
        accumulator.debts += amount;
      }

      return accumulator;
    }, { income: 0, expenses: 0, assets: 0, debts: 0 });

    const passiveIncome = entries
      .filter((entry) => entry.type === 'passive')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    const netWorth = totals.assets + totals.income - totals.expenses - totals.debts;

    if (totals.income <= 0 || totals.income < totals.expenses) {
      return { level: 0, label: 'Financial Struggle', netWorth };
    }

    if (totals.income === totals.expenses) {
      return { level: 1, label: 'Financial Stability', netWorth };
    }

    if (netWorth >= 50000000) {
      return { level: 4, label: 'Business Tycoon', netWorth };
    }

    if (totals.income >= totals.expenses * 2 && passiveIncome >= totals.expenses && netWorth >= 1000000) {
      return { level: 3, label: 'Financial Freedom', netWorth };
    }

    return { level: 2, label: 'Financial Growth', netWorth };
  }, [entries]);

  const nextDeadline = useMemo(() => {
    const deadlines = Array.isArray(personalOS.deadlines) ? personalOS.deadlines : [];
    const upcoming = deadlines
      .filter((deadline) => new Date(deadline.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    if (!upcoming) {
      return { name: '—', timer: '' };
    }

    const diff = new Date(upcoming.date).getTime() - tick;
    if (diff <= 0) {
      return { name: upcoming.name, timer: 'Expired' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { name: upcoming.name, timer: `${days}d ${hours}h ${minutes}m ${seconds}s` };
  }, [personalOS.deadlines, tick]);

  return (
    <div className="border-b border-zhust-secondary/30 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-6 py-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-400">Net Worth</div>
          <div className="mt-1 text-2xl font-bold text-zhust-accent">PKR {wealthLevel.netWorth.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-400">Next Deadline</div>
          <div className="mt-1 text-lg font-semibold text-white">{nextDeadline.name}</div>
          <div className="text-sm text-gray-300">{nextDeadline.timer}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
          <div className="text-xs uppercase tracking-[0.25em] text-gray-400">Wealth Level</div>
          <div className="mt-1 text-2xl font-bold text-zhust-accent">L{wealthLevel.level}</div>
          <div className="text-sm text-gray-300">{wealthLevel.label}</div>
        </div>
      </div>
    </div>
  );
}
