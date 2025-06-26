"use client"
interface AIButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
  }
  
const AIButton: React.FC<AIButtonProps> = ({
    children,
    onClick,
    loading = false,
    disabled = false,
    className = "",
  }) => {
    return (
      <button
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        className={`mt-2 px-5 py-1 relative overflow-hidden rounded-lg font-semibold bg-gradient-to-r from-[#cf005a] to-[#f002bc] text-white shadow transition-transform duration-200 flex items-center gap-2 shine-btn ${
          (disabled || loading) ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        } ${className}`}
      >
        <span className="relative z-10">
          {loading ? "Generating with AI... ✨" : children}
        </span>
        <span className={disabled ? "" : `shine-effect`} />
      </button>
    );
  };
  
  export { AIButton };  