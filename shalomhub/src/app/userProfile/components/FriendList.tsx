import React from 'react';
import { Friend } from '../types';
import { useRouter } from 'next/navigation';

interface FriendsListProps {
  friends: Friend[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
      <ul className="mt-4 space-y-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li
              key={`${friend._id}-${friend.email}`}
              onClick={() => router.push(`/userProfile/${encodeURIComponent(friend.email)}`)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {friend.firstName[0]}{friend.lastName[0]}
                </div>
                <span className="text-lg text-gray-700 font-semibold">
                  {friend.firstName} {friend.lastName}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-lg text-gray-500">No friends found.</p>
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
