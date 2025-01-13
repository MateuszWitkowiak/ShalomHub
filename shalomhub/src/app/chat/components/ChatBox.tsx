import { Message } from "./types";

interface ChatBoxProps {
  messages: Message[];
  userId: string;
  formatTime: (timestamp: string) => string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, userId, formatTime }) => {
  return (
    <div className="h-[80vh] overflow-y-auto bg-gray-50 rounded-xl p-6 space-y-4 shadow-inner">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === userId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-4 max-w-[70%] rounded-xl text-sm ${
              message.sender === userId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p>{message.text}</p>
            <small className="block text-xs text-blue-400 mt-1">
              {formatTime(message.timestamp)}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
