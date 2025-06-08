// src/pages/AddCourse.jsx
import React, { useState, useEffect } from 'react';

const colorOptions = {
  Red: '#faa798',
  Yellow: '#faf898',
  Green: '#98facc',
  Blue: '#98befa',
  Pink:'#fa98e0',
};

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    colorName: '',
    color: '',
    mentorName: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'mentor') {
      alert('Only mentors can create courses.');
      window.location.href = '/';
    } else {
      setFormData(prev => ({
        ...prev,
        mentorName: user.name
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colorName') {
      setFormData(prev => ({
        ...prev,
        colorName: value,
        color: colorOptions[value] || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const courseData = {
      title: formData.title,
      description: formData.description,
      color: formData.color,
      colorName: formData.colorName,
      mentorName: formData.mentorName
    };
    try {
      const response = await fetch('http://localhost:5000/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        alert('Course created successfully!');
        window.location.href = '/';
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create course');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      alert('Error creating course');
    }
  };

  return (
    <div className="flex flex-1 justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Course
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Background Color
            </label>
            <select
              name="colorName"
              value={formData.colorName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a color</option>
              {Object.entries(colorOptions).map(([name]) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
