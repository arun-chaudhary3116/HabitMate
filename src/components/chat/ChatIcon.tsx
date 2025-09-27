import { MessageSquare } from "lucide-react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import ChatInterface from "./ChatInterface";

interface ChatIconComponentProps {
  isVerified: boolean;
}

const ChatIconComponent: React.FC<ChatIconComponentProps> = ({
  isVerified,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  if (!isVerified) return null;

  return (
    <Draggable
      nodeRef={dragRef}
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }} // starts bottom-right
    >
      <div
        ref={dragRef}
        className="fixed z-50 flex flex-col items-end"
        style={{ bottom: 16, right: 16 }}
      >
        {/* Chat window above icon */}
        {isOpen && (
          <div className="mb-2 w-80 h-96 bg-white shadow-xl rounded-lg p-4 flex flex-col">
            <ChatInterface />
          </div>
        )}

        {/* Icon (draggable handle) */}
        <div
          className="drag-handle bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageSquare size={24} />
        </div>
      </div>
    </Draggable>
  );
};

export default ChatIconComponent;
