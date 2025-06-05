import { supabase } from '../utils/supabaseClient';

// // Employee Services
// export const employeeService = {
//   async getAllEmployees() {
//     const { data, error } = await supabase
//       .from('employees')
//       .select('*')
//       .order('id');
    
//     if (error) throw error;
//     return data;
//   },

//   async getEmployeeById(id) {
//     const { data, error } = await supabase
//       .from('employees')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async login(employeeId, password) {
//     const { data, error } = await supabase
//       .from('employees')
//       .select('*')
//       .eq('id', employeeId)
//       .eq('password', password)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async createEmployee(employeeData) {
//     const { data, error } = await supabase
//       .from('employees')
//       .insert([employeeData])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async updateEmployee(id, employeeData) {
//     const { data, error } = await supabase
//       .from('employees')
//       .update(employeeData)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async deleteEmployee(id) {
//     const { error } = await supabase
//       .from('employees')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//     return true;
//   }
// };

// // Attendance Services
// export const attendanceService = {

//   async getPaginatedAttendanceRecords({ page = 1, pageSize = 10 } = {}) {
//   const from = (page - 1) * pageSize;
//   const to = from + pageSize - 1;

//   const { data, error, count } = await supabase
//     .from('attendance_records')
//     .select(`
//       *,
//       employees (
//         id,
//         name,
//         department,
//         position
//       )
//     `, { count: 'exact' })
//     .order('check_in', { ascending: false })
//     .range(from, to);

//   if (error) throw error;

//   return {
//     data,
//     total: count,
//     page,
//     pageSize,
//     totalPages: Math.ceil(count / pageSize),
//   };
// },
//   async getAllAttendanceRecords() {
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .select(`
//         *,
//         employees (
//           id,
//           name,
//           department,
//           position
//         )
//       `)
//       .order('check_in', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getAttendanceByEmployee(employeeId) {
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .select('*')
//       .eq('employee_id', employeeId)
//       .order('check_in', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getAttendanceByDate(date) {
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .select(`
//         *,
//         employees (
//           id,
//           name,
//           department,
//           position
//         )
//       `)
//       .eq('date', date)
//       .order('check_in', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getFilteredAttendance(filters = {}) {
//     let query = supabase
//       .from('attendance_records')
//       .select(`
//         *,
//         employees (
//           id,
//           name,
//           department,
//           position
//         )
//       `);

//     if (filters.employeeId) {
//       query = query.eq('employee_id', filters.employeeId);
//     }

//     if (filters.month && filters.year) {
//       // Fix: Tính đúng ngày cuối tháng
//       const year = parseInt(filters.year);
//       const month = parseInt(filters.month);
//       const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
//       const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Ngày cuối tháng
//       query = query.gte('date', startDate).lte('date', endDate);
//     } else if (filters.year) {
//       const startDate = `${filters.year}-01-01`;
//       const endDate = `${filters.year}-12-31`;
//       query = query.gte('date', startDate).lte('date', endDate);
//     }

//     query = query.order('check_in', { ascending: false });

//     const { data, error } = await query;
    
//     if (error) throw error;
//     return data;
//   },

