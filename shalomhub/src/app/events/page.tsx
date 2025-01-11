"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [eventParticipants, setEventParticipants] = useState<string[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/events");
      const validEvents = response.data.filter((event: Event) => new Date(event.date) >= new Date());
      setEvents(validEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleCreateEvent()
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to create an event.");
      return;
    }

    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      toast.error("Please fill all the fields to create an event.", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      })
      return;
    }

    if (new Date(newEvent.date) < new Date()) {
      toast.error("You can't create an event with date in the past", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/events", {
        ...newEvent,
        createdBy: userEmail,
      });
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ title: "", description: "", date: "", location: "" });
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Failed to create Event", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      })
    }
  };

  const toggleAttendEvent = async (eventId: string) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to manage your attendance.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/events/${eventId}/attend`,
        { userId: userEmail }
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees: response.data.attendees } : event
        )
      );
    } catch (err) {
      console.error("Error managing attendance:", err);
      alert("Failed to update attendance.");
    }
  };

  const isUserAttending = (event: Event) => {
    const userEmail = localStorage.getItem("userEmail");
    return event.attendees.includes(userEmail || "");
  };

  const openParticipantsModal = (attendees: string[]) => {
    setEventParticipants(attendees);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <DefaultLayout>
      <ToastContainer />
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-bold mb-6">Events</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onKeyDown={handleKeyPress}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onKeyDown={handleKeyPress}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <input
              type="date"
              value={newEvent.date}
              onKeyDown={handleKeyPress}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onKeyDown={handleKeyPress}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <button
              onClick={handleCreateEvent}
              className="px-6 py-3 bg-blue-500 text-white rounded-md"
            >
              Create Event
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">All Events</h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Attendees: {event.attendees.length}
                <button
                  onClick={() => openParticipantsModal(event.attendees)}
                  className="ml-2 text-blue-500 underline"
                >
                  View Attendees
                </button>
              </p>
              <button
                onClick={() => toggleAttendEvent(event._id)}
                className={`mt-4 px-4 py-2 rounded-md ${
                  isUserAttending(event) ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {isUserAttending(event) ? "Cancel Attendance" : "Attend"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Event Participants</h2>
            <ul className="space-y-4">
              {eventParticipants.map((participant, index) => (
                <li key={index} className="flex justify-between">
                  <span>{participant}</span>
                  <a href={`/userProfile/${participant}`} className="text-blue-500">
                    Go to profile
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}