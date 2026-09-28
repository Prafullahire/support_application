const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function toQueryString(params?: Record<string, string | undefined>) {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  return search.toString();
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getToken()}`;
        response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      } else {
        this.clearTokens();
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      const message = Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, file: File, extra?: Record<string, string>) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => formData.append(k, v));
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json() as Promise<T>;
  }
}

export const api = new ApiClient();

// Auth
export const authApi = {
  login: (emailOrPhone: string, password: string) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      emailOrPhone,
      password,
    }),
  register: (data: RegisterData) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', data),
  profile: () => api.get<User>('/auth/profile'),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
  registerBranches: () =>
    api.get<Array<{ id: string; name: string; code: string }>>('/auth/register/branches'),
  registerOfficeLocations: (branchId?: string) => {
    const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : '';
    return api.get<Array<{ id: string; name: string; branchId: string }>>(
      `/auth/register/office-locations${query}`,
    );
  },
};

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OFFICE_BOY';
  branchId?: string;
  departmentId?: string;
  employeeId?: string;
  officeLocationId?: string;
  joiningDate?: string;
  leavingDate?: string;
  address?: string;
  branch?: { id: string; name: string; code: string };
  department?: { id: string; name: string };
  officeLocation?: {
    id: string;
    name: string;
    latitude?: number;
    longitude?: number;
    allowedRadiusMeters?: number;
  };
}

export interface RegisterData {
  emailOrPhone: string;
  password: string;
  firstName: string;
  lastName: string;
  branchId?: string;
  officeLocationId?: string;
  joiningDate?: string;
  leavingDate?: string;
  address?: string;
}

// Module APIs
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard'),
};

export const branchesApi = {
  list: () => api.get<Branch[]>('/branches'),
  get: (id: string) => api.get<Branch>(`/branches/${id}`),
  create: (data: Partial<Branch>) => api.post<Branch>('/branches', data),
  update: (id: string, data: Partial<Branch>) => api.put<Branch>(`/branches/${id}`, data),
  delete: (id: string) => api.delete(`/branches/${id}`),
};

export const usersApi = {
  list: () => api.get<User[]>('/users'),
  create: (data: Record<string, unknown>) => api.post<User>('/users', data),
  update: (id: string, data: Record<string, unknown>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const departmentsApi = {
  list: () => api.get<Department[]>('/departments'),
  create: (data: Partial<Department>) => api.post<Department>('/departments', data),
  update: (id: string, data: Partial<Department>) => api.put<Department>(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

export const vendorsApi = {
  list: () => api.get<Vendor[]>('/vendors'),
  create: (data: Partial<Vendor>) => api.post<Vendor>('/vendors', data),
  update: (id: string, data: Partial<Vendor>) => api.put<Vendor>(`/vendors/${id}`, data),
  delete: (id: string) => api.delete(`/vendors/${id}`),
};

export const requestsApi = {
  list: () => api.get<RequestItem[]>('/requests'),
  get: (id: string) => api.get<RequestItem>(`/requests/${id}`),
  create: (data: Partial<RequestItem>) => api.post<RequestItem>('/requests', data),
  update: (id: string, data: Partial<RequestItem>) => api.put<RequestItem>(`/requests/${id}`, data),
  assign: (id: string, assignedToId: string) =>
    api.put<RequestItem>(`/requests/${id}/assign`, { assignedToId }),
  delete: (id: string) => api.delete(`/requests/${id}`),
};

export const courierApi = {
  list: () => api.get<CourierRequest[]>('/courier'),
  get: (id: string) => api.get<CourierRequest>(`/courier/${id}`),
  create: (data: Partial<CourierRequest>) => api.post<CourierRequest>('/courier', data),
  update: (id: string, data: Partial<CourierRequest>) => api.put<CourierRequest>(`/courier/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch<CourierRequest>(`/courier/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/courier/${id}`),
};

