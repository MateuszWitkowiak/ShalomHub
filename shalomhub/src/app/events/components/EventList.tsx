import { EventListProps } from "../types";
const EventList: React.FC<EventListProps> = ({
  events,
  toggleAttendEvent,
  openParticipantsModal,
}) => (
  <ul className="space-y-4">
    {events.map((event) => (
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
            event.attendees.includes(localStorage.getItem("userEmail") || "")
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {event.attendees.includes(localStorage.getItem("userEmail") || "")
            ? "Cancel Attendance"
            : "Attend"}
        </button>
      </li>
    ))}
  </ul>
);

export default EventList;
