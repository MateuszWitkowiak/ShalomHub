"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";

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

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/events");
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please log in to create an event.");
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
      alert("Failed to create event.");
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

  return (
    <DefaultLayout>
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
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.location}
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
              <p>Attendees: {event.attendees.length}</p>
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
    </DefaultLayout>
  );
}
