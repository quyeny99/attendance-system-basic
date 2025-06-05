import { useState } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  recordsPerPage,
  showQuickJumper = true,
}) => {
  const [jumpPage, setJumpPage] = useState("");

  // Tạo array các trang cần hiển thị
  const getVisiblePages = () => {
    // eslint-disable-next-line no-unused-vars
    const delta = 2; // Số trang hiển thị ở mỗi bên trang hiện tại
    const range = [];
    const rangeWithDots = [];

    // Nếu tổng số trang <= 7, hiển thị tất cả
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Luôn có trang 1
    if (currentPage <= 3) {
      // Nếu đang ở gần đầu: 1, 2, 3, 4, ..., last
      for (let i = 1; i <= Math.min(4, totalPages - 1); i++) {
        rangeWithDots.push(i);
      }
      if (totalPages > 4) {
        rangeWithDots.push("...");
        rangeWithDots.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Nếu đang ở gần cuối: 1, ..., last-3, last-2, last-1, last
      rangeWithDots.push(1);
      if (totalPages > 4) {
        rangeWithDots.push("...");
      }
      for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      // Ở giữa: 1, ..., current-1, current, current+1, ..., last
      rangeWithDots.push(1);
      rangeWithDots.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...");
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleQuickJump = (e) => {
    e.preventDefault();
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  const visiblePages = getVisiblePages();
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Thông tin bản ghi */}
      <div className="text-sm text-gray-500">
        Hiển thị <span className="font-medium">{startRecord}</span> -{" "}
        <span className="font-medium">{endRecord}</span> trong tổng số{" "}
        <span className="font-medium">{totalRecords}</span> bản ghi
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Quick Jump */}
        {showQuickJumper && totalPages > 10 && (
          <form onSubmit={handleQuickJump} className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Đến trang:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="..."
            />
            <button
              type="submit"
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Đi
            </button>
          </form>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-2 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-500">
          Trang <span className="font-medium">{currentPage}</span> /{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
