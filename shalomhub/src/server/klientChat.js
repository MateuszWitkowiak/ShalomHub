const axios = require("axios");

const apiUrl = "http://localhost:3001/api/chat";

// pobieranie wiadomosci dla danego pokoju (konwersacji)
async function fetchMessagesForRoom(roomId) {
  try {
    const response = await axios.get(`${apiUrl}/messages/${roomId}`);
    
    if (response.data) {
      console.log("Fetched messages:", response.data);
      return response.data;
    } else {
      console.error("No messages found for this room.");
      return [];
    }
  } catch (err) {
    console.error("Error fetching messages:", err.response ? err.response.data : err.message);
    return [];
  }
}

export default fetchMessagesForRoom