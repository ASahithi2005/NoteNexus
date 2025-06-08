import React, { useState, useEffect } from 'react';

const NoteTakingPage = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', id: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
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
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return setError('Please login first');
    if (!form.title.trim() || !form.description.trim()) {
      return setError('Both title and description are required.');
    }

    setLoading(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id
        ? `http://localhost:5000/api/notes/${form.id}`
        : `http://localhost:5000/api/notes/add`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save note');

      setForm({ title: '', description: '', id: null });
      setMessage(form.id ? 'Note updated.' : 'Note added.');
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, description: note.description, id: note._id });
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Please login first');
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete note');
      setMessage('Note deleted successfully');
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-1 justify-center px-4 py-10 min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl space-y-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">My Notes</h2>

        {message && <p className="text-green-600 font-medium text-center">{message}</p>}
        {error && <p className="text-red-600 font-medium text-center">{error}</p>}

        {/* Note Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 space-y-4 border border-gray-200 shadow-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter note title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter note details"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {form.id ? 'Update Note' : 'Add Note'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm({ title: '', description: '', id: null })}
                className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-6">
          {notes.length === 0 ? (
            <p className="text-gray-600 text-center">No notes found. Add some!</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white border-l-4 border-blue-500 rounded-xl shadow p-6 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{note.description}</p>
                  </div>
                  <div className="flex gap-3 text-sm text-blue-600">
                    <button onClick={() => handleEdit(note)} className="hover:underline">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteTakingPage;
