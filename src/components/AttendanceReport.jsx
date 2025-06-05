import { useState, useEffect, useMemo } from "react";
import { attendanceService, employeeService } from "../services/api";

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 10;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadFilteredAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedEmployee,
    selectedDate,
    selectedMonth,
    selectedYear,
    currentPage,
  ]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const employeeData = await employeeService.getAllEmployeesNoPagination();
      setEmployees(employeeData.filter((emp) => emp.role !== "admin"));
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredAttendance = async () => {
    try {
      setLoading(true);
      const filters = {};

      if (selectedEmployee) filters.employeeId = selectedEmployee;
      if (selectedDate) filters.date = selectedDate;
      else {
        if (selectedMonth) filters.month = selectedMonth;
        if (selectedYear) filters.year = selectedYear;
      }

      const result = await attendanceService.getFilteredAttendance(
        filters,
        currentPage,
        recordsPerPage
      );
      setAttendanceData(result.data);
      setTotalRecords(result.total);
    } catch (error) {
      console.error("Error loading filtered attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Handler functions với reset page
  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Clear month/year khi chọn ngày cụ thể
    if (date) {
      setSelectedMonth("");
      setSelectedYear("");
    }
    setCurrentPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // Clear ngày cụ thể khi chọn tháng
    if (month) {
      setSelectedDate("");
    }
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Clear ngày cụ thể khi chọn năm
    if (year) {
      setSelectedDate("");
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedEmployee("");
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  // Format functions
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkOut) return "Đang làm việc";
    const diff = Math.floor(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60)
    );
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}p`;
  };

  // Statistics cho trang hiện tại
  const stats = useMemo(() => {
    const completedRecords = attendanceData.filter(
      (record) => record.check_out
    ).length;
    const totalHours = attendanceData.reduce((acc, record) => {
      if (record.check_out) {
        const hours =
          (new Date(record.check_out) - new Date(record.check_in)) /
          (1000 * 60 * 60);
        return acc + hours;
      }
      return acc;
    }, 0);

    return {
      totalRecords,
      completedRecords,
      totalHours: Math.round(totalHours * 10) / 10,
    };
  }, [attendanceData, totalRecords]);

  const months = [
    { value: "", label: "Tất cả tháng" },
    { value: "01", label: "Tháng 1" },
    { value: "02", label: "Tháng 2" },
    { value: "03", label: "Tháng 3" },
    { value: "04", label: "Tháng 4" },
    { value: "05", label: "Tháng 5" },
    { value: "06", label: "Tháng 6" },
    { value: "07", label: "Tháng 7" },
    { value: "08", label: "Tháng 8" },
    { value: "09", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  const years = [
    { value: "", label: "Tất cả năm" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Báo Cáo Chấm Công</h3>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng: {totalRecords} bản ghi
          </p>
        </div>

        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2">
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Xuất Excel</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Filter theo nhân viên */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhân viên
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              >
                <option value="">Tất cả nhân viên</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter theo ngày cụ thể */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày cụ thể
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              />
            </div>

            {/* Filter theo tháng */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                disabled={!!selectedDate}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white disabled:bg-gray-100"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter theo năm */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                disabled={!!selectedDate}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white disabled:bg-gray-100"
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút clear filters */}
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Hiển thị filter hiện tại */}
        {(selectedEmployee ||
          selectedDate ||
          selectedMonth ||
          selectedYear) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Đang lọc theo:</span>
              {selectedEmployee && (
                <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                  {
                    employees.find(
                      (emp) => emp.id === parseInt(selectedEmployee)
                    )?.name
                  }
                </span>
              )}
              {selectedDate && (
                <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                  {formatDate(selectedDate)}
                </span>
              )}
              {selectedMonth && !selectedDate && (
                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                  {months.find((m) => m.value === selectedMonth)?.label}
                </span>
              )}
              {selectedYear && !selectedDate && (
                <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                  Năm {selectedYear}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Thống kê nhanh */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600">Tổng bản ghi</div>
            <div className="text-2xl font-bold text-blue-700">
              {stats.totalRecords}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600">Hoàn thành (trang này)</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.completedRecords}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600">Tổng giờ (trang này)</div>
            <div className="text-2xl font-bold text-purple-700">
              {stats.totalHours}h
            </div>
          </div>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Nhân viên</th>
              <th className="px-4 py-3">Phòng ban</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Check In</th>
              <th className="px-4 py-3">Check Out</th>
              <th className="px-4 py-3">Thời gian làm việc</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="bg-white border-b border-gray-100">
                  <td colSpan="8" className="px-4 py-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : attendanceData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu chấm công phù hợp với bộ lọc
                </td>
              </tr>
            ) : (
              attendanceData.map((record, index) => (
                <tr
                  key={record.id}
                  className="bg-white border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-700">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {record.employees?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {record.employees?.department || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(record.check_in)}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {formatTime(record.check_in)}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    {record.check_out ? formatTime(record.check_out) : "--:--"}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">
                    {calculateDuration(record.check_in, record.check_out)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        record.check_out
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {record.check_out ? "Hoàn thành" : "Đang làm việc"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * recordsPerPage + 1} -{" "}
            {Math.min(currentPage * recordsPerPage, totalRecords)}
            trong tổng số {totalRecords} bản ghi
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Trước
            </button>

            {/* Page numbers */}
            {(() => {
              const delta = 2;
              const range = [];
              const rangeWithDots = [];

              for (
                let i = Math.max(2, currentPage - delta);
                i <= Math.min(totalPages - 1, currentPage + delta);
                i++
              ) {
                range.push(i);
              }

              if (currentPage - delta > 2) {
                rangeWithDots.push(1, "...");
              } else {
                rangeWithDots.push(1);
              }

              rangeWithDots.push(...range);

              if (currentPage + delta < totalPages - 1) {
                rangeWithDots.push("...", totalPages);
              } else {
                rangeWithDots.push(totalPages);
              }

              return rangeWithDots.map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-2 text-sm text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            {/* Next button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
