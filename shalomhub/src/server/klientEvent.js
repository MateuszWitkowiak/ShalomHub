import axios from 'axios';

const API_URL = 'http://localhost:3001/api/events';

// Tworzenie nowego wydarzenia
async function createEvent(title, description, date, location, createdBy) {
  try {
    const response = await axios.post(API_URL, { title, description, date, location, createdBy });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas tworzenia wydarzenia:', error);
    throw error;
  }
}

// Pobieranie wydarzeń
async function getEvents() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania wydarzeń:', error);
    throw error;
  }
}

// zarządzanie uczestnictwem w wydarzeniu
async function attendEvent(eventId, userId) {
  try {
    const response = await axios.post(`${API_URL}/${eventId}/attend`, { userId });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas zmiany uczestnictwa:', error);
    throw error;
  }
}

export { createEvent, getEvents, attendEvent };
