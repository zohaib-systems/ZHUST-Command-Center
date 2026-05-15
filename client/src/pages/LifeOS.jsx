import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../hooks/useApp';

const defaultPersonalOS = {
  plan: {
    long: { text: '', date: '', purpose: '' },
    mid: { text: '', date: '', purpose: '' },
    short: { text: '', date: '', purpose: '' },
  },
  finances: {
    income: 0,
    expenses: 0,
    assets: 0,
    debts: 0,
    entries: [],
  },
  habits: [],
  skills: [],
  deadlines: [],
};

const habitStages = [21, 90, 365];

const createHabitStageLabel = (habit) => {
  if (habit.stage === 'completed') {
    return 'Completed';
  }

  return `${habit.stage}-day`; 
};

export default function LifeOS() {
  const { data, savePersonalOS } = useApp();
  const [personalOS, setPersonalOS] = useState(defaultPersonalOS);
  const [planForm, setPlanForm] = useState(defaultPersonalOS.plan);
  const [financeForm, setFinanceForm] = useState({ income: '', expenses: '', assets: '', debts: '' });
  const [ledgerForm, setLedgerForm] = useState({ type: 'income', name: '', amount: '', category: '' });
  const [habitForm, setHabitForm] = useState({ name: '', focus: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'technical' });
  const [deadlineForm, setDeadlineForm] = useState({ name: '', date: '' });
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    setPersonalOS(data?.personal_os ? {
      plan: data.personal_os.plan || defaultPersonalOS.plan,
      finances: {
        income: Number(data.personal_os.finances?.income || 0),
        expenses: Number(data.personal_os.finances?.expenses || 0),
        assets: Number(data.personal_os.finances?.assets || 0),
        debts: Number(data.personal_os.finances?.debts || 0),
        entries: Array.isArray(data.personal_os.finances?.entries) ? data.personal_os.finances.entries : [],
      },
      habits: Array.isArray(data.personal_os.habits) ? data.personal_os.habits : [],
      skills: Array.isArray(data.personal_os.skills) ? data.personal_os.skills : [],
      deadlines: Array.isArray(data.personal_os.deadlines) ? data.personal_os.deadlines : [],
    } : defaultPersonalOS);
    setPlanForm(data?.personal_os?.plan || defaultPersonalOS.plan);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const syncPersonalOS = async (nextPersonalOS) => {
    setPersonalOS(nextPersonalOS);
    await savePersonalOS(nextPersonalOS);
  };

  const handlePlanFieldChange = (segment, field, value) => {
    setPlanForm((prev) => ({
      ...prev,
      [segment]: {
        ...prev[segment],
        [field]: value,
      },
    }));
  };

  const handleSavePlan = async () => {
    await syncPersonalOS({
      ...personalOS,
      plan: planForm,
    });
  };

  const updateFinanceField = (field, value) => {
    setFinanceForm((prev) => ({ ...prev, [field]: value }));
  };

  const financeTotals = useMemo(() => {
    const entries = personalOS.finances.entries || [];
    return entries.reduce((totals, entry) => {
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
  }, [personalOS.finances.entries]);

  const wealthLevel = useMemo(() => {
    const { income, expenses, assets, debts } = financeTotals;
    const passiveIncome = (personalOS.finances.entries || [])
      .filter((entry) => entry.type === 'passive')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const netWorthValue = assets + income - expenses - debts;

    if (income <= 0 || income < expenses) {
      return {
        level: 0,
        label: 'Financial Struggle',
        description: 'Income is below expenses or not yet started.',
        goal: 'Balance income against expenses first.',
        netWorthValue,
      };
    }

    if (income === expenses) {
      return {
        level: 1,
        label: 'Financial Stability',
        description: 'Income equals expenses. No surplus yet.',
        goal: 'Build a surplus and start saving.',
        netWorthValue,
      };
    }

    if (netWorthValue >= 50000000) {
      return {
        level: 4,
        label: 'Business Tycoon',
        description: 'Wealth has reached a large-scale impact level.',
        goal: 'Use capital to build lasting influence.',
        netWorthValue,
      };
    }

    if (income >= expenses * 2 && passiveIncome >= expenses && netWorthValue >= 1000000) {
      return {
        level: 3,
        label: 'Financial Freedom',
        description: 'Passive income and net worth can carry the lifestyle.',
        goal: 'Protect and compound this position.',
        netWorthValue,
      };
    }

    return {
      level: 2,
      label: 'Financial Growth',
      description: 'Income is ahead of expenses and savings are possible.',
      goal: 'Turn surplus into assets and passive income.',
      netWorthValue,
    };
  }, [financeTotals, personalOS.finances.entries]);

  const handleAddLedgerEntry = async () => {
    if (!ledgerForm.name.trim() || !ledgerForm.amount) {
      return;
    }

    const nextEntry = {
      id: Date.now(),
      type: ledgerForm.type,
      name: ledgerForm.name.trim(),
      amount: Number(ledgerForm.amount),
      category: ledgerForm.category.trim(),
      created_at: new Date().toISOString(),
    };

    await syncPersonalOS({
      ...personalOS,
      finances: {
        ...personalOS.finances,
        entries: [...(personalOS.finances.entries || []), nextEntry],
      },
    });

    setLedgerForm({ type: 'income', name: '', amount: '', category: '' });
  };

  const removeLedgerEntry = async (entryId) => {
    await syncPersonalOS({
      ...personalOS,
      finances: {
        ...personalOS.finances,
        entries: (personalOS.finances.entries || []).filter((entry) => entry.id !== entryId),
      },
    });
  };

  const handleAddHabit = async () => {
    if (!habitForm.name.trim()) {
      return;
    }

    const nextHabit = {
      id: Date.now(),
      name: habitForm.name.trim(),
      focus: habitForm.focus.trim(),
      stage: 21,
      progress: 0,
      lastChecked: null,
    };

    await syncPersonalOS({
      ...personalOS,
      habits: [...personalOS.habits, nextHabit],
    });

    setHabitForm({ name: '', focus: '' });
  };

  const handleHabitCheckIn = async (habitId, isDone) => {
    const updatedHabits = personalOS.habits.map((habit) => {
      if (habit.id !== habitId) {
        return habit;
      }

      const today = new Date().toDateString();
      const nextHabit = { ...habit, lastChecked: today };

      if (isDone) {
        nextHabit.progress += 1;
        if (nextHabit.progress >= nextHabit.stage) {
          if (nextHabit.stage === habitStages[0]) {
            nextHabit.stage = habitStages[1];
          } else if (nextHabit.stage === habitStages[1]) {
            nextHabit.stage = habitStages[2];
          } else {
            nextHabit.stage = 'completed';
          }
          nextHabit.progress = 0;
        }
      }

      return nextHabit;
    });

    await syncPersonalOS({
      ...personalOS,
      habits: updatedHabits,
    });
  };

  const removeHabit = async (habitId) => {
    await syncPersonalOS({
      ...personalOS,
      habits: personalOS.habits.filter((habit) => habit.id !== habitId),
    });
  };

  const handleAddSkill = async () => {
    if (!skillForm.name.trim()) {
      return;
    }

    const nextSkill = {
      id: Date.now(),
      name: skillForm.name.trim(),
      category: skillForm.category,
      progress: 0,
      notes: [],
    };

    await syncPersonalOS({
      ...personalOS,
      skills: [...personalOS.skills, nextSkill],
    });

    setSkillForm({ name: '', category: 'technical' });
  };

  const bumpSkill = async (skillId, delta) => {
    const updatedSkills = personalOS.skills.map((skill) => (
      skill.id === skillId
        ? { ...skill, progress: Math.max(0, Math.min(100, skill.progress + delta)) }
        : skill
    ));

    await syncPersonalOS({
      ...personalOS,
      skills: updatedSkills,
    });
  };

  const removeSkill = async (skillId) => {
    await syncPersonalOS({
      ...personalOS,
      skills: personalOS.skills.filter((skill) => skill.id !== skillId),
    });
  };

  const handleAddDeadline = async () => {
    if (!deadlineForm.name.trim() || !deadlineForm.date) {
      return;
    }

    const nextDeadline = {
      id: Date.now(),
      name: deadlineForm.name.trim(),
      date: deadlineForm.date,
    };

    await syncPersonalOS({
      ...personalOS,
      deadlines: [...personalOS.deadlines, nextDeadline],
    });

    setDeadlineForm({ name: '', date: '' });
  };

  const removeDeadline = async (deadlineId) => {
    await syncPersonalOS({
      ...personalOS,
      deadlines: personalOS.deadlines.filter((deadline) => deadline.id !== deadlineId),
    });
  };

  const netWorth = useMemo(() => {
    const { income, expenses, assets, debts } = personalOS.finances;
    return assets + income - expenses - debts;
  }, [personalOS.finances]);

  const activeHabits = personalOS.habits.filter((habit) => habit.stage !== 'completed');
  const completedHabits = personalOS.habits.filter((habit) => habit.stage === 'completed');
  const planHasAnyText = Object.values(planForm).some((segment) => segment.text || segment.date || segment.purpose);
  const upcomingDeadlines = [...personalOS.deadlines]
    .filter((deadline) => new Date(deadline.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const expiredDeadlines = [...personalOS.deadlines]
    .filter((deadline) => new Date(deadline.date) <= new Date());

  const countdownFor = (deadlineDate) => {
    const diff = new Date(deadlineDate).getTime() - tick;

    if (diff <= 0) {
      return 'Expired';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Unique LM-OS modules</p>
          <h1 className="text-4xl font-bold text-zhust-accent mt-2">Life OS</h1>
          <p className="text-gray-400 mt-2 max-w-3xl">
            ZHUST remains the main command center. This page carries over the LM-OS-only functionality:
            finances, habits, skills, and deadline tracking inside the same persisted backend.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-[280px]">
          <div className="frosted-card rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400">Net Worth</div>
            <div className="text-2xl font-bold text-zhust-accent">PKR {wealthLevel.netWorthValue.toLocaleString()}</div>
          </div>
          <div className="frosted-card rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400">Active Habits</div>
            <div className="text-2xl font-bold text-zhust-accent">{activeHabits.length}</div>
          </div>
          <div className="frosted-card rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400">Wealth Level</div>
            <div className="text-2xl font-bold text-zhust-accent">L{wealthLevel.level}</div>
          </div>
          <div className="frosted-card rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400">Tracked Skills</div>
            <div className="text-2xl font-bold text-zhust-accent">{personalOS.skills.length}</div>
          </div>
          <div className="frosted-card rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400">Upcoming Deadlines</div>
            <div className="text-2xl font-bold text-zhust-accent">{upcomingDeadlines.length}</div>
          </div>
        </div>
      </div>

      <section className="frosted-card rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-zhust-accent">One Page Plan</h2>
            <p className="text-sm text-gray-400">The LM-OS planning model, now under ZHUST.</p>
          </div>
          <button
            onClick={handleSavePlan}
            className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Save Plan
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {[
            { key: 'long', label: 'Long-term Goal' },
            { key: 'mid', label: 'Mid-term Goal' },
            { key: 'short', label: 'Short-term Goal' },
          ].map((segment) => (
            <div key={segment.key} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 space-y-3">
              <h3 className="font-semibold text-white">{segment.label}</h3>
              <input
                type="text"
                value={planForm[segment.key].text}
                onChange={(event) => handlePlanFieldChange(segment.key, 'text', event.target.value)}
                placeholder={`Enter your ${segment.key}-term goal`}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
              />
              <input
                type="date"
                value={planForm[segment.key].date}
                onChange={(event) => handlePlanFieldChange(segment.key, 'date', event.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
              />
              <textarea
                value={planForm[segment.key].purpose}
                onChange={(event) => handlePlanFieldChange(segment.key, 'purpose', event.target.value)}
                placeholder="Why does this matter?"
                rows={4}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
              />
            </div>
          ))}
        </div>

        {planHasAnyText && (
          <div className="rounded-2xl border border-zhust-secondary/30 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Current Plan Snapshot</p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              {Object.entries(planForm).map(([segment, value]) => (
                <div key={segment} className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">
                  <div className="font-semibold capitalize text-zhust-accent">{segment}</div>
                  <div className="mt-1 text-gray-200">{value.text || 'No goal yet'}</div>
                  <div className="mt-1 text-xs text-gray-500">{value.date || 'No date set'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="frosted-card rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-zhust-accent">Expense / Income Tracker</h2>
            <p className="text-sm text-gray-400">Add ledger entries and let ZHUST calculate the totals and wealth level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={ledgerForm.type}
              onChange={(event) => setLedgerForm((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            >
              <option value="income">Income</option>
              <option value="passive">Passive Income</option>
              <option value="expense">Expense</option>
              <option value="asset">Asset</option>
              <option value="debt">Debt</option>
            </select>
            <input
              type="text"
              value={ledgerForm.name}
              onChange={(event) => setLedgerForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Entry name"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
            <input
              type="number"
              value={ledgerForm.amount}
              onChange={(event) => setLedgerForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Amount"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
            <input
              type="text"
              value={ledgerForm.category}
              onChange={(event) => setLedgerForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category / note"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
          </div>

          <button
            onClick={handleAddLedgerEntry}
            className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Add Ledger Entry
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3 text-center">
              <div className="text-xs text-gray-500">Income</div>
              <div className="text-lg font-bold text-zhust-accent">PKR {financeTotals.income.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3 text-center">
              <div className="text-xs text-gray-500">Expenses</div>
              <div className="text-lg font-bold text-zhust-accent">PKR {financeTotals.expenses.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3 text-center">
              <div className="text-xs text-gray-500">Assets</div>
              <div className="text-lg font-bold text-zhust-accent">PKR {financeTotals.assets.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3 text-center">
              <div className="text-xs text-gray-500">Debts</div>
              <div className="text-lg font-bold text-zhust-accent">PKR {financeTotals.debts.toLocaleString()}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zhust-secondary/30 bg-black/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Wealth Level</h3>
                <p className="text-xs text-gray-500">{wealthLevel.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zhust-accent">Level {wealthLevel.level}</div>
                <div className="text-xs text-gray-500">{wealthLevel.label}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">Next target: {wealthLevel.goal}</p>
          </div>

          <div className="space-y-3 max-h-80 overflow-auto pr-1">
            {(personalOS.finances.entries || []).length === 0 ? (
              <p className="text-sm text-gray-400">No ledger entries yet.</p>
            ) : (
              [...personalOS.finances.entries]
                .sort((a, b) => b.id - a.id)
                .map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{entry.name}</h3>
                        <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                          {entry.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{entry.category || 'General'}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-zhust-accent">PKR {Number(entry.amount || 0).toLocaleString()}</div>
                      <button
                        onClick={() => removeLedgerEntry(entry.id)}
                        className="mt-2 text-xs text-red-400 transition hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        <section className="frosted-card rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-zhust-accent">Habit Engine</h2>
            <p className="text-sm text-gray-400">The 21 → 90 → 365 progression from LM-OS, now inside ZHUST.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={habitForm.name}
              onChange={(event) => setHabitForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Habit name"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
            <input
              type="text"
              value={habitForm.focus}
              onChange={(event) => setHabitForm((prev) => ({ ...prev, focus: event.target.value }))}
              placeholder="Linked goal or focus"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
          </div>

          <button
            onClick={handleAddHabit}
            className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Add Habit
          </button>

          <div className="space-y-3">
            {personalOS.habits.length === 0 ? (
              <p className="text-sm text-gray-400">No habits tracked yet.</p>
            ) : (
              personalOS.habits.map((habit) => {
                const progressPercent = habit.stage === 'completed'
                  ? 100
                  : Math.min(100, (habit.progress / habit.stage) * 100);
                const checkedToday = habit.lastChecked === new Date().toDateString();

                return (
                  <div key={habit.id} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{habit.name}</h3>
                        <p className="text-xs text-gray-500">{habit.focus || 'Independent habit'}</p>
                      </div>
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="text-red-400 transition hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{createHabitStageLabel(habit)}</span>
                      <span>{habit.progress}/{habit.stage} days</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800">
                      <div className="h-2 rounded-full bg-zhust-accent transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={checkedToday}
                        onClick={() => handleHabitCheckIn(habit.id, true)}
                        className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Done Today
                      </button>
                      <button
                        disabled={checkedToday}
                        onClick={() => handleHabitCheckIn(habit.id, false)}
                        className="flex-1 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Missed
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {completedHabits.length > 0 && (
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Completed habits: {completedHabits.length}
            </p>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="frosted-card rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-zhust-accent">Skills Ledger</h2>
            <p className="text-sm text-gray-400">Track progress on high-value skills and grow them from one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={skillForm.name}
              onChange={(event) => setSkillForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Skill name"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
            <select
              value={skillForm.category}
              onChange={(event) => setSkillForm((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft Skills</option>
              <option value="language">Language</option>
              <option value="tool">Tool</option>
            </select>
          </div>

          <button
            onClick={handleAddSkill}
            className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Add Skill
          </button>

          <div className="space-y-3">
            {personalOS.skills.length === 0 ? (
              <p className="text-sm text-gray-400">No skills tracked yet.</p>
            ) : (
              personalOS.skills.map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{skill.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{skill.category}</p>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-400 transition hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-zhust-secondary to-zhust-accent transition-all" style={{ width: `${skill.progress}%` }} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => bumpSkill(skill.id, 10)}
                      className="flex-1 rounded-xl border border-zhust-secondary px-4 py-2 text-sm font-semibold text-zhust-accent transition hover:bg-zhust-secondary/10"
                    >
                      +10%
                    </button>
                    <button
                      onClick={() => bumpSkill(skill.id, -10)}
                      className="flex-1 rounded-xl border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-900"
                    >
                      -10%
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="frosted-card rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-zhust-accent">Deadline Tracker</h2>
            <p className="text-sm text-gray-400">Live countdowns for the LM-OS deadline workflow, now owned by ZHUST.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={deadlineForm.name}
              onChange={(event) => setDeadlineForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Deadline name"
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
            <input
              type="date"
              value={deadlineForm.date}
              onChange={(event) => setDeadlineForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none focus:border-zhust-secondary"
            />
          </div>

          <button
            onClick={handleAddDeadline}
            className="rounded-xl bg-zhust-secondary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Add Deadline
          </button>

          <div className="space-y-3">
            {personalOS.deadlines.length === 0 ? (
              <p className="text-sm text-gray-400">No deadlines tracked yet.</p>
            ) : (
              [...personalOS.deadlines]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((deadline) => (
                  <div key={deadline.id} className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{deadline.name}</h3>
                        <p className="text-xs text-gray-500">{deadline.date}</p>
                      </div>
                      <button
                        onClick={() => removeDeadline(deadline.id)}
                        className="text-red-400 transition hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="rounded-xl border border-zhust-secondary/30 bg-black/20 px-4 py-3 text-center font-mono text-lg text-zhust-accent">
                      {countdownFor(deadline.date)}
                    </div>
                  </div>
                ))
            )}
          </div>

          {expiredDeadlines.length > 0 && (
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Expired deadlines: {expiredDeadlines.length}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
