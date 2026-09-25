import { request } from "@/services/api";

export const timetableService = {
  async getMyTimetable() {
    return request("timetable.get", "GET", "/students/me/timetable");
  },
  async getStudentTimetable(studentId) {
    return request("timetable.getStudent", "GET", `/admin/students/${studentId}/timetable`);
  },
  async getSlotCatalog() {
    return request("timetable.catalog", "GET", "/admin/slots");
  },
};
