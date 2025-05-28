import React, { useEffect, useState } from "react";

export default function NotesPage({ token }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/courseAggregates/notes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data) => {
        console.log("Fetched notes:", data); // Inspect data shape
        setNotes(data);
      })
      .catch((err) => setError(err.toString()));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!notes.length) return <p>No notes to show.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Notes</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{note?.title || "Untitled Note"}</h3>
            <p className="text-sm text-gray-600">Course: {note?.courseTitle || "Unknown"}</p>
            <p className="text-sm text-gray-500">
              Uploaded:{" "}
              {note?.uploadedAt ? new Date(note.uploadedAt).toLocaleString() : "Date not available"}
            </p>
            <a
              href={`http://localhost:5000/${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 underline"
            >
              Open File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
