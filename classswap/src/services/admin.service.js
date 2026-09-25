import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await api.get(API_ENDPOINTS.admin.dashboard);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getAllSwaps(params = {}) {
    try {
      const res = await api.get(API_ENDPOINTS.admin.swaps, { params });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getAuditLogs(params = {}) {
    try {
      const res = await api.get(API_ENDPOINTS.admin.auditLogs, { params });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getSwapRules() {
    try {
      const res = await api.get(API_ENDPOINTS.admin.swapRules);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createDepartment(data) {
    try {
      const res = await api.post(API_ENDPOINTS.admin.departments, data);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createProgram(data) {
    try {
      const res = await api.post(API_ENDPOINTS.admin.programs, data);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createCourse(data) {
    try {
      const res = await api.post(API_ENDPOINTS.admin.courses, data);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createSlot(data) {
    try {
      const res = await api.post(API_ENDPOINTS.admin.slots, data);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createSwapRule(data) {
    try {
      const res = await api.post(API_ENDPOINTS.admin.swapRules, data);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },
};
