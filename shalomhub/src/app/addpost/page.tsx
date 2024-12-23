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
        router.push("/home")
      }, 2000)
    } catch (error) {
      toast.error("Failed to add post");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <ProtectedRoute>
        <Header />
        <div className="border border-gray-300 rounded-md p-5 m-5 h-[calc(100vh-7rem)] overflow-hidden">
          <h1 className="text-3xl font-semibold text-gray-600 flex justify-center mt-1">
            Add new post
          </h1>
          <div className="mt-5 flex flex-row">
            <textarea
              className="border-dashed border-gray-500 border-2 w-1/2 md:w-full h-24 p-5"
              placeholder="Enter your description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          {description && (
            <div className="flex justify-end mt-5">
              <button
                onClick={handleAddPost}
                className="font-semibold bg-primary text-white px-6 py-2 rounded-md"
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
