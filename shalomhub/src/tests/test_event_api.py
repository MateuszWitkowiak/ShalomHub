import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestEventAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/events"

    @parameterized.expand([
        ("valid_event_creation", {
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "createdBy": "validUserId"
        }, 201, {
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "createdBy": "validUserId"
        }),
        ("missing_fields", {
            "title": "",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "createdBy": "validUserId"
        }, 400, {"message": "Missing required fields"}),
        ("user_not_found", {
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "createdBy": "nonexistentUserId"
        }, 500, {"message": "Error creating event", "error": "Error creating event"}),
    ])
    @patch('requests.post')
    def test_create_event(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_get_events", None, 200, [{
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "createdBy": "validUserId"
        }]),
        ("no_events_found", {}, 200, []),
    ])
    @patch('requests.get')
    def test_get_all_events(self, name, params, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/", params=params)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_attend_event", {"userId": "validUserEmail@example.com"}, 200, {
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "attendees": ["validUserEmail@example.com"]
        }),
        ("missing_user_id", {"userId": ""}, 400, {"message": "Missing userId"}),
        ("user_not_found", {"userId": "nonexistent@example.com"}, 404, {"message": "User not found"}),
        ("event_not_found", {"userId": "validUserEmail@example.com"}, 404, {"message": "Event not found"}),
        ("user_already_attending", {"userId": "validUserEmail@example.com"}, 200, {
            "title": "Test Event",
            "description": "A description for the test event.",
            "date": "2025-01-14T12:00:00Z",
            "location": "Test Location",
            "attendees": []
        }),
    ])
    @patch('requests.post')
    def test_attend_event(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/{name}/attend", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

if __name__ == '__main__':
    unittest.main()
