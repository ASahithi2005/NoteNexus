import React from 'react';

const DashBoardCard = ({ subject, onJoin }) => {
  return (
    <div className="bg-white shadow p-4 rounded-xl min-h-[250px]">
      <img
        src={subject.imageUrl}
        alt={subject.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-semibold mb-1">{subject.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{subject.description}</p>
      <p className="text-sm text-gray-700 font-medium mb-2">
        Mentor: {subject.mentor?.name || 'N/A'}
      </p>
      <button
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        onClick={() => onJoin(subject._id)}
        disabled={subject.joined}
      >
        {subject.joined ? 'Joined' : 'Join'}
      </button>
    </div>
  );
};

export default DashBoardCard;
