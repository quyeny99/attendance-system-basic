import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { attendanceService } from "../services/api";
import Navigation from "../components/Navigation";
import Clock from "../components/Clock";

const HomePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadTodayAttendance();
      checkCurrentStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTodayAttendance = async () => {
    try {
      const records = await attendanceService.getTodayAttendance(user.id);
      setAttendanceRecords(
        records.map((record) => ({
          ...record,
          checkIn: new Date(record.check_in),
          checkOut: record.check_out ? new Date(record.check_out) : null,
        }))
      );
    } catch (error) {
      console.error("Error loading today attendance:", error);
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const latestRecord = await attendanceService.getLatestAttendanceToday(
        user.id
      );
      if (latestRecord) {
        setIsCheckedIn(true);
        setCurrentRecord(latestRecord);
        setLastCheckIn(new Date(latestRecord.check_in));
      }
    } catch (error) {
      console.error("Error checking current status:", error);
    }
  };

  // Tính toán tổng thời gian làm việc
  const calculateTotalWorkTime = useCallback(() => {
    let total = 0;
    attendanceRecords.forEach((record) => {
      if (record.checkOut) {
        total += Math.floor((record.checkOut - record.checkIn) / (1000 * 60));
      } else if (record.checkIn) {
        total += Math.floor((new Date() - record.checkIn) / (1000 * 60));
      }
    });
    setTotalWorkTime(total);
  }, [attendanceRecords]);

  // Cập nhật tổng thời gian mỗi phút
  useEffect(() => {
    calculateTotalWorkTime();
    const interval = setInterval(calculateTotalWorkTime, 60000);
    return () => clearInterval(interval);
  }, [calculateTotalWorkTime]);

  // Xử lý Check In
  const handleCheckIn = async () => {
    setIsProcessing(true);

    try {
      const newRecord = await attendanceService.checkIn(user.id);
      setIsCheckedIn(true);
      setCurrentRecord(newRecord);
      const checkInTime = new Date(newRecord.check_in);
      setLastCheckIn(checkInTime);

      // Reload today's attendance
      await loadTodayAttendance();
    } catch (error) {
      console.error("Error checking in:", error);
      alert("Có lỗi xảy ra khi chấm công vào");
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý Check Out
  const handleCheckOut = async () => {
    if (!currentRecord) return;

    setIsProcessing(true);

    try {
      await attendanceService.checkOut(currentRecord.id);
      setIsCheckedIn(false);
      setCurrentRecord(null);

      // Reload today's attendance
      await loadTodayAttendance();
    } catch (error) {
      console.error("Error checking out:", error);
      alert("Có lỗi xảy ra khi chấm công ra");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}p`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkOut) return "Đang làm việc";
    const diff = Math.floor((checkOut - checkIn) / (1000 * 60));
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}p`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Navigation />

      <Clock />

      {/* Status Card */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Trạng Thái Hiện Tại
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isCheckedIn ? "bg-green-500 status-indicator" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-gray-700">
              {isCheckedIn ? "Đang làm việc" : "Chưa chấm công"}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Tổng thời gian hôm nay</div>
            <div className="font-bold text-primary">
              {formatDuration(totalWorkTime)}
            </div>
          </div>
        </div>
        {lastCheckIn && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Lần check-in cuối: {lastCheckIn.toLocaleTimeString("vi-VN")}
            </div>
          </div>
        )}
      </div>

      {/* Attendance Button */}
      <div className="text-center mb-8">
        {!isCheckedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isProcessing}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors duration-300 shadow-lg"
          >
            {isProcessing ? "Đang xử lý..." : "✓ Check In"}
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            disabled={isProcessing}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors duration-300 shadow-lg"
          >
            {isProcessing ? "Đang xử lý..." : "✗ Check Out"}
          </button>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Lịch Sử Chấm Công Hôm Nay
        </h3>
        {attendanceRecords.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Chưa có dữ liệu chấm công
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceRecords.map((record, index) => (
              <div
                key={index}
                className="attendance-card bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex space-x-6">
                    <div>
                      <div className="text-sm text-gray-500">Check In</div>
                      <div className="font-semibold text-green-600">
                        {formatTime(record.checkIn)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Check Out</div>
                      <div className="font-semibold text-red-600">
                        {record.checkOut
                          ? formatTime(record.checkOut)
                          : "--:--"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Thời gian</div>
                    <div className="font-bold text-primary">
                      {calculateDuration(record.checkIn, record.checkOut)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>© 2024 Hệ Thống Chấm Công - Powered by React & Supabase</p>
      </div>
    </div>
  );
};

export default HomePage;
