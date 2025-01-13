import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestNotificationsAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/posts"

    @parameterized.expand([
        ("valid_notifications", {"userId": "validUserId", "limit": 10, "skip": 0}, 200, [
            {"type": "like", "message": "user1 liked your post!", "createdAt": "2025-01-13T12:00:00Z"}
        ]),
        ("user_not_found", {"userId": "nonexistentUserId", "limit": 10, "skip": 0}, 404, {"message": "User not found"}),
        ("no_notifications", {"userId": "validUserId", "limit": 10, "skip": 0}, 200, []),
    ])
    @patch('requests.get')
    def test_get_notifications(self, name, params, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/notifications", params=params)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

if __name__ == '__main__':
    unittest.main()
