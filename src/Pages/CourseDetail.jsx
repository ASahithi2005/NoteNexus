import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = ({ user, token }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/courseDetail/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Course not found (status ${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Course data is empty');
        }
        setCourse(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  const isMentor = user?.role === 'mentor' && course?.createdBy?.toString() === user?.id;
  const isStudent = user?.role === 'student' && course?.studentsEnrolled?.some((s) => s.toString() === user?.id);

  const canUpload = (section) => {
    if (section === 'syllabus' || section === 'notes') return isMentor;
    if (section === 'assignments') return isMentor || isStudent;
    return false;
  };

  const renderFileItem = (item) => {
    if (!item.fileUrl) return null;
    const ext = item.fileUrl.split('.').pop().toLowerCase();
    const url = `http://localhost:5000/${item.fileUrl}?t=${Date.now()}`; // prevent caching

    if (ext === 'pdf') {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {item.title || 'PDF Document'}
        </a>
      );
    }

    return (
      <img
        src={url}
        alt={item.title || 'Image'}
        className="max-w-xs max-h-40 mb-2 rounded"
      />
    );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (section) => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const response = await fetch(`http://localhost:5000/api/courseDetail/${courseId}/${section}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Upload failed');
      }

      const updatedCourse = await response.json();
      setCourse(updatedCourse);
      setFile(null);

      const fileInput = document.getElementById(`fileInput-${section}`);
      if (fileInput) fileInput.value = '';

      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} uploaded successfully!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const renderAssignments = () => {
    const questions = (course.assignments || []).filter((f) => f.type === 'question');
    const answers = (course.assignments || []).filter((f) => f.type === 'answer');

    return (
      <>
        <div className="mb-4">
          <h3 className="font-semibold">Assignment Questions:</h3>
          {questions.length === 0 ? (
            <p>No assignment questions uploaded yet.</p>
          ) : (
            questions.map((item, idx) => (
              <div key={`q-${idx}`} className="border p-3 rounded mb-2">
                {renderFileItem(item)}
                <p className="mt-1">{item.title}</p>
                <p className="text-sm text-gray-500">
                  Uploaded by {item.uploadedBy?.name || 'Mentor'}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Assignment Answers:</h3>
          {answers.length === 0 ? (
            <p>No assignment answers uploaded yet.</p>
          ) : (
            answers.map((item, idx) => (
              <div key={`a-${idx}`} className="border p-3 rounded mb-2">
                {renderFileItem(item)}
                <p className="mt-1">{item.title}</p>
                <p className="text-sm text-gray-500">
                  Uploaded by {item.uploadedBy?.name || 'Student'}
                </p>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div className="text-red-600 font-semibold">Error: {error}</div>;
  if (!course) return <div>No course data available.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

      <div className="flex space-x-4 border-b mb-6">
        {['description', 'syllabus', 'notes', 'assignments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'description' && <p>{course.description}</p>}

        {['syllabus', 'notes'].includes(activeTab) && (
          <div>
            {canUpload(activeTab) && (
              <div className="mb-4">
                <input
                  id={`fileInput-${activeTab}`}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <button
                  onClick={() => handleUpload(activeTab)}
                  disabled={uploading}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </button>
              </div>
            )}

            {(!Array.isArray(course[activeTab]) || course[activeTab].length === 0) ? (
              <p>No {activeTab} uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {course[activeTab].map((item, idx) => (
                  <div key={idx} className="border p-3 rounded">
                    {renderFileItem(item)}
                    <p className="mt-1">{item.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            {canUpload('assignments') && (
              <div className="mb-4">
                <input
                  id={`fileInput-assignments`}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <button
                  onClick={() => handleUpload('assignments')}
                  disabled={uploading}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : 'Add Assignment File'}
                </button>
              </div>
            )}
            {renderAssignments()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
