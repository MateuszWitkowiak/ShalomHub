"use client";

import React, { useEffect, useState} from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Notification from "./types";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }


    const socketConnection = io("http://localhost:3001");
    setSocket(socketConnection);

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("joinNotificationsRoom", userId);

    socket.on("notification", (notification: Notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, userId]);
  
  const loadNotifications = () => {
    if (loading || !userId) return;

    setLoading(true);

    axios
      .get(`http://localhost:3001/api/posts/notifications`, {
        params: { userId, limit: 10, skip },
      })
      .then((response) => {
        const newNotifications = response.data;

        setNotifications((prev) => [...prev, ...newNotifications]);
        setSkip((prev) => prev + 10);
        if (newNotifications.length < 10) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "message") {
      router.push("/chat");
    } else if (notification.type === "like" || notification.type === "comment") {
      router.push("/home");
    } else if (notification.type === "friendRequest" || notification.type === "friendRequestAccepted") {
      router.push("/profile")
    }
  };


  useEffect(() => {
    loadNotifications();
  }, [userId]);

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-extrabold text-center text-[#0035B9] mb-8">
            Your Notifications
          </h1>
          {notifications.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No notifications available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notifications.map((notification) => (
                <div
                  key={notification?._id ? notification._id : uuidv4()}
                  className="bg-[#4C80E1] p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 duration-300"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-white text-lg font-semibold">{notification?.message}</span>
                  </div>
                  <div className="text-sm text-gray-200">
                    {notification?.createdAt
                      ? new Date(notification.createdAt).toLocaleString()
                      : "Unknown date"}
                  </div>
                </div>
              ))}
            </div>
          )}
          {hasMore && !loading && (
            <button
              onClick={loadNotifications}
              className="mt-6 px-6 py-3 bg-[#0056CC] text-white rounded-full shadow-xl transform transition-all hover:bg-[#0035B9] duration-300"
            >
              Load More
            </button>
          )}
          {loading && (
            <div className="text-center mt-6">
              <div className="spinner-border text-[#0035B9]" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
