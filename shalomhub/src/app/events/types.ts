export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    attendees: string[];
}

export interface EventListProps {
  events: Event[];
  toggleAttendEvent: (eventId: string) => void;
  openParticipantsModal: (attendees: string[]) => void;
}

export interface EventModalProps {
  attendees: string[];
  closeModal: () => void;
}

export interface EventFormProps {
  newEvent: {
    title: string;
    description: string;
    date: string;
    location: string;
  };
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
  handleCreateEvent: () => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}
