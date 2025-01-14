import { useState } from "react";
import { Post } from "../types";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditModalProps {
  postToEdit: Post | null;
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const EditModal: React.FC<EditModalProps> = ({ postToEdit, setEditModalVisible, setPosts }) => {
  const [description, setDescription] = useState(postToEdit?.description || "");

  const handleSaveEdit = async () => {
    if (!postToEdit) return;

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please log in to save edits");
      return;
    }

    if (description === "") {
      toast.error("Post must have description!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/posts/edit/${postToEdit._id}`, {
        description,
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
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Error editing post, try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  return (
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mt-4"
          rows={4}
        ></textarea>
        <button
          onClick={handleSaveEdit}
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditModal;
