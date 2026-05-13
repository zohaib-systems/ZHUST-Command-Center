import { useState } from 'react';
import { useApp } from '../hooks/useApp';

export default function PromptCollection() {
  const { data, addPrompt, removePrompt } = useApp();
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showForm, setShowForm] = useState(false);

  const prompts = data?.prompt_collection || [];

  const handleAdd = async () => {
    if (!topic.trim() || !prompt.trim()) {
      return;
    }

    const success = await addPrompt(topic.trim(), prompt.trim());
    if (success) {
      setTopic('');
      setPrompt('');
      setShowForm(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setTopic('');
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-zhust-accent mb-2">Prompt Collection</h1>
          <p className="text-gray-400">Store reusable prompts with a clear topic and intent.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="h-12 w-12 rounded-xl border border-zhust-secondary bg-black/30 text-zhust-accent text-2xl leading-none hover:bg-black/50 transition-colors"
          aria-label="Add new prompt"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prompts.length === 0 ? (
          <div className="frosted-card rounded-lg p-6 text-gray-400">
            No prompts yet. Save your first prompt to build a reusable library.
          </div>
        ) : (
          prompts.map((entry) => (
            <div key={entry.id} className="frosted-card rounded-lg p-5 space-y-3 flex flex-col w-[300px] h-[300px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-zhust-accent">{entry.topic}</h3>
                  {entry.created_at && (
                    <p className="text-xs text-gray-500">Saved {new Date(entry.created_at).toLocaleString()}</p>
                  )}
                </div>
                <button
                  onClick={() => removePrompt(entry.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-200 whitespace-pre-wrap overflow-auto pr-1 flex-1">
                {entry.prompt}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-xs text-gray-500">Prompt</span>
                <button
                  onClick={() => navigator.clipboard.writeText(entry.prompt)}
                  className="text-xs text-zhust-accent hover:text-amber-300 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="frosted-card w-full max-w-lg rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zhust-accent">New Prompt</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g., Client onboarding summary"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Write the exact prompt you want to reuse..."
                rows={5}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
