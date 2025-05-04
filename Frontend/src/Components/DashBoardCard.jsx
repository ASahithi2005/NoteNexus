import React from 'react';

const DashBoardCard = ({ subject, onJoin }) => {
  return (
    <div className="bg-white shadow p-4 rounded-xl min-h-[200px]">
      <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
      <p className="text-sm text-gray-600">{subject.description}</p>
      <button
        className="mt-3 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        onClick={() => onJoin(subject._id)}
        disabled={subject.joined} // Disable button if already joined
      >
        {subject.joined ? 'Joined' : 'Join'}
      </button>
    </div>
  );
};

export default DashBoardCard;
