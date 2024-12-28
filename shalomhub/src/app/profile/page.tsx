"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";

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

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    description: "",
    friends: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    description: "",
  });

  const userEmail = localStorage.getItem("userEmail");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userEmail) {
        console.error("No email found in localStorage");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/profile", {
          params: { email: userEmail },
        });

        setProfile({
          ...response.data,
          friends: response.data.friends || [],
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userEmail]);

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
  
    try {
      const response = await axios.put(
        "http://localhost:3001/api/profile",
        { ...newData, email: userEmail }
      );
  
      setProfile({
        ...response.data.user,
        friends: profile.friends,
      });
  
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleGoToFriendProfile = (friendEmail: string) => {
    // dekodowanie - problem ze znakami specjalnymi w adresie
    router.push(`/userProfile/${encodeURIComponent(friendEmail)}`);
  };

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <Header />
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={newData.firstName}
                  onChange={(e) =>
                    setNewData({ ...newData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newData.lastName}
                  onChange={(e) =>
                    setNewData({ ...newData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newData.description}
                  onChange={(e) =>
                    setNewData({ ...newData, description: e.target.value })
                  }
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

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
          <ul className="mt-4 space-y-4">
            {profile.friends && profile.friends.length > 0 ? (
              profile.friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                  onClick={() => handleGoToFriendProfile(friend.email)}
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