//   async checkIn(employeeId) {
//     const now = new Date();
//     const today = now.toISOString().split('T')[0];
    
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .insert([{
//         employee_id: employeeId,
//         check_in: now.toISOString(),
//         date: today
//       }])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async checkOut(recordId) {
//     const now = new Date();
    
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .update({ 
//         check_out: now.toISOString(),
//         updated_at: now.toISOString()
//       })
//       .eq('id', recordId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getLatestAttendanceToday(employeeId) {
//     const today = new Date().toISOString().split('T')[0];
    
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .select('*')
//       .eq('employee_id', employeeId)
//       .eq('date', today)
//       .is('check_out', null)
//       .order('check_in', { ascending: false })
//       .limit(1);
    
//     if (error) throw error;
//     return data[0] || null;
//   },

//   async getTodayAttendance(employeeId) {
//     const today = new Date().toISOString().split('T')[0];
    
//     const { data, error } = await supabase
//       .from('attendance_records')
//       .select('*')
//       .eq('employee_id', employeeId)
//       .eq('date', today)
//       .order('check_in', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   }
// };

// // Dashboard Services (Fix date range bug)
// export const dashboardService = {
//   async getStats() {
//     try {
//       // Đếm tổng nhân viên (không bao gồm admin)
//       const { count: totalEmployees, error: employeeError } = await supabase
//         .from('employees')
//         .select('*', { count: 'exact', head: true })
//         .neq('role', 'admin');

//       if (employeeError) throw employeeError;

//       // Đếm nhân viên đã chấm công trong tháng hiện tại
//       const now = new Date();
//       const currentMonth = now.getMonth() + 1;
//       const currentYear = now.getFullYear();
      
//       // Fix: Tính đúng ngày đầu và cuối tháng
//       const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
//       const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

//       const { data: activeEmployees, error: activeError } = await supabase
//         .from('attendance_records')
//         .select('employee_id')
//         .gte('date', startDate)
//         .lte('date', endDate);

//       if (activeError) throw activeError;

//       const uniqueActiveEmployees = [...new Set(activeEmployees.map(record => record.employee_id))].length;

//       // Tính tổng giờ làm việc
//       const { data: allRecords, error: recordsError } = await supabase
//         .from('attendance_records')
//         .select('check_in, check_out')
//         .not('check_out', 'is', null);

//       if (recordsError) throw recordsError;

//       const totalHours = allRecords.reduce((acc, record) => {
//         const checkIn = new Date(record.check_in);
//         const checkOut = new Date(record.check_out);
//         const hours = (checkOut - checkIn) / (1000 * 60 * 60);
//         return acc + hours;
//       }, 0);

//       // Đếm số phòng ban
//       const { data: departments, error: deptError } = await supabase
//         .from('employees')
//         .select('department')
//         .neq('role', 'admin');

//       if (deptError) throw deptError;

//       const uniqueDepartments = [...new Set(departments.map(emp => emp.department))].length;

//       return {
//         totalEmployees: totalEmployees || 0,
//         activeThisMonth: uniqueActiveEmployees,
//         totalHours: Math.round(totalHours),
//         departments: uniqueDepartments
//       };
//     } catch (error) {
//       console.error('Error getting stats:', error);
//       throw error;
//     }
//   }
// };

// Employee Services
export const employeeService = {
  async getAllEmployees(page = 1, limit = 100) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .order('id')
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return { data, total: count };
  },

  async getAllEmployeesNoPagination() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data;
  },

  async getEmployeeById(id) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async login(employeeId, password) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .eq('password', password)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createEmployee(employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateEmployee(id, employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteEmployee(id) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Attendance Services
export const attendanceService = {
  async getAllAttendanceRecords() {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        employees (
          id,
          name,
          department,
          position
        )
      `)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAttendanceByEmployee(employeeId) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAttendanceByDate(date) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        employees (
          id,
          name,
          department,
          position
        )
      `)
      .eq('date', date)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFilteredAttendance(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        employees (
          id,
          name,
          department,
          position
        )
      `, { count: 'exact' });

    // Filter theo nhân viên
    if (filters.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }

    // Filter theo ngày cụ thể
    if (filters.date) {
      query = query.eq('date', filters.date);
    }
    // Filter theo tháng và năm (nếu không có ngày cụ thể)
    else if (filters.month && filters.year) {
      const year = parseInt(filters.year);
      const month = parseInt(filters.month);
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      query = query.gte('date', startDate).lte('date', endDate);
    } 
    // Filter chỉ theo năm
    else if (filters.year) {
      const startDate = `${filters.year}-01-01`;
      const endDate = `${filters.year}-12-31`;
      query = query.gte('date', startDate).lte('date', endDate);
    }

    // Thêm phân trang và sắp xếp
    query = query
      .order('check_in', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data, total: count };
  },

  async checkIn(employeeId) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance_records')
      .insert([{
        employee_id: employeeId,
        check_in: now.toISOString(),
        date: today
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async checkOut(recordId) {
    const now = new Date();
    
    const { data, error } = await supabase
      .from('attendance_records')
      .update({ 
        check_out: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', recordId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLatestAttendanceToday(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .is('check_out', null)
      .order('check_in', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data[0] || null;
  },

  async getTodayAttendance(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Dashboard Services (giữ nguyên)
export const dashboardService = {
  async getStats() {
    try {
      const { count: totalEmployees, error: employeeError } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

      if (employeeError) throw employeeError;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

      const { data: activeEmployees, error: activeError } = await supabase
        .from('attendance_records')
        .select('employee_id')
        .gte('date', startDate)
        .lte('date', endDate);

      if (activeError) throw activeError;

      const uniqueActiveEmployees = [...new Set(activeEmployees.map(record => record.employee_id))].length;

      const { data: allRecords, error: recordsError } = await supabase
        .from('attendance_records')
        .select('check_in, check_out')
        .not('check_out', 'is', null);

      if (recordsError) throw recordsError;

      const totalHours = allRecords.reduce((acc, record) => {
        const checkIn = new Date(record.check_in);
        const checkOut = new Date(record.check_out);
        const hours = (checkOut - checkIn) / (1000 * 60 * 60);
        return acc + hours;
      }, 0);

      const { data: departments, error: deptError } = await supabase
        .from('employees')
        .select('department')
        .neq('role', 'admin');

      if (deptError) throw deptError;

      const uniqueDepartments = [...new Set(departments.map(emp => emp.department))].length;

      return {
        totalEmployees: totalEmployees || 0,
        activeThisMonth: uniqueActiveEmployees,
        totalHours: Math.round(totalHours),
        departments: uniqueDepartments
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
};