import axios from 'axios';

const API_URL = 'http://localhost:3001/api/posts';

// dodanie posta
async function addPost(description, email) {
  try {
    const response = await axios.post(`${API_URL}/add`, { description, email });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas dodawania posta:', error);
    throw error;
  }
}

// pobieranie listy postów (ich obiektów z bazy)
async function getAllPosts() {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania postów:', error);
    throw error;
  }
}

// lajkowanie posta
async function likePost(postId, userEmail) {
  try {
    const response = await axios.post(`${API_URL}/like/${postId}`, { userEmail });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas polubienia/odpolubienia posta:', error);
    throw error;
  }
}

// komentowanie postów
async function commentOnPost(postId, text, userId) {
  try {
    const response = await axios.post(`${API_URL}/comment/${postId}`, { text, userId });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas dodawania komentarza:', error);
    throw error;
  }
}

// edytowanie postów
async function editPost(postId, description, userEmail) {
  try {
    const response = await axios.put(`${API_URL}/edit/${postId}`, { description, userEmail });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas edytowania posta:', error);
    throw error;
  }
}

// usuwanie postów
async function deletePost(postId, userEmail) {
  try {
    const response = await axios.delete(`${API_URL}/delete/${postId}`, { data: { userEmail } });
    return response.data;
  } catch (error) {
    console.error('Błąd podczas usuwania posta:', error);
    throw error;
  }
}

likePost("677e85c322686ee1a59c051c", "sigma1")
editPost("677e85c322686ee1a59c051c", "Strzelam sobie z serwera", "sigma1")

export { addPost, getAllPosts, likePost, commentOnPost, editPost, deletePost};
