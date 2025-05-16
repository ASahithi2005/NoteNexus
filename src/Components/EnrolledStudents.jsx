import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const EnrolledStudents = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const courseTitle = location.state?.courseTitle || 'Course';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in as a mentor to view students.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${courseId}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg || 'Failed to load students');
        }

        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  if (loading) return <p>Loading enrolled students...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (students.length === 0) return <p>No students enrolled in this course yet.</p>;

  return (
    <div className="p-6">
  <h3 className="text-2xl font-semibold mb-4">Enrolled Students for "{courseTitle}"</h3>
  <table className="min-w-full border border-gray-300 rounded-md">
    <thead className="bg-gray-100">
      <tr>
        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student._id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2 font-semibold">{student.name}</td>
          <td className="border border-gray-300 px-4 py-2">{student.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default EnrolledStudents;
