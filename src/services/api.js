// SPORIC / VIT-TEC Frontend API Client Service
// Connects existing React frontend components to backend REST API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('sporic_auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('sporic_auth_token', token);
    } else {
      localStorage.removeItem('sporic_auth_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('sporic_auth_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || data.message || `HTTP ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- Auth APIs ---
  async login(email, password, expectedRole = null) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, expectedRole }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async sendOtp(email, purpose = 'LOGIN') {
    const res = await this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
    return res.data;
  }

  async verifyOtp(email, otp, purpose = 'LOGIN') {
    const res = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, purpose }),
    });
    return res.data;
  }

  async loginWithOtp(email, otp, expectedRole = null) {
    const res = await this.request('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, expectedRole }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async googleLogin(idToken) {
    const res = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async register(registrationData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async getMe() {
    return await this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- Courses & Categories ---
  async getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/courses${query ? `?${query}` : ''}`);
  }

  async getCourseById(courseCodeOrId) {
    return await this.request(`/courses/${courseCodeOrId}`);
  }

  async getCategories(domain) {
    return await this.request(`/categories${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`);
  }

  // --- Payments & Razorpay ---
  async createPaymentOrder(courseId, batchId) {
    return await this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ courseId, batchId }),
    });
  }

  async verifyPayment(paymentDetails) {
    return await this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    });
  }

  // --- Student Learning ---
  async getStudentDashboard() {
    return await this.request('/student/dashboard');
  }

  async getEnrolledCourseContent(courseId) {
    return await this.request(`/student/courses/${courseId}/learn`);
  }

  async completeLesson(lessonId) {
    return await this.request(`/student/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
  }

  // --- Faculty & Funding ---
  async getFundingOpportunities() {
    return await this.request('/funding/opportunities');
  }

  async submitFundingApplication(applicationData) {
    return await this.request('/funding/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // --- Certificates ---
  async verifyCertificate(certificateNumber) {
    return await this.request(`/certificates/verify/${encodeURIComponent(certificateNumber)}`);
  }

  // --- Inquiries ---
  async submitContactInquiry(inquiryData) {
    return await this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // --- Admin ---
  async getAnalytics() {
    return await this.request('/admin/analytics');
  }
}

export const api = new ApiService();
export default api;
