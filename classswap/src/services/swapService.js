import { request } from "@/services/api";

export const swapService = {
  async getOpenSwaps() {
    return request("swaps.getOpen", "GET", "/swaps/open");
  },

  async getMySwaps() {
    return request("swaps.getMy", "GET", "/swaps/me");
  },

  async getPendingFacultySwaps() {
    return request("faculty.getPending", "GET", "/faculty/swaps/pending");
  },

  async getFacultySwapHistory() {
    return request("faculty.getHistory", "GET", "/faculty/swaps/history");
  },

  async getAllAdminSwaps() {
    return request("admin.getSwaps", "GET", "/admin/swaps");
  },

  async checkSwap(currentSlotId, desiredSlotId) {
    return request("swaps.check", "POST", "/swaps/check", { currentSlotId, desiredSlotId });
  },

  async createSwapRequest({ courseId, currentSlotId, desiredSlotId, reason }) {
    return request("swaps.create", "POST", "/swaps", {
      courseId,
      currentSlotId,
      desiredSlotId,
      reason,
    });
  },

  async acceptSwap(swapId) {
    return request("swaps.accept", "POST", `/swaps/${swapId}/accept`);
  },

  async cancelSwap(swapId) {
    return request("swaps.cancel", "POST", `/swaps/${swapId}/cancel`);
  },

  async approveSwap(swapId, comment) {
    return request("faculty.approve", "POST", `/faculty/swaps/${swapId}/approve`, { comment });
  },

  async rejectSwap(swapId, comment) {
    return request("faculty.reject", "POST", `/faculty/swaps/${swapId}/reject`, { comment });
  },

  async getAuditLogs() {
    return request("admin.auditLogs", "GET", "/admin/audit-logs");
  },

  async getNotifications() {
    return request("notifications.get", "GET", "/notifications");
  },

  async markNotificationRead(id) {
    return request("notifications.read", "PATCH", `/notifications/${id}/read`);
  },

  async markAllNotificationsRead() {
    return request("notifications.readAll", "PATCH", "/notifications/read-all");
  },

  async getAdminDashboardStats() {
    return request("admin.dashboard", "GET", "/admin/dashboard");
  },

  async getSwapRules() {
    return request("admin.rules", "GET", "/admin/swap-rules");
  },
};
