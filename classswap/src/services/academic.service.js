import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const academicService = {
  async getDepartments() {
    const res = await api.get(API_ENDPOINTS.academic.departments);
    return res.data;
  },

  async getPrograms() {
    const res = await api.get(API_ENDPOINTS.academic.programs);
    return res.data;
  },

  async getSemesters() {
    const res = await api.get(API_ENDPOINTS.academic.semesters);
    return res.data;
  },

  async getCourses() {
    const res = await api.get(API_ENDPOINTS.academic.courses);
    return res.data;
  },

  async getCourseSlots(courseId) {
    const res = await api.get(API_ENDPOINTS.academic.courseSlots(courseId));
    return res.data;
  },

  async getSlots() {
    try {
      const res = await api.get("/slots");
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },
};
