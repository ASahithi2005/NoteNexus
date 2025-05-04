import React, { useEffect, useState } from 'react';
import SideBar from '../Components/SideBar';
import TopBar from '../Components/TopBar';
import DashBoardCard from '../Components/DashBoardCard';
import BannerImage from '../Components/BannerImage';
import axios from 'axios';

const DashBoard = () => {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [error, setError] = useState(null);

  const studentId = 'sample_student_id'; // Replace with actual student ID from auth/context

  useEffect(() => {
    // Simulate fetching subjects with mock data
    const mockData = [
      {
        _id: '1',
        name: 'Mathematics 101',
        description: 'Introduction to Mathematics',
        joined: false
      },
      {
        _id: '2',
        name: 'Physics 101',
        description: 'Introduction to Physics',
        joined: false
      },
      {
        _id: '3',
        name: 'Chemistry 101',
        description: 'Introduction to Chemistry',
        joined: false
      }
    ];

    // Simulate a successful API call
    setAvailableSubjects(mockData);
  }, []);

  const handleJoin = async (subjectId) => {
    try {
      // Simulate joining the subject
      setAvailableSubjects(prev => prev.map(sub =>
        sub._id === subjectId ? { ...sub, joined: true } : sub
      ));
    } catch (err) {
      console.error('Error joining subject:', err);
      setError('Failed to join the subject.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <TopBar />
        <BannerImage />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Join a Subject</h2>
          {error && <p className="text-red-600">{error}</p>}
          {availableSubjects.length === 0 ? (
            <p className="text-gray-600">You're already part of all available subjects.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSubjects.map(subject => (
                <DashBoardCard
                  key={subject._id}
                  subject={subject}
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
