import { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';

export default function SprintBoard() {
  const { data, updateSprintBoard } = useApp();
  const [board, setBoard] = useState(
    data?.sprint_board || { tech: [], academic: [], administrative: [] }
  );
  const [activeCategory, setActiveCategory] = useState('tech');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (data?.sprint_board) {
      setBoard(data.sprint_board);
    }
  }, [data]);

  const addTask = async () => {
    if (inputValue.trim()) {
      const newBoard = { ...board };
      newBoard[activeCategory] = [...newBoard[activeCategory], inputValue];
      setBoard(newBoard);
      setInputValue('');
      await updateSprintBoard(newBoard);
    }
  };

  const removeTask = async (category, index) => {
    const newBoard = { ...board };
    newBoard[category] = newBoard[category].filter((_, i) => i !== index);
    setBoard(newBoard);
    await updateSprintBoard(newBoard);
  };

  const categories = [
    { key: 'tech', label: '💻 Tech', color: 'blue' },
    { key: 'academic', label: '🔬 Academic', color: 'purple' },
    { key: 'administrative', label: '📋 Administrative', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zhust-accent mb-2">🚀 Sprint Board</h1>
        <p className="text-gray-400">
          Organize your tasks into Tech, Academic, and Administrative categories for the sprint.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-zhust-secondary">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeCategory === cat.key
                ? 'text-zhust-accent border-b-2 border-zhust-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder={`Add ${activeCategory} task...`}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.key} className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
            <h3 className="text-xl font-bold text-zhust-accent mb-4">{cat.label}</h3>
            {board[cat.key].length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks yet</p>
            ) : (
              <ul className="space-y-2">
                {board[cat.key].map((task, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-white text-sm flex-1">{task}</span>
                    <button
                      onClick={() => removeTask(cat.key, idx)}
                      className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Sprint Stats */}
      <div className="bg-blue-900/30 border border-zhust-secondary rounded-lg p-6">
        <h3 className="font-semibold text-zhust-accent mb-3">📊 Sprint Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.key} className="text-center">
              <div className="text-2xl font-bold text-zhust-accent">{board[cat.key].length}</div>
              <div className="text-xs text-gray-400">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
