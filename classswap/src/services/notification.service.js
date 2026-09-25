import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const notificationService = {
  async getNotifications() {
    try {
      const res = await api.get(API_ENDPOINTS.notifications.list);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async markAsRead(id) {
    try {
      const res = await api.patch(API_ENDPOINTS.notifications.read(id));
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async markAllAsRead() {
    try {
      const res = await api.patch(API_ENDPOINTS.notifications.readAll);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },
};
