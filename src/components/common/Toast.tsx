import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ToastProps {
  message: string;
  link?: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, link, onClose, duration = 5000 }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
    onClose();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#fff",
        color: "#000",
        padding: "16px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        cursor: link ? "pointer" : "default",
        zIndex: 9999,
        minWidth: 240,
        maxWidth: 320,
        fontSize: 16,
        transition: "opacity 0.3s",
      }}
      role="alert"
      tabIndex={0}
    >
      {message}
    </div>
  );
};

export default Toast; 