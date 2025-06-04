import { useState, useEffect } from "react";
import { dashboardService } from "../services/api";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeThisMonth: 0,
    totalHours: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await dashboardService.getStats();
      console.log({ statsData });
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      name: "Tổng Nhân Viên",
      value: stats.totalEmployees,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      name: "Đã Chấm Công Tháng Này",
      value: stats.activeThisMonth,
      icon: "✅",
      color: "bg-green-500",
    },
    {
      name: "Tổng Giờ Làm Việc",
      value: `${stats.totalHours}h`,
      icon: "⏱️",
      color: "bg-purple-500",
    },
    {
      name: "Phòng Ban",
      value: stats.departments,
      icon: "🏢",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div
              className={`${stat.color} rounded-full p-3 text-white text-xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
