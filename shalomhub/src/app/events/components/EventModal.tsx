import { EventModalProps } from "../types";

const EventModal: React.FC<EventModalProps> = ({ attendees, closeModal }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-1/3">
      <h2 className="text-2xl font-semibold mb-4">Event Participants</h2>
      <ul className="space-y-4">
        {attendees.map((participant, index) => (
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
);

export default EventModal;
