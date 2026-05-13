import { useEffect, useState } from 'react';
import { useApp } from '../hooks/useApp';

export default function WeeklyHorizon() {
  const { data, updateWeeklyGoals } = useApp();
  const [dailyInput, setDailyInput] = useState('');
  const [otherInput, setOtherInput] = useState('');
  const [dailyTasks, setDailyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getRecentDates = (days = 7) =>
    Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - index));
      return {
        key: formatLocalDate(date),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
      };
    });

  const normalizeDailyTasks = (tasks = []) =>
    tasks.map((task) => {
      if (typeof task === 'string') {
        return { text: task, history: [], streak: 0 };
      }

      const history = Array.isArray(task?.history) ? task.history : [];
      const streak = task?.streak ?? history.length;
      return {
        text: task?.text || '',
        history,
        streak,
      };
    });

  useEffect(() => {
    const weeklyGoals = data?.weekly_goals;
    if (Array.isArray(weeklyGoals)) {
      setDailyTasks([]);
      setOtherTasks(weeklyGoals);
      return;
    }

    setDailyTasks(normalizeDailyTasks(weeklyGoals?.daily_tasks || []));
    setOtherTasks(weeklyGoals?.other_tasks || []);
  }, [data]);

  const persistGoals = async (nextDaily, nextOther) => {
    await updateWeeklyGoals({
      daily_tasks: nextDaily,
      other_tasks: nextOther,
    });
  };

  const addDailyTask = async () => {
    if (dailyInput.trim()) {
      const nextDaily = [
        ...dailyTasks,
        { text: dailyInput.trim(), streak: 0, lastCheckedDate: null },
      ];
      setDailyTasks(nextDaily);
      setDailyInput('');
      await persistGoals(nextDaily, otherTasks);
    }
  };

  const addOtherTask = async () => {
    if (otherInput.trim()) {
      const nextOther = [...otherTasks, otherInput.trim()];
      setOtherTasks(nextOther);
      setOtherInput('');
      await persistGoals(dailyTasks, nextOther);
    }
  };

  const removeDailyTask = async (index) => {
    const nextDaily = dailyTasks.filter((_, i) => i !== index);
    setDailyTasks(nextDaily);
    await persistGoals(nextDaily, otherTasks);
  };

  const toggleDailyTaskDate = async (index, dateKey) => {
    const nextDaily = dailyTasks.map((task, i) => {
      if (i !== index) {
        return task;
      }

      const history = task.history ?? [];
      const exists = history.includes(dateKey);
      const nextHistory = exists
        ? history.filter((entry) => entry !== dateKey)
        : [...history, dateKey];

      return {
        ...task,
        history: nextHistory,
        streak: nextHistory.length,
      };
    });

    setDailyTasks(nextDaily);
    await persistGoals(nextDaily, otherTasks);
  };

  const removeOtherTask = async (index) => {
    const nextOther = otherTasks.filter((_, i) => i !== index);
    setOtherTasks(nextOther);
    await persistGoals(dailyTasks, nextOther);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zhust-accent mb-2">📋 Weekly Horizon</h1>
        <p className="text-gray-400">
          Balance your daily fixed tasks with planned, time-sensitive work for the week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tasks */}
        <div className="frosted-card rounded-lg p-6">
          <h2 className="text-2xl font-bold text-zhust-accent mb-2">Daily Rituals & Streaks</h2>
          <p className="text-gray-400 text-sm mb-4">Check in each day to log consistency and build momentum.</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={dailyInput}
              onChange={(e) => setDailyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDailyTask()}
              placeholder="Add a daily task (e.g., 25 min pomodoro)..."
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
            />
            <button
              onClick={addDailyTask}
              className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Add
            </button>
          </div>
          {dailyTasks.length === 0 ? (
            <p className="text-gray-400">No daily tasks yet.</p>
          ) : (
            <ul className="space-y-3">
              {dailyTasks.map((task, idx) => {
                const recentDates = getRecentDates();
                const history = task.history ?? [];
                const streakCount = task.streak ?? history.length;

                return (
                  <li key={idx} className="flex flex-col gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white">
                        <span className="font-bold text-zhust-accent mr-2">{idx + 1}.</span>
                        {task.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 border border-gray-700 rounded-full px-2 py-1">
                          Streak {streakCount}d
                        </span>
                        <button
                          onClick={() => removeDailyTask(idx)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentDates.map((date) => {
                        const completed = history.includes(date.key);
                        return (
                          <button
                            key={date.key}
                            onClick={() => toggleDailyTaskDate(idx, date.key)}
                            className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1 text-xs transition-colors ${completed ? 'border-zhust-accent bg-zhust-accent/20 text-zhust-accent' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                            aria-label={`Toggle ${task.text} for ${date.label} ${date.day}`}
                          >
                            <span className="uppercase tracking-wide">{date.label}</span>
                            <span className="text-sm font-semibold">{date.day}</span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Planned Tasks */}
        <div className="frosted-card rounded-lg p-6">
          <h2 className="text-2xl font-bold text-zhust-accent mb-2">Priority Missions</h2>
          <p className="text-gray-400 text-sm mb-4">One-off tasks scheduled by urgency or a specific day.</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOtherTask()}
              placeholder="Add a planned task (e.g., edit image on Thursday)..."
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
            />
            <button
              onClick={addOtherTask}
              className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Add
            </button>
          </div>
          {otherTasks.length === 0 ? (
            <p className="text-gray-400">No planned tasks yet.</p>
          ) : (
            <ul className="space-y-3">
              {otherTasks.map((task, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                  <span className="text-white">
                    <span className="font-bold text-zhust-accent mr-2">{idx + 1}.</span>
                    {task}
                  </span>
                  <button
                    onClick={() => removeOtherTask(idx)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="frosted-card rounded-lg p-6">
        <h3 className="font-semibold text-zhust-accent mb-2">📌 This Week's Focus</h3>
        <p className="text-gray-300 text-sm">
          You have {dailyTasks.length} daily task{dailyTasks.length !== 1 ? 's' : ''} and{' '}
          {otherTasks.length} planned task{otherTasks.length !== 1 ? 's' : ''} set for this week.
          {(dailyTasks.length + otherTasks.length) > 0 && ' Keep the Sprint Board aligned with these priorities.'}
        </p>
      </div>
    </div>
  );
}
