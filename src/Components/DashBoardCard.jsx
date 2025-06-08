// DashBoardCard.jsx
import { useNavigate } from 'react-router-dom';

const DashBoardCard = ({ subject, onJoin, onDelete, user }) => {
  const navigate = useNavigate();
  const isMentor = user?.role === 'mentor';
  const isCreator = isMentor && user._id === subject.mentorId;

  return (
    <div
      className={`p-4 rounded-lg shadow-md w-full bg-white flex flex-col justify-between`}
      style={{ backgroundColor: subject.color || '#f9fafb' }}
    >
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{subject.title}</h3>
        <p className="mb-2 text-sm">{subject.description}</p>
        <p className="text-sm font-medium mb-4">
          Mentor: {subject.mentorName || 'N/A'}
        </p>
      </div>

      <div className="mt-auto">
        {!user || user.role !== 'mentor' ? (
          !subject.joined ? (
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => onJoin(subject._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Join
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => navigate(`/courses/${subject._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Open
              </button>
            </div>
          )
        ) : (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => navigate(`/courses/${subject._id}`)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1"
            >
              Open
            </button>
            <button
              onClick={() => navigate(`/enrolled-students/${subject._id}`)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex-1"
            >
              View
            </button>
            {isCreator && (
              <button
                onClick={() => onDelete(subject._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex-1"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoardCard;
