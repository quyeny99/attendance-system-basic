import { useState, useEffect } from "react";
import { employeeService } from "../services/api";

const UserManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    role: "employee",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data.filter((emp) => emp.role !== "admin"));
    } catch (error) {
      console.error("Error loading employees:", error);
      alert("Có lỗi xảy ra khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSubmitting(true);
      await employeeService.createEmployee(formData);
      await loadEmployees();
      setShowAddForm(false);
      setFormData({
        name: "",
        email: "",
        position: "",
        department: "",
        role: "employee",
        password: "",
      });
      alert("Thêm nhân viên thành công");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Có lỗi xảy ra khi thêm nhân viên");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setFormData(user);
  };

  const handleUpdateUser = async () => {
    if (!formData.name || !formData.email) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSubmitting(true);
      await employeeService.updateEmployee(editingUser, formData);
      await loadEmployees();
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        position: "",
        department: "",
        role: "employee",
        password: "",
      });
      alert("Cập nhật nhân viên thành công");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Có lỗi xảy ra khi cập nhật nhân viên");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      return;
    }

    try {
      await employeeService.deleteEmployee(userId);
      await loadEmployees();
      alert("Xóa nhân viên thành công");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Có lỗi xảy ra khi xóa nhân viên");
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      position: "",
      department: "",
      role: "employee",
      password: "",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Quản Lý Nhân Viên</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Thêm Nhân Viên
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingUser) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-4 text-gray-800">
            {editingUser ? "Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ tên *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Chức vụ"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Phòng ban"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            >
              <option value="employee">Nhân viên</option>
              <option value="manager">Quản lý</option>
            </select>
            <input
              type="password"
              placeholder={
                editingUser ? "Mật khẩu (để trống nếu không đổi)" : "Mật khẩu *"
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="px-3 py-2 text-base border border-gray-300 rounded-lg bg-white"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              disabled={submitting}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {submitting ? "Đang xử lý..." : editingUser ? "Cập nhật" : "Thêm"}
            </button>
            <button
              onClick={resetForm}
              disabled={submitting}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Chức vụ</th>
              <th className="px-4 py-3">Phòng ban</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="bg-white border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {employee.name}
                </td>
                <td className="px-4 py-3 text-gray-700">{employee.email}</td>
                <td className="px-4 py-3 text-gray-700">{employee.position}</td>
                <td className="px-4 py-3 text-gray-700">
                  {employee.department}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      employee.role === "manager"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {employee.role === "manager" ? "Quản lý" : "Nhân viên"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(employee)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(employee.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có nhân viên nào
        </div>
      )}
    </div>
  );
};

export default UserManagement;
