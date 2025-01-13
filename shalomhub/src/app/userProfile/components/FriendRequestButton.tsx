type FriendRequestStatus = "none" | "pending" | "accepted" | "received";

interface FriendRequestButtonProps {
  friendRequestStatus: FriendRequestStatus;
  isFriend: boolean;
  handleSendFriendRequest: () => void;
  handleRemoveFriend: () => void;
}

const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({ 
  friendRequestStatus, 
  isFriend, 
  handleSendFriendRequest, 
  handleRemoveFriend 
}) => {
  return (
    <div className="mt-6 justify-items-center">
      {friendRequestStatus === "none" && !isFriend && (
        <button
          onClick={handleSendFriendRequest}
          className="w-1/4 flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          <span>Send Friend Request</span>
        </button>
      )}
      {friendRequestStatus === "pending" && !isFriend && (
        <button
          disabled
          className="w-1/4 flex items-center justify-center space-x-2 p-3 bg-yellow-500 text-white rounded-md"
        >
          <span>Request Pending</span>
        </button>
      )}
      {friendRequestStatus === "received" && !isFriend && (
        <button
          disabled
          className="w-1/4 flex items-center justify-center space-x-2 p-3 bg-purple-500 text-white rounded-md"
        >
          <span>Request Received</span>
        </button>
      )}
      {isFriend && (
        <button
          onClick={handleRemoveFriend}
          className="w-1/4 flex items-center justify-center space-x-2 p-3 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all"
        >
          <span>Remove from Friends</span>
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
