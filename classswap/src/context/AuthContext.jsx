import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

function formatUser(u) {
  if (!u) return null;
  const programName = typeof u.programId === "object" ? u.programId?.name || u.programId?.code : (u.program || "MCA");
  const semesterNumber = typeof u.semesterId === "object" ? u.semesterId?.number : (u.semester || 3);
  const courses = u.courses || ["DBMS", "Networks Lab", "Java Programming", "Web Technology Lab"];
  return {
    ...u,
    id: u.id || u._id,
    name: u.fullName || u.name || "User",
    fullName: u.fullName || u.name || "User",
    facultyId: u.employeeId || u.facultyId || "FAC001",
    employeeId: u.employeeId || u.facultyId || "FAC001",
    program: programName || "MCA",
    semester: semesterNumber || 3,
    batch: u.batch || "Batch A",
    courses,
    role: (u.role || "student").toLowerCase(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("classswap_token");
      if (token) {
        const res = await authService.me();
        if (res.ok && res.data?.user) {
          setUser(formatUser(res.data.user));
        } else {
          localStorage.removeItem("classswap_token");
        }
      }
      setReady(true);
    }
    initAuth();
  }, []);

  const login = useCallback(async (accountKeyOrCredentials) => {
    const res = await authService.login(accountKeyOrCredentials);
    if (!res.ok) return res;

    const formattedUser = formatUser(res.data.user);
    setUser(formattedUser);
    return { ok: true, data: formattedUser };
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, role: user?.role ?? null, ready, login, logout }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
