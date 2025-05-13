"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ProfileData, FriendRequest } from "./types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileForm from "./components/ProfileForm";
import ProfileHeader from "./components/ProfileHeader";
import FriendRequestList from "./components/FriendRequests";
import FriendList from "./components/FriendList";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    description: "",
    friends: [],
  });
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    description: "",
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    if (email && userId) {
      setUserEmail(email);
      setUserId(userId);
    } else {
      console.error("User email or ID is missing in localStorage");
    }
  }, []);

  const validateData = () => {
    if (!newData.firstName.trim()) {
      toast.error("First name cannot be empty.");
      return false;
    }
    if (!newData.lastName.trim()) {
      toast.error("Last name cannot be empty.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!userEmail || !userId) return;

    const fetchProfileAndRequests = async () => {
      try {
        const [profileResponse, requestsResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/profile", {
            params: { email: userEmail },
          }),
          axios.get(`http://localhost:3001/api/profile/${userId}/friend-requests`),
        ]);
        setProfile({
          ...profileResponse.data,
          friends: profileResponse.data.friends || [],
        });

        setFriendRequests(requestsResponse.data.receivedRequests || []);
      } catch (err) {
        console.error("Error fetching profile or friend requests:", err);
      }
    };

    fetchProfileAndRequests();
  }, [userEmail, userId]);

  const handleAcceptRequest = async (requestId: string, friendEmail: string) => {
    try {
      await axios.put("http://localhost:3001/api/profile/friend-request/accept", {
        userId,
        friendEmail,
      });

      setFriendRequests(prev => prev.filter(req => req._id !== requestId));

      const updatedProfile = await axios.get("http://localhost:3001/api/profile", {
        params: { email: userEmail },
      });
      toast.success("Friend Added successfully", {
        autoClose: 1500,
        hideProgressBar: true,
      });
      setProfile(updatedProfile.data);
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  const handleRejectRequest = async (requestId: string, friendEmail: string) => {
    try {
      await axios.delete("http://localhost:3001/api/profile/friend-request/reject", {
        data: { userId, friendEmail },
      });

      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      console.error("Error rejecting friend request:", err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      description: profile.description,
    });
  };

  const handleSave = async () => {
    if (!userEmail) {
      console.error("No email found in localStorage");
      return;
    }

    if (!validateData()) {
      return;
    }

    try {
      const response = await axios.put("http://localhost:3001/api/profile", {
        ...newData,
        email: userEmail,
      });

      setProfile({
        ...response.data.user,
        friends: profile.friends,
      });

      setIsEditing(false);
      toast.success("Profile edited successfully!", {
        autoClose: 1500,
        hideProgressBar: true,
      });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleGoToFriendProfile = (friendEmail: string) => {
    router.push(`/userProfile/${encodeURIComponent(friendEmail)}`);
  };

  const handleGoToRequestProfile = (senderEmail: string) => {
    router.push(`/userProfile/${encodeURIComponent(senderEmail)}`);
  };

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <ToastContainer />
        <Header />
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
          {isEditing ? (
            <ProfileForm
              newData={newData}
              setNewData={setNewData}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileHeader
            firstName={profile.firstName}
            lastName={profile.lastName}
            description={profile.description}
            onEdit={handleEdit}
            ></ProfileHeader>
          )}

          <FriendRequestList
            friendRequests={friendRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onGoToProfile={handleGoToRequestProfile}
          />

          <FriendList
            friends={profile.friends}
            onGoToProfile={handleGoToFriendProfile}
          />
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
}
