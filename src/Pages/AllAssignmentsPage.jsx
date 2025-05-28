import React, { useEffect, useState } from 'react';

export default function AllAssignmentsPage({ token }) {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/courseAggregates/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setAssignments(data))
      .catch(err => setError(err.toString()));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!assignments.length) return <p>No assignments to show.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Assignments</h2>
      <div className="space-y-6">
        {assignments.map(a => (
          <div key={a._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
            <p className="text-sm font-medium">Course: {a.courseTitle}</p>
            <p className="text-sm text-gray-500 my-1">
              Uploaded: {a.uploadedAt ? new Date(a.uploadedAt).toLocaleString() : 'Date not available'}
            </p>
            {a.fileUrl ? (
              <a
                href={`http://localhost:5000${a.fileUrl.startsWith('/') ? a.fileUrl : '/' + a.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 underline"
              >
                Open File
              </a>
            ) : (
              <p className="text-red-600 mt-2">File not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
