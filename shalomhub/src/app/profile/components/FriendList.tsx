import React from 'react';
import { FriendsListProps } from './types';

const FriendsList: React.FC<FriendsListProps> = ({ friends, onGoToProfile }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
    <ul className="mt-4 space-y-4">
      {friends.length > 0 ? (
        friends.map((friend) => (
          <li key={friend.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div
              onClick={() => onGoToProfile(friend.email)}
              className="cursor-pointer text-lg text-gray-700 font-semibold"
            >
              {friend.firstName} {friend.lastName}
            </div>
          </li>
        ))
      ) : (
        <p className="text-lg text-gray-500">No friends yet.</p>
      )}
    </ul>
  </div>
);

export default FriendsList;
