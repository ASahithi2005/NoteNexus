import { useNavigate } from 'react-router-dom';

const DashBoardCard = ({ subject, onJoin, isMentor }) => {
  const navigate = useNavigate();

  const handleOpenCourse = () => {
    navigate(`/courses/${subject._id}`);
  };

  return (
    <div
      className="p-4 rounded-lg shadow-md"
      style={{ backgroundColor: subject.color || '#fff' }}
    >
      <h3 className="text-xl font-semibold mb-2">{subject.title}</h3>
      <p className="mb-2">{subject.description}</p>
      <p className="text-sm font-medium mb-4">Mentor: {subject.mentorName || 'N/A'}</p>

      {!isMentor && !subject.joined && (
        <button
          onClick={() => onJoin(subject._id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Join Course
        </button>
      )}

      {!isMentor && subject.joined && (
        <button
          onClick={handleOpenCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open
        </button>
      )}

      {isMentor && (
        <div className="flex space-x-3">
          <button
            onClick={handleOpenCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Open
          </button>
          <button
            onClick={() => navigate(`/enrolled-students/${subject._id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow-md"
          >
            View Enrolled Students
          </button>
        </div>
      )}
    </div>
  );
};

export default DashBoardCard;
