import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const facultyService = {
  async getPendingSwaps() {
    try {
      const res = await api.get(API_ENDPOINTS.faculty.pending);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getSwapHistory() {
    try {
      const res = await api.get(API_ENDPOINTS.faculty.history);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async approveSwap(id, comment) {
    try {
      const res = await api.post(API_ENDPOINTS.faculty.approve(id), { comment });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async rejectSwap(id, comment) {
    try {
      const res = await api.post(API_ENDPOINTS.faculty.reject(id), { comment });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },
};
