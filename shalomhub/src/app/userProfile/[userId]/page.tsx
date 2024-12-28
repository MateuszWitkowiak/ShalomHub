"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DefaultLayout from "../../components/DefaultLayout";
import ProtectedRoute from "../../components/ProtectedRoute";

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

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);

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
      if (!userId) return;

      try {
        // dekodowanie, problem ze znakami specjalnymi w zapytaniu
        const decodedUserId = decodeURIComponent(userId);

        const response = await axios.get(`http://localhost:3001/api/profile`, {
          params: { email: decodedUserId },
        });
        setProfile(response.data);

        const isAlreadyFriend = response.data.friends.some(
          (friend: Friend) => friend.email === currentUserEmail
        );
        setIsFriend(isAlreadyFriend);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId, router]);

  const handleAddFriend = async () => {
    const currentUserEmail = localStorage.getItem("userEmail");

    if (!currentUserEmail) {
      alert("Please log in to add friends.");
      return;
    }

    if (userId === currentUserEmail) {
      alert("You cannot add yourself as a friend.");
      return;
    }

    try {
      // dekodowanie - problem ze znakami specjalnymi
      const encodedUserId = encodeURIComponent(userId);
      const encodedCurrentUserEmail = encodeURIComponent(currentUserEmail);

      await axios.post(
        `http://localhost:3001/api/profile/${encodedCurrentUserEmail}/friends/add`,
        {
          friendEmail: userId,
        }
      );

      setIsFriend(true);
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Could not add friend.");
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
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-lg text-gray-700 mb-6">{profile.description}</p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
          <ul className="mt-4 space-y-4">
            {profile.friends.length > 0 ? (
              profile.friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                  onClick={() => router.push(`/userProfile/${friend.email}`)}
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

          <div className="mt-6">
            {!isFriend && (
              <button
                onClick={handleAddFriend}
                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
              >
                Add as Friend
              </button>
            )}
            {isFriend && (
              <button
                disabled
                className="w-full p-3 bg-gray-500 text-white rounded-md"
              >
                Already Friends
              </button>
            )}
          </div>
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
}
