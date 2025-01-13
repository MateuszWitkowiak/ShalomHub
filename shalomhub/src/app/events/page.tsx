"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DefaultLayout from "../components/DefaultLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventList from "./components/EventList";
import EventForm from "./components/EventForm";
import EventModal from "./components/EventModal";
import { Event } from "./types";

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
      event.preventDefault();
      handleCreateEvent();
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

    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      toast.error("Please fill all the fields to create an event.", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
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
      toast.success("Created new event!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
      })
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Failed to create Event", {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
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
        <EventForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleCreateEvent={handleCreateEvent}
          handleKeyPress={handleKeyPress}
        />
        <EventList
          events={events}
          toggleAttendEvent={toggleAttendEvent}
          openParticipantsModal={openParticipantsModal}
        />
      </div>
      {showModal && (
        <EventModal
          attendees={eventParticipants}
          closeModal={closeModal}
        />
      )}
    </DefaultLayout>
  );
}
