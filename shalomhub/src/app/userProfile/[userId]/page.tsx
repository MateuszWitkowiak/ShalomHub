"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DefaultLayout from "../../components/DefaultLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { ProfileData, Friend } from "../types";
import { v4 as uuidv4 } from "uuid";

import ProfileHeader from "../components/ProfileHeader";
import FriendRequestButton from "../components/FriendRequestButton";
import FriendsList from "../components/FriendList";
import ProfileInfo from "../components/ProfileInfo";

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
          <ProfileHeader firstName={profile.firstName} lastName={profile.lastName} isFriend={isFriend} />
          <ProfileInfo description={profile.description} />
          <FriendRequestButton
            friendRequestStatus={friendRequestStatus}
            isFriend={isFriend}
            handleSendFriendRequest={handleSendFriendRequest}
            handleRemoveFriend={handleRemoveFriend}
          />
          <FriendsList friends={profile.friends} />
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
}
