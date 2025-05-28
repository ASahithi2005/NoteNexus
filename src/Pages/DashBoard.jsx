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

  // Retrieve token once
  const token = localStorage.getItem('token');

  // Load user if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        setError('Invalid user data in localStorage');
      }
    }
  }, []);

  // Fetch courses and trust backend's joined flags
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
          // Use backend's joined info directly
          setAvailableSubjects(data);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, token]);

  // Join course handler
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
          prev.map((sub) =>
            sub._id === courseId ? { ...sub, joined: true } : sub
          )
        );

        // Update user joinedCourses in local storage and state
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

  // Delete course handler (mentor only)
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

  // Fetch enrolled students for a course (mentor only)
  const fetchEnrolledStudents = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      return data.students; // expected array of { _id, name, email }
    } catch (err) {
      console.error('Fetch Enrolled Students Error:', err);
      throw err;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <TopBar />
        <BannerImage />
        <main className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Available Courses</h2>

            {user && user.role === 'mentor' && (
              <Link
                to="/addcourse"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Course
              </Link>
            )}
          </div>

          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : availableSubjects.length === 0 ? (
            <p className="text-gray-600">No available courses at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default DashBoard;
