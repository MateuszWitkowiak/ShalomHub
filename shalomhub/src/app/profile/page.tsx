"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ProfileData, Friend, FriendRequest } from "./types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");
      if (email && userId) {
        setUserEmail(email);
        setUserId(userId);
      } else {
        console.error("User email or ID is missing in localStorage");
      }
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
      const response = await axios.put("http://localhost:3001/api/profile/friend-request/accept", {
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
      })
      setProfile(updatedProfile.data);
  
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };
  
  const handleRejectRequest = async (requestId: string, friendEmail: string) => {
    try {
      
      const response = await axios.delete("http://localhost:3001/api/profile/friend-request/reject", {
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

    if (!validateData()){
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
      })
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
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={newData.firstName}
                  onChange={(e) => setNewData({ ...newData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={newData.lastName}
                  onChange={(e) => setNewData({ ...newData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Description</label>
                <textarea
                  value={newData.description}
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                  placeholder="Write a short description"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Name:</strong> {profile.firstName} {profile.lastName}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Description:</strong> {profile.description}
              </p>
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
            </div>
          )}

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friend Requests</h2>
          <ul className="mt-4 space-y-4">
            {friendRequests && friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <li
                  key={uuidv4()}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="text-lg text-gray-700 font-semibold">
                      {request.sender.firstName} {request.sender.lastName}
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleAcceptRequest(request._id, request.sender.email)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id, request.sender.email)}
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

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
          <ul className="mt-4 space-y-4">
            {profile.friends && profile.friends.length > 0 ? (
              profile.friends.map((friend) => (
                <li
                  key={uuidv4()}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    onClick={() => handleGoToFriendProfile(friend.email)}
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
      </ProtectedRoute>
    </DefaultLayout>
  );
}
