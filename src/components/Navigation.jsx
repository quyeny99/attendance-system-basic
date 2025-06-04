import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    {
      path: "/",
      name: "Chấm Công",
      icon: "⏰",
      roles: ["admin", "manager", "employee"],
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "📊",
      roles: ["admin", "manager"],
    },
  ];

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6">
        {/* User Info */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Xin chào, {user.name}!
          </h1>
          <p className="text-gray-600">
            {user.position} - {user.department}
            {user.role === "admin" && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Admin
              </span>
            )}
            {user.role === "manager" && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Manager
              </span>
            )}
          </p>
        </div>

        {/* Navigation & Logout */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          {/* Navigation Menu */}
          <div className="flex space-x-2">
            {visibleItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
