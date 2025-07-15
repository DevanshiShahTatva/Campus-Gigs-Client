import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical, FiEdit3, FiTrash2 } from "react-icons/fi";

interface MessageDropdownProps {
  msg: any;
  showDropdown: number | null;
  setShowDropdown: (id: number | null) => void;
  handleEditMessage: (id: number, text: string) => void;
  promptDeleteMessage: (id: number) => void;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({
  msg,
  showDropdown,
  setShowDropdown,
  handleEditMessage,
  promptDeleteMessage,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showDropdown !== msg.id) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, msg.id, setShowDropdown]);

  useEffect(() => {
    if (showDropdown === msg.id && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.right - 120 + window.scrollX,
      });
    }
  }, [showDropdown, msg.id]);

  const handleDropdownClick = () => {
    setShowDropdown(showDropdown === msg.id ? null : msg.id);
  };

  const DropdownMenu = () => {
    if (showDropdown !== msg.id) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
        }}
      >
        <button
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => handleEditMessage(msg.id, msg.text)}
        >
          <FiEdit3 className="w-4 h-4" />
          Edit
        </button>
        <button
          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            promptDeleteMessage(msg.id);
          }}
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </button>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          ref={buttonRef}
          className="p-1 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          onClick={handleDropdownClick}
          aria-label="Message options"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>
      <DropdownMenu />
    </>
  );
};

export default MessageDropdown;