export const assetsApi = {
  list: () => api.get<Asset[]>('/assets'),
  get: (id: string) => api.get<Asset>(`/assets/${id}`),
  categories: () => api.get<AssetCategory[]>('/assets/categories'),
  create: (data: Partial<Asset>) => api.post<Asset>('/assets', data),
  update: (id: string, data: Partial<Asset>) => api.put<Asset>(`/assets/${id}`, data),
  assign: (id: string, userId: string) => api.post(`/assets/${id}/assign`, { userId }),
  return: (id: string, condition?: string) => api.post(`/assets/${id}/return`, { condition }),
  delete: (id: string) => api.delete(`/assets/${id}`),
};

export const entitiesApi = {
  list: () => api.get<Entity[]>('/entities'),
  get: (id: string) => api.get<Entity>(`/entities/${id}`),
  create: (data: Partial<Entity>) => api.post<Entity>('/entities', data),
  update: (id: string, data: Partial<Entity>) => api.put<Entity>(`/entities/${id}`, data),
  delete: (id: string) => api.delete(`/entities/${id}`),
};

export interface ExpenseFilters {
  entityId?: string;
  branchId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'expenseDate' | 'amount' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const expensesApi = {
  list: (filters?: ExpenseFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    const query = params.toString();
    return api.get<Expense[]>(`/expenses${query ? `?${query}` : ''}`);
  },
  summary: (filters?: ExpenseFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    const query = params.toString();
    return api.get<ExpenseSummary>(`/expenses/summary${query ? `?${query}` : ''}`);
  },
  get: (id: string) => api.get<Expense>(`/expenses/${id}`),
  categories: () => api.get<ExpenseCategory[]>('/expenses/categories'),
  create: (data: Partial<Expense>) => api.post<Expense>('/expenses', data),
  update: (id: string, data: Partial<Expense>) => api.put<Expense>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

export const joiningKitApi = {
  items: () => api.get('/joining-kit/items'),
  stock: () => api.get('/joining-kit/stock'),
  issues: () => api.get('/joining-kit/issues'),
  issue: (data: Record<string, unknown>) => api.post('/joining-kit/issue', data),
  returnKit: (id: string, data: Record<string, unknown>) => api.post(`/joining-kit/issues/${id}/return`, data),
  updateItem: (id: string, data: Record<string, unknown>) => api.put(`/joining-kit/items/${id}`, data),
};

export const idCardsApi = {
  list: () => api.get<IdCard[]>('/id-cards'),
  get: (id: string) => api.get<IdCard>(`/id-cards/${id}`),
  create: (data: Partial<IdCard>) => api.post<IdCard>('/id-cards', data),
  update: (id: string, data: Partial<IdCard>) => api.put<IdCard>(`/id-cards/${id}`, data),
  assign: (id: string, userId: string) => api.patch(`/id-cards/${id}/assign`, { userId }),
  unassign: (id: string) => api.patch(`/id-cards/${id}/unassign`),
  delete: (id: string) => api.delete(`/id-cards/${id}`),
};

export const amcApi = {
  list: () => api.get<AmcRecord[]>('/amc'),
  get: (id: string) => api.get<AmcRecord>(`/amc/${id}`),
  expiring: () => api.get<AmcRecord[]>('/amc/expiring'),
  create: (data: Partial<AmcRecord>) => api.post<AmcRecord>('/amc', data),
  update: (id: string, data: Partial<AmcRecord>) => api.put<AmcRecord>(`/amc/${id}`, data),
  delete: (id: string) => api.delete(`/amc/${id}`),
};

export const seatingApi = {
  list: () => api.get<SeatingRecord[]>('/seating'),
  get: (id: string) => api.get<SeatingRecord>(`/seating/${id}`),
  create: (data: Partial<SeatingRecord>) => api.post<SeatingRecord>('/seating', data),
  update: (id: string, data: Partial<SeatingRecord>) => api.put<SeatingRecord>(`/seating/${id}`, data),
  delete: (id: string) => api.delete(`/seating/${id}`),
};

export const brochuresApi = {
  stock: () => api.get<BrochureStock[]>('/brochures/stock'),
  getStock: (id: string) => api.get<BrochureStock>(`/brochures/stock/${id}`),
  createStock: (data: Partial<BrochureStock>) => api.post<BrochureStock>('/brochures/stock', data),
  updateStock: (id: string, data: Partial<BrochureStock>) => api.put<BrochureStock>(`/brochures/stock/${id}`, data),
  deleteStock: (id: string) => api.delete(`/brochures/stock/${id}`),
  issue: (data: Record<string, unknown>) => api.post('/brochures/issue', data),
};

export const pgRecordsApi = {
  list: () => api.get<PgRecord[]>('/pg-records'),
  get: (id: string) => api.get<PgRecord>(`/pg-records/${id}`),
  create: (data: Partial<PgRecord>) => api.post<PgRecord>('/pg-records', data),
  update: (id: string, data: Partial<PgRecord>) => api.put<PgRecord>(`/pg-records/${id}`, data),
  delete: (id: string) => api.delete(`/pg-records/${id}`),
};

export const notificationsApi = {
  list: () => api.get<Notification[]>('/notifications'),
  unreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const auditLogsApi = {
  list: () => api.get<AuditLog[]>('/audit-logs'),
};

export const reportsApi = {
  dashboard: (params?: { entityId?: string; branchId?: string; startDate?: string; endDate?: string }) => {
    const query = toQueryString(params);
    return api.get(`/reports/dashboard${query ? `?${query}` : ''}`);
  },
  expenseSummary: (params?: { entityId?: string; branchId?: string; startDate?: string; endDate?: string }) => {
    const query = toQueryString(params);
    return api.get<ExpenseSummary>(`/reports/expenses/summary${query ? `?${query}` : ''}`);
  },
  export: (module: string, params?: Record<string, string>) => {
    const query = toQueryString(params);
    return `${API_URL}/reports/export?module=${module}${query ? `&${query}` : ''}`;
  },
};

export const importsApi = {
  upload: async (file: File, module: string, branchId?: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const formData = new FormData();
    formData.append('file', file);
    const params = new URLSearchParams({ module });
    if (branchId) params.set('branchId', branchId);
    const response = await fetch(`${API_URL}/imports/upload?${params}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Import failed' }));
      throw new Error(error.message);
    }
    return response.json();
  },
  jobs: () => api.get('/imports'),
};

// Entity types
export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  branchId?: string;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
}

export interface RequestItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  branchId?: string;
  createdById: string;
  assignedToId?: string;
  createdAt: string;
  createdBy?: User;
  assignedTo?: User;
  branch?: Branch;
}

export interface CourierRequest {
  id: string;
  requestNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  recipientName?: string;
  status: string;
  trackingNumber?: string;
  vendorId?: string;
  branchId?: string;
  pickupDate?: string;
  deliveryDate?: string;
  createdAt: string;
  vendor?: Vendor;
  branch?: Branch;
  createdBy?: User;
}

export interface Asset {
  id: string;
  name: string;
  serialNumber?: string;
  status: string;
  categoryId?: string;
  branchId?: string;
  employeeCode?: string;
  employeeName?: string;
  location?: string;
  assignedDate?: string;
  category?: AssetCategory;
  branch?: Branch;
}

export interface AssetCategory {
  id: string;
  name: string;
}

export interface Entity {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  expenseDate: string;
  categoryId?: string;
  vendorId?: string;
  entityId?: string;
  branchId?: string;
  category?: ExpenseCategory;
  vendor?: Vendor;
  entity?: Entity;
  branch?: Branch;
  createdBy?: User;
  invoiceUrl?: string;
}

export interface ExpenseSummaryItem {
  entityId?: string;
  entityName?: string;
  branchId?: string;
  branchName?: string;
  total: number;
  count: number;
  branches?: { branchId: string; branchName: string; total: number; count: number }[];
}

export interface ExpenseSummary {
  grandTotal: number;
  totalCount: number;
  entityWise: ExpenseSummaryItem[];
  branchWise: ExpenseSummaryItem[];
  allEntities?: Entity[];
  allBranches?: Branch[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
}

export interface IdCard {
  id: string;
  cardNumber: string;
  isAvailable: boolean;
  assignedToId?: string;
  assignedTo?: User;
  branch?: Branch;
}

export interface AmcRecord {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  amount?: number;
  vendor?: Vendor;
  branch?: Branch;
  emailNotification?: boolean;
  documentUrl?: string;
}

export interface SeatingRecord {
  id: string;
  floor: string;
  zone?: string;
  totalSeats: number;
  occupiedSeats: number;
  recordDate: string;
  branchId?: string;
  branch?: Branch;
}

export interface BrochureStock {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  branch?: Branch;
}

export interface PgRecord {
  id: string;
  employeeName: string;
  raisedBy?: string;
  location?: string;
  address: string;
  rentAmount: number;
  agreementStart: string;
  agreementEnd: string;
  contactPhone?: string;
  fileAttachment?: string;
  reminderDays?: number;
  status: string;
  notes?: string;
  branch?: Branch;
  createdAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  recordId?: string;
  details?: string;
  createdAt: string;
  user?: User;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalAssets: number;
  availableAssets: number;
  totalExpenses: number;
  expiringAmc: number;
  lowStockItems: number;
  unreadNotifications: number;
}

export interface OfficeLocation {
  id: string;
  name: string;
  branchId: string;
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number;
  isActive: boolean;
  branch?: { id: string; name: string; code: string };
  _count?: { assignedUsers: number };
}

export interface OfficeBoyStaff extends User {
  isActive: boolean;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: string;
  attendanceDate: string;
  loginTime: string | null;
  logoutTime: string | null;
  loginDistanceMeters: number | null;
  logoutDistanceMeters: number | null;
  workingDurationMinutes: number | null;
  totalWorkingMinutes?: number | null;
  workingDurationFormatted: string | null;
  status: string;
  statusLabel?: string | null;
  isLate?: boolean;
  lateReason?: string | null;
  isEarlyLeave?: boolean;
  earlyLeaveReason?: string | null;
  isSessionActive: boolean;
  loginPhotoUrl?: string | null;
  logoutPhotoUrl?: string | null;
  isDayComplete?: boolean;
  canSignInAgain?: boolean;
  approvedCorrectionType?: string | null;
  correctionRequest?: {
    id: string;
    requestType: string;
    requestTypeLabel: string;
    comments: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminNotes?: string | null;
    createdAt: string;
  } | null;
  branch: { id: string; name: string };
  location: { id: string; name: string };
  staffName?: string;
  staffEmployeeId?: string;
  staffEmail?: string;
  staffPhone?: string | null;
}

export interface OfficeBoyDashboard {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    branch: { id: string; name: string };
    officeLocation: { id: string; name: string; allowedRadiusMeters: number };
  };
  todayAttendance: AttendanceRecord | null;
  history: AttendanceRecord[];
  isLoggedIn: boolean;
}

export const officeLocationsApi = {
  list: (branchId?: string) => {
    const query = toQueryString({ branchId });
    return api.get<OfficeLocation[]>(`/office-locations${query ? `?${query}` : ''}`);
  },
  get: (id: string) => api.get<OfficeLocation>(`/office-locations/${id}`),
  create: (data: Partial<OfficeLocation>) => api.post<OfficeLocation>('/office-locations', data),
  update: (id: string, data: Partial<OfficeLocation>) =>
    api.put<OfficeLocation>(`/office-locations/${id}`, data),
  delete: (id: string) => api.delete(`/office-locations/${id}`),
};

export const officeBoyStaffApi = {
  list: (branchId?: string) => {
    const query = toQueryString({ branchId });
    return api.get<OfficeBoyStaff[]>(`/office-boy-staff${query ? `?${query}` : ''}`);
  },
  get: (id: string) => api.get<OfficeBoyStaff>(`/office-boy-staff/${id}`),
  create: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    branchId: string;
    isActive?: boolean;
  }) => api.post<OfficeBoyStaff>('/office-boy-staff', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<OfficeBoyStaff>(`/office-boy-staff/${id}`, data),
  delete: (id: string) => api.delete(`/office-boy-staff/${id}`),
};

export const attendanceApi = {
  officeBoyLogin: (data: {
    loginId: string;
    password: string;
    latitude: number;
    longitude: number;
    deviceInfo?: string;
  }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string; attendance: AttendanceRecord | null }>(
      '/attendance/office-boy/login',
      data,
    ),
  checkIn: (data: {
    latitude: number;
    longitude: number;
    deviceInfo?: string;
    lateReason?: string;
    photo?: string;
  }) => api.post<{ attendance: AttendanceRecord }>('/attendance/office-boy/check-in', data),
  logout: (data: {
    latitude: number;
    longitude: number;
    deviceInfo?: string;
    earlyLeaveReason?: string;
    photo?: string;
  }) =>
    api.post<{ message: string; attendance: AttendanceRecord }>(
      '/attendance/office-boy/logout',
      data,
    ),
  dashboard: () => api.get<OfficeBoyDashboard>('/attendance/office-boy/dashboard'),
  history: (params?: Record<string, string | undefined>) => {
    const query = toQueryString(params);
    return api.get<AttendanceRecord[]>(`/attendance/office-boy/history${query ? `?${query}` : ''}`);
  },
  listAll: (params?: Record<string, string | undefined>) => {
    const query = toQueryString(params);
    return api.get<AttendanceRecord[]>(`/attendance${query ? `?${query}` : ''}`);
  },
  activityLogs: (userId?: string) => {
    const query = toQueryString({ userId });
    return api.get<unknown[]>(`/attendance/activity-logs${query ? `?${query}` : ''}`);
  },
};

export interface AttendanceCorrectionRequest {
  id: string;
  attendanceId: string;
  userId: string;
  requestType: string;
  requestTypeLabel: string;
  comments: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  staffName?: string;
  staffEmployeeId?: string | null;
  staffPhone?: string | null;
  attendance?: {
    id: string;
    attendanceDate: string;
    loginTime: string | null;
    logoutTime: string | null;
    workingDurationMinutes: number | null;
    status: string;
    branch?: { id: string; name: string };
    location?: { id: string; name: string };
  };
  reviewedBy?: { id: string; firstName: string; lastName: string } | null;
}

export const attendanceCorrectionsApi = {
  create: (data: { attendanceId: string; requestType: string; comments: string }) =>
    api.post<AttendanceCorrectionRequest>('/attendance/corrections', data),
  myRequests: () => api.get<AttendanceCorrectionRequest[]>('/attendance/corrections/my'),
  get: (id: string) => api.get<AttendanceCorrectionRequest>(`/attendance/corrections/${id}`),
  listAll: (status?: string) => {
    const query = toQueryString({ status });
    return api.get<AttendanceCorrectionRequest[]>(
      `/attendance/corrections${query ? `?${query}` : ''}`,
    );
  },
  approve: (id: string, adminNotes?: string) =>
    api.patch<AttendanceCorrectionRequest>(`/attendance/corrections/${id}/approve`, {
      adminNotes,
    }),
  reject: (id: string, adminNotes?: string) =>
    api.patch<AttendanceCorrectionRequest>(`/attendance/corrections/${id}/reject`, {
      adminNotes,
    }),
};

// ─── Attachments / Uploads ───────────────────────────────────────────────────

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: number;
  module: string;
  recordId: string;
  uploadedBy?: string;
  cloudinaryPublicId?: string;
  createdAt: string;
}

export const uploadsApi = {
  /**
   * Upload a file to a specific module record.
   * @param file      The File object from an <input type="file">
   * @param module    The module name, e.g. 'expenses', 'requests', 'amc'
   * @param recordId  The ID of the record this file belongs to
   */
  upload: (file: File, module: string, recordId: string) =>
    api.upload<Attachment>(`/uploads?module=${encodeURIComponent(module)}&recordId=${encodeURIComponent(recordId)}`, file),

  /**
   * Fetch all attachments for a given module + record.
   */
  listByRecord: (module: string, recordId: string) =>
    api.get<Attachment[]>(`/uploads?module=${encodeURIComponent(module)}&recordId=${encodeURIComponent(recordId)}`),

  /**
   * Delete an attachment (removes from Cloudinary + DB).
   */
  delete: (id: string) => api.delete<{ success: boolean }>(`/uploads/${id}`),
};
