import unittest
import requests
from unittest.mock import patch
from parameterized import parameterized

class TestPostAPI(unittest.TestCase):
    base_url = "http://localhost:3001/api/posts"

    @parameterized.expand([
        ("valid_post_creation", {"description": "Test post", "email": "testuser@example.com"}, 201, {
            "description": "Test post",
            "userId": "validUserId"
        }),
        ("missing_fields", {"description": "", "email": "testuser@example.com"}, 400, {"message": "Description and email are required"}),
        ("user_not_found", {"description": "Test post", "email": "nonexistent@example.com"}, 404, {"message": "User not found"}),
    ])
    @patch('requests.post')
    def test_create_post(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/add", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_get_posts", None, 200, [{"description": "Test post", "userId": "validUserId", "likesCount": 0}]),
        ("no_posts_found", {}, 200, []),
    ])
    @patch('requests.get')
    def test_get_all_posts(self, name, params, expected_status, expected_response, mock_get):
        mock_get.return_value.status_code = expected_status
        mock_get.return_value.json.return_value = expected_response

        response = requests.get(f"{self.base_url}/getAll", params=params)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_like_post", {"userEmail": "testuser@example.com"}, 200, {
            "description": "Test post",
            "userId": "validUserId",
            "likesCount": 1,
        }),
        ("post_not_found", {"userEmail": "testuser@example.com"}, 404, {"message": "Post not found"}),
        ("user_not_found", {"userEmail": "nonexistent@example.com"}, 404, {"message": "User not found"}),
        ("like_unlike_post", {"userEmail": "testuser@example.com"}, 200, {
            "description": "Test post",
            "userId": "validUserId",
            "likesCount": 0,
        }),
    ])
    @patch('requests.post')
    def test_like_post(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/like/{name}", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_comment", {"text": "Great post!", "userId": "validUserId"}, 201, {
            "description": "Test post",
            "userId": "validUserId",
            "comments": [{"userId": "validUserId", "text": "Great post!"}]
        }),
        ("missing_fields", {"text": "", "userId": "validUserId"}, 400, {"message": "Text and userId are required"}),
        ("post_not_found", {"text": "Great post!", "userId": "validUserId"}, 404, {"message": "Post not found"}),
        ("user_not_found", {"text": "Great post!", "userId": "nonexistent@example.com"}, 404, {"message": "User not found"}),
    ])
    @patch('requests.post')
    def test_comment_on_post(self, name, payload, expected_status, expected_response, mock_post):
        mock_post.return_value.status_code = expected_status
        mock_post.return_value.json.return_value = expected_response

        response = requests.post(f"{self.base_url}/comment/{name}", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_edit", {"description": "Updated post", "userEmail": "testuser@example.com"}, 200, {
            "description": "Updated post",
            "userId": "validUserId"
        }),
        ("missing_fields", {"description": "", "userEmail": "testuser@example.com"}, 400, {"message": "Description and userEmail are required"}),
        ("post_not_found", {"description": "Updated post", "userEmail": "testuser@example.com"}, 404, {"message": "Post not found"}),
        ("user_not_found", {"description": "Updated post", "userEmail": "nonexistent@example.com"}, 404, {"message": "User not found"}),
        ("unauthorized_edit", {"description": "Updated post", "userEmail": "wronguser@example.com"}, 403, {"message": "You are not authorized to edit this post"})
    ])
    @patch('requests.put')
    def test_edit_post(self, name, payload, expected_status, expected_response, mock_put):
        mock_put.return_value.status_code = expected_status
        mock_put.return_value.json.return_value = expected_response

        response = requests.put(f"{self.base_url}/edit/{name}", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

    @parameterized.expand([
        ("valid_delete", {"userEmail": "testuser@example.com"}, 200, {"message": "Post deleted successfully"}),
        ("missing_fields", {"userEmail": ""}, 400, {"message": "User email is required"}),
        ("post_not_found", {"userEmail": "testuser@example.com"}, 404, {"message": "Post not found"}),
        ("user_not_found", {"userEmail": "nonexistent@example.com"}, 404, {"message": "User not found"}),
        ("unauthorized_delete", {"userEmail": "wronguser@example.com"}, 403, {"message": "You are not authorized to delete this post"})
    ])
    @patch('requests.delete')
    def test_delete_post(self, name, payload, expected_status, expected_response, mock_delete):
        mock_delete.return_value.status_code = expected_status
        mock_delete.return_value.json.return_value = expected_response

        response = requests.delete(f"{self.base_url}/delete/{name}", json=payload)

        self.assertEqual(response.status_code, expected_status)
        self.assertEqual(response.json(), expected_response)

if __name__ == '__main__':
    unittest.main()
