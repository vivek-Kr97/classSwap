import { api } from "./api/axios";
import { API_ENDPOINTS } from "./api/endpoints";
import { clearTokens, setAccessToken, setRefreshToken } from "./api/token";

const DEMO_CREDENTIALS = {
  student1: { email: "ravi.k@univ.edu", password: "Password123!" },
  student2: { email: "priya.s@univ.edu", password: "Password123!" },
  faculty: { email: "dr.mehta@univ.edu", password: "Password123!" },
  admin: { email: "admin@univ.edu", password: "Password123!" },
};

export const DEMO_ACCOUNTS = [
  { key: "student1", label: "Sign in as Ravi Kumar", meta: "STU001 · MCA · Batch A" },
  { key: "student2", label: "Sign in as Priya Sharma", meta: "STU002 · MCA · Batch B" },
  { key: "faculty", label: "Sign in as Dr. Mehta", meta: "FAC001 · 4 courses" },
  { key: "admin", label: "Sign in as Admin User", meta: "ADM001 · System owner" },
];

export const authService = {
  async registerStudent(data) {
    const res = await api.post(API_ENDPOINTS.auth.registerStudent, data);
    return res.data;
  },

  async login(credentialsOrKey) {
    let payload;
    if (typeof credentialsOrKey === "string" && DEMO_CREDENTIALS[credentialsOrKey]) {
      payload = DEMO_CREDENTIALS[credentialsOrKey];
    } else if (typeof credentialsOrKey === "object") {
      payload = credentialsOrKey;
    } else {
      payload = DEMO_CREDENTIALS.student1;
    }

    try {
      const res = await api.post(API_ENDPOINTS.auth.login, payload);
      const data = res.data?.data;
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      if (data?.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      return { ok: true, data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || err.message || "Failed to log in",
      };
    }
  },

  async me() {
    try {
      const res = await api.get(API_ENDPOINTS.auth.me);
      return { ok: true, data: res.data?.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  },

  async logout() {
    try {
      await api.post(API_ENDPOINTS.auth.logout);
    } catch {
      /* ignore */
    } finally {
      clearTokens();
    }
    return { ok: true };
  },
};
