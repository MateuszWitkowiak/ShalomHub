import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/profile/searchUsers", {
        params: { query: value },
      });
      setResults(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (email: string) => {
    router.push(`/userProfile/${email}`);
  };

  return (
    <div className="relative max-w-xl mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for users..."
        className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
      />
      {loading && <p className="absolute top-full mt-2 text-gray-500">Loading...</p>}
      {results.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user.email)}
              className="p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out"
            >
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {results.length === 0 && query && !loading && (
        <p className="absolute top-full mt-2 text-gray-400">No results found</p>
      )}
    </div>
  );
}
