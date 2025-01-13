import { EventFormProps } from "./types";
const EventForm: React.FC<EventFormProps> = ({
  newEvent,
  setNewEvent,
  handleCreateEvent,
  handleKeyPress,
}) => (
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
);

export default EventForm;
