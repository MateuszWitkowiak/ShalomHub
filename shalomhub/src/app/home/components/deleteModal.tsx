import { Post } from "../types";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeleteModalProps {
  postToDelete: Post | null;
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ postToDelete, setDeleteModalVisible, setPosts }) => {
  const handleDelete = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please log in to delete posts");
      return;
    }

    try {
      await axios.delete(`https://localhost:3001/api/posts/delete/${postToDelete?._id}`, {
        data: { userEmail },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete?._id));
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      setDeleteModalVisible(false);
    } catch (error) {
      toast.error("Error deleting post.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setDeleteModalVisible(false);
        }
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <button
          onClick={() => setDeleteModalVisible(false)}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800 transition-all"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-center">Delete Post</h2>
        <p className="text-gray-700 text-center mt-4">
          Are you sure you want to delete the post?
        </p>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setDeleteModalVisible(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
