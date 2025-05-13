export interface ProfileHeaderProps {
    firstName: string;
    lastName: string;
    description: string;
    onEdit: () => void;
}

export interface ProfileFormProps {
  newData: { firstName: string; lastName: string; description: string };
  setNewData: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; description: string }>>;
  onSave: () => void;
  onCancel: () => void;
}

export interface FriendRequest {
  sender: { email: string; firstName: string; lastName: string };
  _id: string;
}

export interface FriendRequestsProps {
  friendRequests: FriendRequest[];
  onAccept: (requestId: string, friendEmail: string) => void;
  onReject: (requestId: string, friendEmail: string) => void;
  onGoToProfile: (senderEmail: string) => void;
}


export interface Friend {
  firstName: string;
  lastName: string;
  email: string;
}

export interface FriendsListProps {
  friends: Friend[];
  onGoToProfile: (friendEmail: string) => void;
}