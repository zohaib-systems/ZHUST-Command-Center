import { useState } from 'react';
import { useApp } from '../hooks/useApp';

export default function KnowledgeVault() {
  const { data, addNote, removeNote } = useApp();
  const [notes, setNotes] = useState(data?.captured_notes || []);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = async () => {
    if (newNoteTitle.trim() || newNoteContent.trim()) {
      const success = await addNote({
        title: newNoteTitle,
        content: newNoteContent,
        category: 'general'
      });
      if (success) {
        setNotes([...notes, {
          id: Date.now(),
          title: newNoteTitle,
          content: newNoteContent,
          timestamp: new Date().toISOString()
        }]);
        setNewNoteTitle('');
        setNewNoteContent('');
      }
    }
  };

  const handleRemoveNote = async (id) => {
    const success = await removeNote(id);
    if (success) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zhust-accent mb-2">📚 Knowledge Vault</h1>
        <p className="text-gray-400">
          Capture and organize learning notes from ZHUST Extension and course trackers.
        </p>
      </div>

      {/* Course Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Startup Strategies */}
        <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-zhust-accent mb-4">🎓 Startup Strategies</h3>
          <div className="mb-4">
            <div className="w-full bg-gray-900 rounded-full h-2">
              <div
                className="bg-zhust-accent h-2 rounded-full"
                style={{ width: '30%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">3/10 modules completed</p>
          </div>
          <button className="w-full px-4 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors">
            Continue Learning
          </button>
        </div>

        {/* Freelancing Program */}
        <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-zhust-accent mb-4">💼 Freelancing Program</h3>
          <div className="mb-4">
            <div className="w-full bg-gray-900 rounded-full h-2">
              <div
                className="bg-zhust-accent h-2 rounded-full"
                style={{ width: '50%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">6/12 modules completed</p>
          </div>
          <button className="w-full px-4 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors">
            Continue Learning
          </button>
        </div>
      </div>

      {/* Add Note */}
      <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
        <h3 className="text-xl font-bold text-zhust-accent mb-4">✏️ Capture New Note</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white"
          />
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Note content..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-zhust-secondary text-white h-24 resize-none"
          />
          <button
            onClick={handleAddNote}
            className="px-6 py-2 bg-zhust-secondary hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-zhust-primary border border-zhust-secondary rounded-lg p-6">
        <h3 className="text-xl font-bold text-zhust-accent mb-4">📖 Captured Notes ({notes.length})</h3>
        {notes.length === 0 ? (
          <p className="text-gray-400">No notes yet. Start capturing your learning!</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{note.title || 'Untitled'}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveNote(note.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-300">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
