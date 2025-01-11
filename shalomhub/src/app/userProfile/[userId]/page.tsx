"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DefaultLayout from "../../components/DefaultLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { v4 as uuidv4 } from "uuid";

interface Friend {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  description: string;
  friends: Friend[];
}

type FriendRequestStatus = "none" | "pending" | "accepted" | "received";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState<FriendRequestStatus>("none");
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const currentUserEmail = localStorage.getItem("userEmail");

    if (!currentUserEmail) {
      alert("Please log in to view the profile.");
      return;
    }

    if (userId === currentUserEmail) {
      router.push("/profile");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const decodedUserId = decodeURIComponent(userId);

        const response = await axios.get(`http://localhost:3001/api/profile`, {
          params: { email: decodedUserId },
        });
        setProfile(response.data);

        const friendRequestResponse = await axios.get(
          `http://localhost:3001/api/profile/friendRequests/status/${currentUserEmail}`,
          { params: { friendEmail: decodedUserId } }
        );
        setFriendRequestStatus(friendRequestResponse.data.status);

        const friendsList = response.data.friends;
        const isAlreadyFriend = friendsList.some((friend: Friend) => friend.email === currentUserEmail);
        setIsFriend(isAlreadyFriend);
      } catch (error) {
        console.error("Error fetching user profile or friend request status:", error);
      }
    };

    fetchUserProfile();
  }, [userId, router]);

  const handleSendFriendRequest = async () => {
    try {
      const currentUserEmail = localStorage.getItem("userEmail");
      if (!currentUserEmail) {
        alert("Please log in to send friend requests.");
        return;
      }

      if (isFriend) {
        alert("You are already friends!");
        return;
      }

      await axios.post(`http://localhost:3001/api/profile/friendRequests`, {
        senderEmail: currentUserEmail,
        receiverEmail: userId,
        requestId: uuidv4(),
      });

      setFriendRequestStatus("pending");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Could not send friend request.");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const currentUserEmail = localStorage.getItem("userEmail");
      if (!currentUserEmail) {
        alert("Please log in to remove friends.");
        return;
      }

      await axios.post(`http://localhost:3001/api/profile/removeFriend`, {
        userEmail: userId,
        friendEmail: currentUserEmail,
      });

      setProfile((prevProfile) => (prevProfile && {
        ...prevProfile,
        friends: prevProfile.friends.filter(
          (friend) => friend.email !== currentUserEmail
        ),
      }));
      setFriendRequestStatus("none");
      setIsFriend(false);
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Could not remove friend.");
    }
  };

  if (!profile) {
    return (
      <DefaultLayout>
        <ProtectedRoute>
          <Header />
          <div className="p-6 text-center">Loading user profile...</div>
        </ProtectedRoute>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <Header />
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4 flex items-center space-x-4">
          <span>
            {profile.firstName} {profile.lastName}
          </span>
          {isFriend && (
            <div className="px-3 py-1 bg-green-500 text-white text-sm rounded-md mt-1">
              Friend
            </div>
          )}
        </h1>
          <p className="text-lg text-gray-700 mb-6">{profile.description}</p>

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

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
          <ul className="mt-4 space-y-4">
            {profile.friends.length > 0 ? (
              profile.friends.map((friend) => (
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
      </ProtectedRoute>
    </DefaultLayout>
  );
}
