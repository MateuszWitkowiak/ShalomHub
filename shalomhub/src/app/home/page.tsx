"use client";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";
import SearchBar from "./components/searchbar";
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  description: string;
  userId: { email: string };
  createdAt: string;
  comments: Comment[];
  likesCount: number;
  likedBy: string[];
}

export default function Homepage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3001/api/posts/getAll");
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
    setLoading(false);
  }, []);

  const handleLike = async (postId: string) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please log in to like posts");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/like/${postId}`,
        { userEmail }
      );
      const updatedPost = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string, text: string) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Make sure you're logged in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/comment/${postId}`,
        { userId: userEmail, text }
      );
      const updatedPost = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );

      setCommentText("");
      if (commentInputRef.current) {
        commentInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const toggleModal = (postId: string) => {
    if (selectedPostId === postId) {
      setShowModal(!showModal);
    } else {
      setSelectedPostId(postId);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        handleComment(selectedPostId!, commentText);
      }
    }
  };

  const handleKeyPressEdit = (event: React.KeyboardEvent, description: string) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSaveEdit(description)
    }
  }

  const handleEdit = (postId: string, newDescription: string) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to edit posts");
      return;
    }

    setPostToEdit(posts.find(post => post._id === postId) || null);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (newDescription: string) => {
    if (!postToEdit) return;

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please log in to save edits");
      return;
    }

    if (newDescription === "") {
      toast.error("Post must have description!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true
      })
      return;
    }
    setLoading(true)
    try {
      const response = await axios.put(`http://localhost:3001/api/posts/edit/${postToEdit._id}`, {
        description: newDescription,
        userEmail,
      });

      const updatedPost = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      toast.success("Post successfully edited!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      })
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Error editing post, try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      })
    }
    setLoading(false)
  };

  const handleDelete = async (postId: string) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please log in to delete posts");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/posts/delete/${postId}`, {
        data: { userEmail },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      toast.success("Post deleted succesfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true
      })
    } catch (error) {
      toast.error("Error deleting post.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true
      })
      console.log(error)
    }
  };

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <ToastContainer />
        <Header />  
        <SearchBar />
        <div className="p-5">
          {loading && <Loader />}
          <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">Posts</h1>

          <div
            className="border-2 border-gray-300 p-6 rounded-lg mt-10 bg-white shadow-lg"
            style={{
              minHeight: `calc(100vh - 13rem)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-md transition-all transform hover:scale-105 hover:shadow-xl"
                  onClick={() => toggleModal(post._id)}
                >
                  <h2 className="text-xl font-semibold text-gray-700">
                    <Link href={post.userId.email === localStorage.getItem("userEmail") ? "/profile" : `/userProfile/${post.userId.email}`}>
                      {post.userId.email || "Anonymous"}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mt-2">{post.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted on: {new Date(post.createdAt).toLocaleString()}
                  </p>

                  <button
                    className={`font-semibold mr-3 ${post.likedBy?.includes(localStorage.getItem("userId") || "")
                      ? "text-red-500"
                      : "text-gray-500"
                      } transition-all hover:text-red-600`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                  >
                    🔥 {post.likesCount}
                  </button>

                  {post.userId.email === localStorage.getItem("userEmail") && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post._id, post.description);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showModal && selectedPostId && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800 transition-all"
                >
                  ×
                </button>
                {posts.find(post => post._id === selectedPostId) ? (
                  <>
                   <h2 className="text-xl font-semibold">
                      <Link 
                        href={
                          posts.find(post => post._id === selectedPostId)?.userId.email === localStorage.getItem("userEmail") 
                            ? "/profile" 
                            : `/userProfile/${posts.find(post => post._id === selectedPostId)?.userId.email}`
                        }
                      >
                        {posts.find(post => post._id === selectedPostId)?.userId.email || "Anonymous"}
                      </Link>
                    </h2>
                    <p className="text-gray-600">{posts.find(post => post._id === selectedPostId)?.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on: {new Date(posts.find(post => post._id === selectedPostId)?.createdAt || "").toLocaleString()}
                    </p>

                    <div className="mt-4 max-h-[300px] overflow-y-auto">
                      <h3 className="font-semibold text-gray-700">Comments:</h3>
                      {posts
                        .find((post) => post._id === selectedPostId)
                        ?.comments.map((comment, index) => (
                          <div key={index} className="p-2 mt-2 bg-gray-100 rounded-md shadow-sm">
                            <p className="font-semibold">
                              <Link href={comment.userId === localStorage.getItem("userEmail") ? "/profile" : `/userProfile/${comment.userId}`}>
                                {comment.userId}
                              </Link>
                            </p>
                            <p>{comment.text}</p>
                            <p className="text-sm text-gray-500">
                              Posted on: {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </div>

                    <div className="mt-4">
                      <textarea
                        ref={commentInputRef}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Write a comment..."
                      ></textarea>
                      <button
                        onClick={() => {
                          if (commentText.trim()) {
                            handleComment(selectedPostId, commentText);
                          }
                        }}
                        className="mt-2 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
                      >
                        Post Comment
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Post not found.</p>
                )}
              </div>
            </div>
          )}

          {editModalVisible && postToEdit && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setEditModalVisible(false);
                }
              }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800 transition-all"
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold">Edit Post</h2>
                <textarea
                  defaultValue={postToEdit.description}
                  className="w-full p-2 border border-gray-300 rounded-md mt-4"
                  rows={4}
                  onChange={(e) => setPostToEdit(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  onKeyDown={(event) => {
                    handleKeyPressEdit(event, postToEdit.description)
                  }}
                ></textarea>
                <button
                  onClick={() => handleSaveEdit(postToEdit.description)}
                  className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
}
