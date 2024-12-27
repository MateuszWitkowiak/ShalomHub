"use client";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function AddPost() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleAddPost = async () => {
    if (!email) {
      toast.error("User is not logged in");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/posts/add", {
        description,
        email,
      });

      toast.success("Post added successfully");
      console.log(response.data);
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      toast.error("Failed to add post");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <Header />
        <div className="border border-gray-300 rounded-md p-6 m-5 h-[calc(100vh-7rem)] overflow-hidden">
          <h1 className="text-4xl font-semibold text-gray-700 text-center mb-6">Add New Post</h1>
          
          <div className="mt-5">
            <textarea
              className="w-full h-36 p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Enter your description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          {description && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddPost}
                className="bg-primary text-white font-semibold rounded-lg px-8 py-3 shadow-md hover:bg-primary-dark transition-all"
              >
                Add Post
              </button>
            </div>
          )}
        </div>
      </ProtectedRoute>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </DefaultLayout>
  );
}
