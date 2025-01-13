import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestChatAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/chat"

    @parameterized.expand([
        ("valid_room", "validRoomId123", 200, [{"text": "Hello!", "sender": "user1", "receiver": "user2"}]),
        ("room_not_found", "invalidRoomId456", 404, {"message": "Room not found"}),
    ])
    @patch('requests.get')
    def test_get_messages(self, name, room_id, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/messages/{room_id}")

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("create_new_room", {"user1": "user1@example.com", "user2": "user2@example.com"}, 200, {
            "users": ["user1@example.com", "user2@example.com"],
            "messages": []
        }),
        ("user_not_found", {"user1": "user1@example.com", "user2": "nonexistent@example.com"}, 404, {
            "message": "Users not found"
        }),
    ])
    @patch('requests.post')
    def test_create_room(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/rooms", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("send_message", {"roomId": "validRoomId123", "text": "Hi there!", "senderId": "user1", "receiverId": "user2"}, 200, {
            "text": "Hi there!",
            "sender": "user1",
            "receiver": "user2"
        }),
        ("room_not_found", {"roomId": "invalidRoomId456", "text": "Hi!", "senderId": "user1", "receiverId": "user2"}, 404, {
            "message": "Room or users not found"
        }),
        ("missing_fields", {}, 400, {"message": "Missing required fields"}),
    ])
    @patch('requests.post')
    def test_send_message(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/sendMessage", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

if __name__ == '__main__':
    unittest.main()
