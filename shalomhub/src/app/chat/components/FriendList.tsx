import { Friend } from "../types";

interface FriendListProps {
  friends: Friend[];
  onFriendClick: (friend: Friend) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onFriendClick }) => {
  return (
    <div className="w-1/4 bg-white p-6 shadow-lg rounded-lg m-4 h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            onClick={() => onFriendClick(friend)}
            className="cursor-pointer p-3 mb-2 bg-gray-100 rounded-xl hover:bg-blue-100 transition duration-300"
          >
            <span className="font-medium text-gray-800">
              {friend.firstName} {friend.lastName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
