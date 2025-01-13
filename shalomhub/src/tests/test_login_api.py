import unittest
from unittest.mock import patch
from parameterized import parameterized

class TestLoginAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/login"

    def setUp(self):
        self.valid_payload = {
            "email": "testuser@example.com",
            "password": "password123"
        }
        self.invalid_email_payload = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        self.invalid_password_payload = {
            "email": "testuser@example.com",
            "password": "wrongpassword"
        }

    @patch('requests.post')
    def test_login_success(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "message": "Login successful",
            "userId": "12345"
        }

        response = mock_post(self.base_url, json=self.valid_payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Login successful")
        self.assertEqual(response.json()["userId"], "12345")

    @parameterized.expand([
        ("invalid_email", {"email": "nonexistent@example.com", "password": "password123"}, 400, "Invalid email or password"),
        ("invalid_password", {"email": "testuser@example.com", "password": "wrongpassword"}, 400, "Invalid email or password"),
        ("server_error", {"email": "testuser@example.com", "password": "password123"}, 500, "Internal server error"),
    ])
    @patch('requests.post')
    def test_login_failure_cases(self, name, payload, status_code, error_message, mock_post):
        mock_post.return_value.status_code = status_code
        mock_post.return_value.json.return_value = {"error": error_message}

        response = mock_post(self.base_url, json=payload)

        self.assertEqual(response.status_code, status_code)
        self.assertEqual(response.json()["error"], error_message)


if __name__ == '__main__':
    unittest.main()
