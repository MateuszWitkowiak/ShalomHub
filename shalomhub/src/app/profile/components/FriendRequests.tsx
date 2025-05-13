import React from 'react';
import { FriendRequestsProps } from './types';

const FriendRequests: React.FC<FriendRequestsProps> = ({ friendRequests, onAccept, onReject, onGoToProfile }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friend Requests</h2>
    <ul className="mt-4 space-y-4">
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <li key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <button onClick={() => onGoToProfile(request.sender.email)} className="text-lg text-gray-700 font-semibold">
                {request.sender.firstName} {request.sender.lastName}
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onAccept(request._id, request.sender.email)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(request._id, request.sender.email)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </li>
        ))
      ) : (
        <p className="text-lg text-gray-500">No friend requests.</p>
      )}
    </ul>
  </div>
);

export default FriendRequests;
