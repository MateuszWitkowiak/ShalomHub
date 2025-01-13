import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestRegisterAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/register"

    def setUp(self):
        self.valid_payload = {
            "email": "testuser@example.com",
            "password": "password123",
            "confirmPassword": "password123",
            "firstName": "Test",
            "lastName": "User"
        }
        self.invalid_password_payload = {
            "email": "testuser@example.com",
            "password": "password123",
            "confirmPassword": "password321",
            "firstName": "Test",
            "lastName": "User"
        }

    @patch('requests.post')
    def test_register_success(self, mock_post):
        mock_post.return_value.status_code = 201
        mock_post.return_value.json.return_value = {"message": "User created successfully"}

        response = requests.post(self.base_url, json=self.valid_payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["message"], "User created successfully")

    @parameterized.expand([
        (
            "password_mismatch",
            {
                "email": "testuser@example.com",
                "password": "password123",
                "confirmPassword": "password321",
                "firstName": "Test",
                "lastName": "User"
            },
            400,
            "Passwords do not match"
        ),
        (
            "user_exists",
            {
                "email": "testuser@example.com",
                "password": "password123",
                "confirmPassword": "password123",
                "firstName": "Test",
                "lastName": "User"
            },
            400,
            "User with this email already exists"
        ),
        (
            "internal_error",
            {
                "email": "testuser@example.com",
                "password": "password123",
                "confirmPassword": "password123",
                "firstName": "Test",
                "lastName": "User"
            },
            500,
            "Error saving user"
        )
    ])
    @patch('requests.post')
    def test_register_failures(self, name, payload, status_code, error_message, mock_post):
        mock_post.return_value.status_code = status_code
        mock_post.return_value.json.return_value = {"error": error_message}

        response = requests.post(self.base_url, json=payload)

        self.assertEqual(response.status_code, status_code)
        self.assertEqual(response.json()["error"], error_message)


if __name__ == '__main__':
    unittest.main()
