"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { Friend, Message } from "./types";
import FriendList from "./components/FriendList";
import ChatBox from "./components/ChatBox";
import MessageInput from "./components/MessageInput";

const socket = io("http://localhost:3001");

export default function Chat() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Połączono z socket.io");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userEmail) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/profile", {
          params: { email: userEmail },
        });
        setFriends(response.data.friends || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchFriends();
  }, [userEmail, router]);

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/chat/messages/${roomId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    createRoom(userEmail!, friend.email);
  };

  const createRoom = async (user1: string, user2: string) => {
    try {
      const response = await axios.post("http://localhost:3001/api/chat/rooms", { user1, user2 });
      setRoomId(response.data._id);
      fetchMessages(response.data._id);
      socket.emit("joinRoom", response.data._id);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!selectedFriend || !newMessage || !userId || !roomId) {
      return;
    }

    const messageData = {
      roomId,
      text: newMessage,
      senderId: userId,
      receiverId: selectedFriend._id,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/chat/sendMessage", messageData);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((message) => message._id === response.data._id);
        if (messageExists) {
          return prevMessages;
        }
        return [...prevMessages, response.data];
      });

      fetchMessages(roomId);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((message) => message._id === newMessage._id);
        if (messageExists) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Header />
        <div className="w-full h-screen bg-gradient-to-tl from-[#e0f7fa] to-[#0288d1]">
          <div className="flex h-full">
            <FriendList friends={friends} onFriendClick={handleFriendClick} />
            <div className="w-3/4 bg-white p-8 shadow-xl rounded-lg m-4 flex flex-col">
              {selectedFriend ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">
                      {selectedFriend.firstName} {selectedFriend.lastName}
                    </h2>
                  </div>
                  <ChatBox
                    messages={messages}
                    userId={userId!}
                    formatTime={formatTime}
                  />
                  <div ref={chatEndRef} />
                  <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    sendMessage={sendMessage}
                    handleKeyPress={handleKeyPress}
                  />
                </>
              ) : (
                <div className="text-center text-gray-600">Select a friend to start a conversation.</div>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </ProtectedRoute>
  );
}
