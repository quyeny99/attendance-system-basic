import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import DashboardStats from "../components/DashboardStats";
import UserManagement from "../components/UserManagement";
import AttendanceReport from "../components/AttendanceReport";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !["admin", "manager"].includes(user.role))) {
      navigate(user ? "/" : "/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!user || !["admin", "manager"].includes(user.role)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Navigation />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Quản Lý
        </h2>
        <p className="text-gray-600">Quản lý nhân viên và theo dõi chấm công</p>
      </div>

      {/* Statistics */}
      <DashboardStats />

      {/* User Management - Chỉ admin mới thấy */}
      {user.role === "admin" && (
        <div className="mb-8">
          <UserManagement />
        </div>
      )}

      {/* Attendance Report */}
      <AttendanceReport />
    </div>
  );
};

export default DashboardPage;
