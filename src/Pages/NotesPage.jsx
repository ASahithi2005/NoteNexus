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
        console.log("Fetched notes:", data);
        setNotes(data);
      })
      .catch((err) => setError(err.toString()));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!notes.length) return <p>No notes to show.</p>;

  return (
    <div className="p-6 max-w-7xl">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-center">All Notes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-1xl font-semibold mb-2">{note?.title || "Untitled Note"}</h3>
            <p className="text-md font-medium mb-1">Course: {note?.courseTitle || "Unknown"}</p>
            <p className="text-sm text-gray-500 mb-3">
              Uploaded:{" "}
              {note?.uploadedAt
                ? new Date(note.uploadedAt).toLocaleString()
                : "Date not available"}
            </p>
            <a
              href={`http://localhost:5000/${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 underline hover:text-blue-800"
            >
              Open File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
