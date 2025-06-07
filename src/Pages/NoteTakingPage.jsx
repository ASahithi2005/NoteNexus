import React, { useState, useEffect } from 'react';

const NoteTakingPage = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', id: null });
  const [loading, setLoading] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch notes');

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      alert('Error fetching notes');
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add or update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      alert('Title and Description are required');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (form.id) {
        // Update existing note
        res = await fetch(`http://localhost:5000/api/notes/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: form.title, description: form.description }),
        });
      } else {
        // Add new note
        res = await fetch('http://localhost:5000/api/notes/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: form.title, description: form.description }),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save note');
      }

      // Refresh notes list
      await fetchNotes();

      // Reset form
      setForm({ title: '', description: '', id: null });
    } catch (err) {
      console.error('Error saving note:', err);
      alert(err.message);
    }

    setLoading(false);
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, description: note.description, id: note._id });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete note');

      // Refresh notes list
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Error deleting note');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
          disabled={loading}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          rows={4}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {form.id ? 'Update Note' : 'Add Note'}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({ title: '', description: '', id: null })}
            className="ml-4 px-4 py-2 rounded border border-gray-400 hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="w-full max-w-lg">
        {notes.length === 0 ? (
          <p className="text-gray-600">No notes found. Add some notes!</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded shadow p-4 mb-4 flex justify-between items-start"
              style={{ borderLeft: '4px solid #3b82f6' }}
            >
              <div>
                <h3 className="text-xl font-semibold">{note.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{note.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-blue-600 hover:underline"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-600 hover:underline"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteTakingPage;
