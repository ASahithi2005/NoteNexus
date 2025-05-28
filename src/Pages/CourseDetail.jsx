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

  const [editingDesc, setEditingDesc] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/courseDetail/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => {
        setCourse(data);
        setNewDescription(data.description);
      })
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  const isMentor = user?.role === 'mentor' && course?.createdBy?.toString() === user?.id;
  const isStudent = user?.role === 'student' && course?.studentsEnrolled?.some(s => s.toString() === user?.id);

  const canUpload = section =>
    (section === 'syllabus' || section === 'notes') ? isMentor
    : section === 'assignments' ? (isMentor || isStudent)
    : false;

  const handleDeleteFile = async (section, index) => {
    if (!window.confirm(`Delete this ${section.slice(0, -1)}?`)) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/courseDetail/${courseId}/${section}/${index}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(await res.text());
      setCourse(await res.json());
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDescriptionSave = async () => {
    if (!newDescription.trim()) return alert('Cannot be empty');
    try {
      const res = await fetch(
        `http://localhost:5000/api/courseDetail/${courseId}/description`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ description: newDescription })
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setCourse(await res.json());
      setEditingDesc(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleUpload = async section => {
    if (!file) return alert('Select a file');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const res = await fetch(
        `http://localhost:5000/api/courseDetail/${courseId}/${section}`,
        { method: 'POST', body: formData, headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(await res.text());
      setCourse(await res.json());
      setFile(null);
      const inp = document.getElementById(`fileInput-${section}`);
      if (inp) inp.value = '';
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const renderFileItem = (item, section, idx) => {
    if (!item.fileUrl) return null;
    const ext = item.fileUrl.split('.').pop().toLowerCase();
    const url = `http://localhost:5000/${item.fileUrl}?t=${Date.now()}`;

    // Determine delete permission
    const studentOwns =
      section === 'assignments' &&
      user?.role === 'student' &&
      item.uploadedBy?.toString() === user.id;

    const canDelete = isMentor || studentOwns;

    return (
      <div key={idx} className="relative border p-3 rounded mb-2">
        {ext === 'pdf' ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {item.title}
          </a>
        ) : (
          <img src={url} alt={item.title} className="max-w-xs max-h-40 mb-2 rounded" />
        )}
        <p>{item.title}</p>
      
       <p className="text-sm text-gray-500">
  Uploaded by {item.uploadedBy.name || (item.role === 'mentor' ? 'Mentor' : 'Student')}
</p>


          {console.log(item.uploadedBy?.name || (item.role === 'mentor' ? 'Mentor' : 'Student'))}
        {canDelete && (
          <button
            onClick={() => handleDeleteFile(section, idx)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
          >
            &times;
          </button>
        )}
      </div>
    );
  };

  const renderAssignments = () => {
    const questions = (course.assignments || []).filter(f => f.type === 'question');
    const answers   = (course.assignments || []).filter(f => f.type === 'answer');
    return (
      <>
        <div className="mb-4">
          <h3 className="font-semibold">Questions</h3>
          {questions.map((it,i) => renderFileItem(it,'assignments',i)) ||
           <p>No questions.</p>}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Answers</h3>
          {answers.map((it,i) => renderFileItem(it,'assignments',i)) ||
           <p>No answers.</p>}
        </div>
      </>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error)   return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <div className="flex space-x-4 border-b mb-6">
        {['description','syllabus','notes','assignments'].map(tab => (
          <button
            key={tab}
            className={`pb-2 ${activeTab===tab?'border-b-2 border-blue-600 font-semibold':'text-gray-600'}`}
            onClick={()=>setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>
        {activeTab==='description' && (
          !editingDesc ? (
            <>
              <p>{course.description}</p>
              {isMentor && (
                <button
                  onClick={()=>setEditingDesc(true)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modify
                </button>
              )}
            </>
          ) : (
            <div>
              <textarea
                rows={4}
                className="w-full border p-2 rounded"
                value={newDescription}
                onChange={e=>setNewDescription(e.target.value)}
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleDescriptionSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={()=>{ setEditingDesc(false); setNewDescription(course.description); }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        )}
        {(activeTab==='syllabus'||activeTab==='notes') && (
          <>
            {course[activeTab]?.map((it,i)=>
              renderFileItem(it,activeTab,i)
            )||<p>No {activeTab}.</p>}
            {canUpload(activeTab) && (
              <div className="mt-4">
                <input
                  id={`fileInput-${activeTab}`}
                  type="file"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <button
                  onClick={()=>handleUpload(activeTab)}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {uploading?'Uploading...':`Upload ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </button>
              </div>
            )}
          </>
        )}
        {activeTab==='assignments' && (
          <>
            {renderAssignments()}
            {canUpload('assignments') && (
              <div className="mt-4">
                <input
                  id="fileInput-assignments"
                  type="file"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <button
                  onClick={()=>handleUpload('assignments')}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {uploading?'Uploading...':'Upload Assignment'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
