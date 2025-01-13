import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestProfileAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/profile"

    def setUp(self):
        self.valid_email = "testuser@example.com"
        self.invalid_email = "nonexistent@example.com"
        self.profile_payload = {
            "email": self.valid_email,
            "firstName": "Updated",
            "lastName": "User",
            "description": "Updated description"
        }
        self.search_query = "test"
        self.friend_request_payload = {
            "senderEmail": "testuser@example.com",
            "receiverEmail": "friend@example.com"
        }

    @parameterized.expand([
        ("valid_user", "testuser@example.com", 200, {
            "email": "testuser@example.com",
            "firstName": "Test",
            "lastName": "User",
            "description": "A test user"
        }),
        ("missing_email", None, 400, {"message": "Email is required"}),
        ("user_not_found", "nonexistent@example.com", 404, {"message": "User not found"})
    ])
    @patch('requests.get')
    def test_get_profile(self, name, email, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/", params={"email": email} if email else {})

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_update", {"email": "testuser@example.com", "firstName": "Updated"}, 200, {
            "message": "Profile updated successfully",
            "user": {"firstName": "Updated", "lastName": "User", "description": "A test user"}
        }),
        ("missing_email", {"firstName": "Updated"}, 400, {"message": "Email is required"}),
        ("user_not_found", {"email": "nonexistent@example.com"}, 404, {"message": "User not found"})
    ])
    @patch('requests.put')
    def test_update_profile(self, name, payload, expected_status, expected_response, mock_put):
        mock_put.return_value.status_code = expected_status
        mock_put.return_value.json.return_value = expected_response

        response = requests.put(f"{self.base_url}/", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_query", "test", 200, [{"firstName": "Test", "lastName": "User", "email": "testuser@example.com"}]),
        ("empty_query", "", 400, {"message": "Query is required"}),
        ("no_results", "unknown", 200, [])
    ])
    @patch('requests.get')
    def test_search_users(self, name, query, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/searchUsers", params={"query": query})

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_request", {"senderEmail": "testuser@example.com", "receiverEmail": "friend@example.com"}, 200, {
            "message": "Friend request sent successfully"
        }),
        ("missing_sender", {"receiverEmail": "friend@example.com"}, 400, {"message": "Both senderEmail and receiverEmail are required"}),
        ("user_not_found", {"senderEmail": "testuser@example.com", "receiverEmail": "unknown@example.com"}, 404, {"message": "User or friend not found"})
    ])
    @patch('requests.post')
    def test_send_friend_request(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/friendRequests", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("accept_request", {"userId": "user1", "friendEmail": "friend@example.com"}, 200, {
            "message": "Friend request accepted"
        }),
        ("reject_request", {"userId": "user1", "friendEmail": "unknown@example.com"}, 404, {"message": "User or friend not found"})
    ])
    @patch('requests.put')
    def test_accept_or_reject_friend_request(self, name, payload, expected_status, expected_response, mock_put):
        mock_put.return_value.status_code = expected_status
        mock_put.return_value.json.return_value = expected_response

        response = requests.put(f"{self.base_url}/friend-request/accept", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

if __name__ == '__main__':
    unittest.main()
