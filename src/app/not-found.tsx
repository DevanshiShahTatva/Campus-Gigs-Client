import { Home, Search } from "lucide-react";
import Link from "next/link";

const NotFound = () => {

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
              <Search className="w-8 h-8 text-teal-600" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
