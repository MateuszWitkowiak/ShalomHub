const axios = require('axios');

const apiUrl = 'http://localhost:3001';

// pobieranie danych profilu użytkownika po mailu
async function fetchUserProfile(email) {
  try {
    const response = await axios.get(`${apiUrl}/profile`, {
      params: { email }
    });
    console.log("User profile fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response ? error.response.data : error.message);
  }
}

// Edytowanie danych profilu użytkownika
async function updateUserProfile(email, firstName, lastName, description) {
  try {
    const response = await axios.put(`${apiUrl}/profile`, {
      email,
      firstName,
      lastName,
      description
    });
    console.log("Profile updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response ? error.response.data : error.message);
  }
}

// Wyszukiwanie użytkowników
async function searchUsers(query) {
  try {
    const response = await axios.get(`${apiUrl}/profile/searchUsers`, {
      params: { query }
    });
    console.log("Users found:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error.response ? error.response.data : error.message);
  }
}

// Wysyłanie zaproszenia do znajomych
async function sendFriendRequest(senderEmail, receiverEmail) {
  try {
    const response = await axios.post(`${apiUrl}/profile/friendRequests`, {
      senderEmail,
      receiverEmail
    });
    console.log("Friend request sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error.response ? error.response.data : error.message);
  }
}

// akceptowanie zaproszenia do znaj
async function acceptFriendRequest(userId, friendEmail) {
  try {
    const response = await axios.put(`${apiUrl}/profile/friend-request/accept`, {
      userId,
      friendEmail
    });
    console.log("Friend request accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error accepting friend request:", error.response ? error.response.data : error.message);
  }
}

// odrzucenie zaproszenia do znaj
async function rejectFriendRequest(userId, friendEmail) {
  try {
    const response = await axios.delete(`${apiUrl}/profile/friend-request/reject`, {
      data: { userId, friendEmail }
    });
    console.log("Friend request rejected:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error rejecting friend request:", error.response ? error.response.data : error.message);
  }
}

// pobieranie zaproszen do znaj
async function fetchFriendRequests(userId) {
  try {
    const response = await axios.get(`${apiUrl}/profile/${userId}/friend-requests`);
    console.log("Received friend requests:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests:", error.response ? error.response.data : error.message);
  }
}

// sprawdzenie statusu zaproszenia
async function checkFriendRequestStatus(userId, friendEmail) {
  try {
    const response = await axios.get(`${apiUrl}/profile/friendRequests/status/${userId}`, {
      params: { friendEmail }
    });
    console.log("Friend request status:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking friend request status:", error.response ? error.response.data : error.message);
  }
}

// usunięcie znajomego
async function removeFriend(userEmail, friendEmail) {
  try {
    const response = await axios.post(`${apiUrl}/profile/removeFriend`, {
      userEmail,
      friendEmail
    });
    console.log("Friend removed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error removing friend:", error.response ? error.response.data : error.message);
  }
}

module.exports = {
  fetchUserProfile,
  updateUserProfile,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchFriendRequests,
  checkFriendRequestStatus,
  removeFriend
};
