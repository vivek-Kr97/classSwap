import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";

export const swapService = {
  async checkSwap(currentSlotId, desiredSlotId) {
    try {
      const res = await api.post(API_ENDPOINTS.swaps.check, { currentSlotId, desiredSlotId });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async createSwapRequest({ currentSlotId, desiredSlotId, reason }) {
    try {
      const res = await api.post(API_ENDPOINTS.swaps.create, {
        currentSlotId,
        desiredSlotId,
        reason,
      });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getOpenSwaps(params = {}) {
    try {
      const res = await api.get(API_ENDPOINTS.swaps.open, { params });
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async getMySwaps() {
    try {
      const res = await api.get(API_ENDPOINTS.swaps.mine);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async acceptSwap(id) {
    try {
      const res = await api.post(API_ENDPOINTS.swaps.accept(id));
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async cancelSwap(id) {
    try {
      const res = await api.post(API_ENDPOINTS.swaps.cancel(id));
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },
};
