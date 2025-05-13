import React, { useState } from "react";
import { EventListProps } from "../types";
import DeleteModal from "./EventDeleteModal";

const EventList: React.FC<EventListProps> = ({
  events,
  toggleAttendEvent,
  openParticipantsModal,
  handleDeleteButton,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const userEmail = localStorage.getItem("userEmail");

  const openDeleteModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedEventId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedEventId) {
      handleDeleteButton(selectedEventId);
    }
    closeDeleteModal();
  };
  

  return (
    <>
      <ul className="space-y-4">
        {events.map((event) => {
          const isCreator = event.createdBy === userEmail;
          return (
            <li key={event._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>
                Attendees: {event.attendees.length}
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
                  event.attendees.includes(userEmail || "")
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {event.attendees.includes(userEmail || "")
                  ? "Cancel Attendance"
                  : "Attend"}
              </button>
              {isCreator && (
                <button
                  onClick={() => openDeleteModal(event._id)}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default EventList;
