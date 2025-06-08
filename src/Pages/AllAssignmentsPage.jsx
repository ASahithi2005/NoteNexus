import React, { useEffect, useState } from 'react';

export default function AllAssignmentsPage({ token }) {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/courseAggregates/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(data => setAssignments(data))
      .catch(err => setError(err.toString()));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!assignments.length) return <p>No assignments to show.</p>;

  return (
    <div className="p-6 max-w-7xl">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-center">All Assignments</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((a) => (
          <div
            key={a._id}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-1xl font-semibold mb-3">{a.title}</h3>
            <p className="text-md font-medium mb-1">Course: {a.courseTitle}</p>
            <p className="text-sm text-gray-500 mb-3">
              Uploaded: {a.uploadedAt ? new Date(a.uploadedAt).toLocaleString() : 'Date not available'}
            </p>
            {a.fileUrl ? (
              <a
                href={`http://localhost:5000${a.fileUrl.startsWith('/') ? a.fileUrl : '/' + a.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 underline hover:text-blue-800"
              >
                Open File
              </a>
            ) : (
              <p className="text-red-600">File not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
