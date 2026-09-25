import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const studentService = {
  async getProfile() {
    const res = await api.get(API_ENDPOINTS.student.profile);
    return res.data;
  },

  async getTimetable() {
    try {
      const res = await api.get(API_ENDPOINTS.student.timetable);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },
};
