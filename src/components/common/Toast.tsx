import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAvatarName } from "@/utils/helper";

interface ToastProps {
  message: string;
  link?: string;
  onClose: () => void;
  duration?: number;
  senderName?: string;
  senderAvatar?: string;
}

const MAX_MESSAGE_LENGTH = 100;

const Toast: React.FC<ToastProps> = ({ message, link, onClose, duration = 5000, senderName, senderAvatar }) => {
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

  // Determine what to show as the message
  let displayMessage = message && typeof message === 'string' ? message.trim() : '';
  // If message is empty or only whitespace, show 'Document'
  if (!displayMessage) {
    displayMessage = 'Document';
  }
  // Truncate if too long
  if (displayMessage.length > MAX_MESSAGE_LENGTH) {
    displayMessage = displayMessage.slice(0, MAX_MESSAGE_LENGTH) + '...';
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#fff",
        color: "#000",
        padding: "18px 28px 18px 20px",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
        cursor: link ? "pointer" : "default",
        zIndex: 9999,
        minWidth: 260,
        maxWidth: 350,
        fontSize: 15,
        transition: "opacity 0.3s",
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
      role="alert"
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute',
          top: 10,
          right: 14,
          background: 'transparent',
          border: 'none',
          color: '#888',
          fontSize: 20,
          cursor: 'pointer',
          zIndex: 10000,
          padding: 0,
          lineHeight: 1,
        }}
        aria-label="Close notification"
      >
        &times;
      </button>
      {senderAvatar ? (
        <img
          src={senderAvatar}
          alt={senderName || 'Avatar'}
          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 0, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
        />
      ) : senderName ? (
        <span
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--base)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 20,
            marginRight: 0,
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
          }}
        >
          {getAvatarName(senderName, true)}
        </span>
      ) : null}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
        {senderName && (
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 2,
              color: '#181818',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {senderName}
          </div>
        )}
        <div
          style={{
            fontWeight: 400,
            fontSize: 15,
            color: '#444',
            lineHeight: 1.4,
            wordBreak: 'break-word',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginTop: senderName ? 2 : 0,
          }}
        >
          {displayMessage}
        </div>
      </div>
    </div>
  );
};

export default Toast; 