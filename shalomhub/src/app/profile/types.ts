export interface Friend {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  description: string;
  friends: Friend[];
}

export interface FriendRequest {
  _id: string;
  sender: {
    firstName: string;
    lastName: string;
    email: string;
  };
}