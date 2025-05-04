import React, { useEffect, useState } from 'react';
import SideBar from '../Components/SideBar';
import TopBar from '../Components/TopBar';
import DashBoardCard from '../Components/DashBoardCard';
import BannerImage from '../Components/BannerImage';

const DashBoard = () => {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        if (response.ok) {
          setAvailableSubjects(data);
        } else {
          setError(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error fetching data');
      }
    };

    fetchCourses();
  }, []);

  const handleJoin = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/courses/join/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAvailableSubjects((prev) =>
          prev.map((sub) =>
            sub._id === courseId ? { ...sub, joined: true } : sub
          )
        );
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to join course');
      }
    } catch (err) {
      console.error('Join Error:', err);
      setError('Error joining course');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <TopBar />
        <BannerImage />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
          {error && <p className="text-red-600">{error}</p>}
          {availableSubjects.length === 0 ? (
            <p className="text-gray-600">No available courses at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSubjects.map((course) => (
                <DashBoardCard
                  key={course._id}
                  subject={course}
                  onJoin={handleJoin}
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
