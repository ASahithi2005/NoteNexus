// src/pages/AddCourse.jsx
import React, { useState, useEffect } from 'react';

const colorOptions = {
  CoralRed: '#F7786B',
  PastelYellow: '#FFD679',
  TealGreen: '#1FDA9A',
  DustyBlue: '#2E7D91',
  TerracottaOrange: '#EE6C4D',
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Course</h2>

        <label className="block mb-2 font-medium">Course Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 font-medium">Course Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 font-medium">Background Color</label>
        <select
          name="colorName"
          value={formData.colorName}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
          required
        >
          <option value="">Select a color</option>
          {Object.entries(colorOptions).map(([name, code]) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
