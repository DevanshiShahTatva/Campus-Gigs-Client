import { ImageIcon } from "lucide-react";

export const PlaceholderImage = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="text-center">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No Image</p>
      </div>
    </div>
  );
  