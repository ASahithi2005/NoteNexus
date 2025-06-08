// DashBoard.jsx
import React, { useEffect, useState } from 'react';
import SideBar from '../Components/SideBar';
import TopBar from '../Components/TopBar';
import DashBoardCard from '../Components/DashBoardCard';
import BannerImage from '../Components/BannerImage';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user:', e);
        setError('Invalid user data');
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/courses', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAvailableSubjects(data);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, token]);

  const handleJoin = async (courseId) => {
    if (!user || user.role !== 'student') {
      alert('Only students can join courses. Please log in as a student.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses/join/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAvailableSubjects((prev) =>
          prev.map((course) =>
            course._id === courseId ? { ...course, joined: true } : course
          )
        );

        const updatedUser = {
          ...user,
          joinedCourses: [...(user.joinedCourses || []), courseId],
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to join course');
      }
    } catch (err) {
      console.error('Join Error:', err);
      setError('Error joining course');
    }
  };

  const handleDelete = async (courseId) => {
    if (!user || user.role !== 'mentor') {
      alert('Only mentors can delete courses.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAvailableSubjects((prev) => prev.filter((course) => course._id !== courseId));
        setError(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Delete Error:', err);
      setError('Error deleting course');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="px-4 md:px-6 mt-4">
          <BannerImage />

          <main className="py-6">
            <div className="flex md:flex-row justify-between items-start md:items-center gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Available Courses
              </h2>

              {user?.role === 'mentor' && (
                <Link
                  to="/addcourse"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Create Course
                </Link>
              )}
            </div>

            {loading ? (
              <p className="text-gray-600">Loading courses...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : availableSubjects.length === 0 ? (
              <p className="text-gray-600">No available courses at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-6 px-4 md:px-5">
                {availableSubjects.map((course) => (
                  <DashBoardCard
                    key={course._id}
                    subject={course}
                    onJoin={handleJoin}
                    onDelete={handleDelete}
                    user={user}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
