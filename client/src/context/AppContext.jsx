import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:5000/api';

  const defaultPersonalOS = {
    plan: {
      long: { text: '', date: '', purpose: '' },
      mid: { text: '', date: '', purpose: '' },
      short: { text: '', date: '', purpose: '' }
    },
    finances: {
      income: 0,
      expenses: 0,
      assets: 0,
      debts: 0,
      entries: []
    },
    habits: [],
    skills: [],
    deadlines: []
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/data`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update weekly goals
  const updateWeeklyGoals = async (goals) => {
    try {
      const response = await axios.post(`${API_BASE}/weekly-goals`, { goals });
      setData(prev => ({ ...(prev ?? {}), weekly_goals: response.data.data }));
      return true;
    } catch (err) {
      console.error('Failed to update goals:', err);
      return false;
    }
  };

  // Update sprint board
  const updateSprintBoard = async (board) => {
    try {
      const response = await axios.post(`${API_BASE}/sprint-board`, { board });
      setData(prev => ({ ...prev, sprint_board: response.data.data }));
      return true;
    } catch (err) {
      console.error('Failed to update sprint board:', err);
      return false;
    }
  };

  // Update learning progress
  const updateLearningProgress = async (progress) => {
    try {
      const response = await axios.post(`${API_BASE}/learning-progress`, { progress });
      setData(prev => ({ ...prev, learning_progress: response.data.data }));
      return true;
    } catch (err) {
      console.error('Failed to update learning progress:', err);
      return false;
    }
  };

  // Add a new note
  const addNote = async (noteData) => {
    try {
      const response = await axios.post(`${API_BASE}/notes`, noteData);
      setData(prev => ({
        ...prev,
        captured_notes: [...prev.captured_notes, response.data.note]
      }));
      return true;
    } catch (err) {
      console.error('Failed to add note:', err);
      return false;
    }
  };

  // Remove a note
  const removeNote = async (noteId) => {
    try {
      await axios.delete(`${API_BASE}/notes/${noteId}`);
      setData(prev => ({
        ...prev,
        captured_notes: prev.captured_notes.filter(n => n.id !== noteId)
      }));
      return true;
    } catch (err) {
      console.error('Failed to delete note:', err);
      return false;
    }
  };

  const addPrompt = async (topic, prompt) => {
    try {
      const response = await axios.post(`${API_BASE}/prompts`, { topic, prompt });
      setData(prev => ({
        ...prev,
        prompt_collection: [...(prev?.prompt_collection || []), response.data.prompt]
      }));
      return true;
    } catch (err) {
      console.error('Failed to add prompt:', err);
      return false;
    }
  };

  const removePrompt = async (promptId) => {
    try {
      await axios.delete(`${API_BASE}/prompts/${promptId}`);
      setData(prev => ({
        ...prev,
        prompt_collection: (prev?.prompt_collection || []).filter(entry => entry.id !== promptId)
      }));
      return true;
    } catch (err) {
      console.error('Failed to delete prompt:', err);
      return false;
    }
  };

  const savePersonalOS = async (personalOS) => {
    try {
      const response = await axios.post(`${API_BASE}/personal-os`, {
        personal_os: personalOS || defaultPersonalOS
      });

      setData(prev => ({
        ...(prev ?? {}),
        personal_os: response.data.data
      }));

      return true;
    } catch (err) {
      console.error('Failed to save personal OS:', err);
      return false;
    }
  };

  // Generate snapshot for PDF export
  const generateSnapshot = async () => {
    try {
      const response = await axios.post(`${API_BASE}/snapshot`);
      return response.data.snapshot;
    } catch (err) {
      console.error('Failed to generate snapshot:', err);
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        error,
        updateWeeklyGoals,
        updateSprintBoard,
        updateLearningProgress,
        addNote,
        removeNote,
        addPrompt,
        removePrompt,
        savePersonalOS,
        generateSnapshot
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
