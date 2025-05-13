"use client";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";
import SearchBar from "./components/searchbar";
import axios from "axios";
import Link from "next/link";
import { Post } from "./types"
import DeleteModal from "./components/deleteModal";
import EditModal from "./components/editModal";
import { ToastContainer} from 'react-toastify';
import CommentModal from "./components/CommentModal";
import 'react-toastify/dist/ReactToastify.css';

export default function Homepage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

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
      alert("Please log in to comment on posts");
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

  const handleEdit = (postId: string) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to edit posts");
      return;
    }

    setPostToEdit(posts.find(post => post._id === postId) || null);
    setEditModalVisible(true);
  };

  const openDeleteModal = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalVisible(true);
  };
    
  return (
    <DefaultLayout>
      <ProtectedRoute>
        <ToastContainer />
        <Header />  
        <SearchBar />
        <div className="p-5 bg-white">
          {loading && <Loader />}
          <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">Posts</h1>

          <div
            className="border-2 border-gray-300 p-6 rounded-lg mt-10 bg-white shadow-lg"
            style={{
              minHeight: `calc(100vh - 13rem)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-md transition-all transform hover:scale-105 hover:shadow-xl"
                  onClick={() => toggleModal(post._id)}
                >
                  <h2 className="text-xl font-semibold text-gray-700">
                    <Link href={post.userId.email === localStorage.getItem("userEmail") ? "/profile" : `/userProfile/${post.userId.email}`}>
                      {post.userId.email}
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
                          handleEdit(post._id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(post);
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
            <CommentModal
              post={posts.find((post) => post._id === selectedPostId)!}
              onClose={closeModal}
              onComment={handleComment}
              commentText={commentText}
              setCommentText={setCommentText}
            />
      )}


          {editModalVisible && postToEdit && (
            <EditModal
              postToEdit={postToEdit}
              setEditModalVisible={setEditModalVisible}
              setPosts={setPosts}
            />
          )}

          {deleteModalVisible && postToDelete && (
            <DeleteModal
              postToDelete={postToDelete}
              setDeleteModalVisible={setDeleteModalVisible}
              setPosts={setPosts}
            />
          )}
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
}
