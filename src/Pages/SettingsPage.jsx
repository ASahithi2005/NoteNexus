import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaKey, FaTrash } from 'react-icons/fa';

export default function SettingsPage({ token }) {
  const [profile, setProfile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setEditName(data.name);
        setEditEmail(data.email);
      })
      .catch(err => setError(err.message));
  }, [token]);

  const updateProfile = () => {
    setMessage('');
    setError('');
    fetch('http://localhost:5000/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: editName, email: editEmail })
    })
      .then(res => res.json().then(body => {
        if (!res.ok) throw new Error(body.message || res.statusText);
        return body;
      }))
      .then(data => {
        setProfile(data);
        setMessage('Profile updated successfully!');
      })
      .catch(err => setError(err.message));
  };

  const changePassword = () => {
    setMessage('');
    setError('');
    fetch('http://localhost:5000/api/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(pwdForm)
    })
      .then(res => res.json().then(body => {
        if (!res.ok) throw new Error(body.message || res.statusText);
        return body;
      }))
      .then(() => {
        setMessage('Password changed successfully!');
        setPwdForm({ currentPassword: '', newPassword: '' });
      })
      .catch(err => setError(err.message));
  };

  const deleteAccount = () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setMessage('');
    setError('');
    fetch('http://localhost:5000/api/users/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(() => {
        setMessage('Account deleted. Please log in again.');
        // TODO: Add redirect to login page or logout logic
      })
      .catch(err => setError(err.message));
  };

  if (error) return <p className="text-red-600 font-semibold p-4">{error}</p>;
  if (!profile) return <p className="text-center py-10">Loading your profile...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-center text-gray-800"> Account Settings</h2>

      {/* Profile Info Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border border-gray-200">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <FaUserEdit className="text-blue-500" /> Edit Profile
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <button
            onClick={updateProfile}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border border-gray-200">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <FaKey className="text-yellow-500" /> Change Password
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={pwdForm.currentPassword}
            onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-500"
          />
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={pwdForm.newPassword}
            onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={changePassword}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Joined Courses - only show if user is a student and has joinedCourses */}
      {profile.role === 'student' && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📚 Joined Courses</h3>
          <ul className="list-disc list-inside text-gray-600">
            {profile.joinedCourses && profile.joinedCourses.length > 0 ? (
              profile.joinedCourses.map(course => (
                <li key={course._id}>{course.title}</li>
              ))
            ) : (
              <li>You haven’t joined any courses yet.</li>
            )}
          </ul>
        </div>
      )}

      {/* Delete Account */}
      <div className="text-center">
        <button
          onClick={deleteAccount}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition"
        >
          <FaTrash /> Delete My Account
        </button>
      </div>

      {/* Status Messages */}
      {message && <p className="text-green-600 font-medium text-center">{message}</p>}
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}
    </div>
  );
}
