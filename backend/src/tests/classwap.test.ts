import mongoose from "mongoose";
import request from "supertest";
import app from "./../server";
import { seedDatabase } from "./../seeds/seed";

describe("ClassSwap Backend End-to-End API Test Suite", () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let raviToken: string;
  let priyaToken: string;
  let facultyToken: string;
  let adminToken: string;

  let raviNetworksSlotId: string;
  let priyaNetworksSlotId: string;
  let swapRequestId: string;

  describe("PHASE 2 — AUTHENTICATION & LOGIN", () => {
    it("should login as Ravi Kumar (Student)", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "ravi.k@univ.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.role).toBe("STUDENT");
      raviToken = res.body.data.accessToken;
    });

    it("should login as Priya Sharma (Student)", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "priya.s@univ.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      priyaToken = res.body.data.accessToken;
    });

    it("should login as Dr. Mehta (Faculty)", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "dr.mehta@univ.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe("FACULTY");
      facultyToken = res.body.data.accessToken;
    });

    it("should login as Admin User (Admin)", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@univ.edu",
        password: "Password123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe("ADMIN");
      adminToken = res.body.data.accessToken;
    });

    it("should reject invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "ravi.k@univ.edu",
        password: "WrongPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PHASE 9 — REAL TIMETABLE", () => {
    it("should fetch Ravi's real timetable from MongoDB", async () => {
      const res = await request(app)
        .get("/api/students/me/timetable")
        .set("Authorization", `Bearer ${raviToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.timetable).toBeDefined();

      const networksLab = res.body.data.timetable.find(
        (t: any) => t.code === "CS302L",
      );
      expect(networksLab).toBeDefined();
      expect(networksLab.batch).toBe("Batch A");
      raviNetworksSlotId = networksLab.slotId;
    });

    it("should fetch Priya's real timetable from MongoDB", async () => {
      const res = await request(app)
        .get("/api/students/me/timetable")
        .set("Authorization", `Bearer ${priyaToken}`);

      expect(res.status).toBe(200);

      const networksLab = res.body.data.timetable.find(
        (t: any) => t.code === "CS302L",
      );
      expect(networksLab).toBeDefined();
      expect(networksLab.batch).toBe("Batch B");
      priyaNetworksSlotId = networksLab.slotId;
    });
  });

  describe("PHASE 13 & 15 — RULE ENGINE & SWAP REQUEST CREATION", () => {
    it("should run rule check for Ravi swapping Networks Lab Batch A -> Batch B", async () => {
      const res = await request(app)
        .post("/api/swaps/check")
        .set("Authorization", `Bearer ${raviToken}`)
        .send({
          currentSlotId: raviNetworksSlotId,
          desiredSlotId: priyaNetworksSlotId,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.passed).toBe(true);
      expect(res.body.data.checks.length).toBeGreaterThanOrEqual(5);
    });

    it("should create an OPEN swap request for Ravi", async () => {
      const res = await request(app)
        .post("/api/swaps")
        .set("Authorization", `Bearer ${raviToken}`)
        .send({
          currentSlotId: raviNetworksSlotId,
          desiredSlotId: priyaNetworksSlotId,
          reason: "Family event on Mondays",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("OPEN");
      swapRequestId = res.body.data._id;
    });
  });

  describe("PHASE 17 & 18 — SWAP BOARD & ACCEPT SWAP", () => {
    it("should display Ravi's swap in Priya's open swap opportunities", async () => {
      const res = await request(app)
        .get("/api/swaps/open")
        .set("Authorization", `Bearer ${priyaToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const openSwap = res.body.data.find(
        (s: any) => s.swapId === swapRequestId,
      );
      expect(openSwap).toBeDefined();
      expect(openSwap.requesterName).toBe("Ravi Kumar");
    });

    it("should allow Priya to accept the swap request", async () => {
      const res = await request(app)
        .post(`/api/swaps/${swapRequestId}/accept`)
        .set("Authorization", `Bearer ${priyaToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("PENDING_APPROVAL");
    });
  });

  describe("PHASE 19 & 21 — FACULTY APPROVAL & ATOMIC TIMETABLE EXCHANGE", () => {
    it("should show the pending swap request to Dr. Mehta", async () => {
      const res = await request(app)
        .get("/api/faculty/swaps/pending")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(res.status).toBe(200);
      const pending = res.body.data.find((s: any) => s._id === swapRequestId);
      expect(pending).toBeDefined();
    });

    it("should allow Dr. Mehta to approve the swap request", async () => {
      const res = await request(app)
        .post(`/api/faculty/swaps/${swapRequestId}/approve`)
        .set("Authorization", `Bearer ${facultyToken}`)
        .send({
          comment: "Approved for schedule alignment.",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("APPROVED");
    });

    it("should reflect updated timetable for Ravi (now in Batch B)", async () => {
      const res = await request(app)
        .get("/api/students/me/timetable")
        .set("Authorization", `Bearer ${raviToken}`);

      expect(res.status).toBe(200);
      const networksLab = res.body.data.timetable.find(
        (t: any) => t.code === "CS302L",
      );
      expect(networksLab.slotId).toBe(priyaNetworksSlotId);
      expect(networksLab.batch).toBe("Batch B");
    });

    it("should reflect updated timetable for Priya (now in Batch A)", async () => {
      const res = await request(app)
        .get("/api/students/me/timetable")
        .set("Authorization", `Bearer ${priyaToken}`);

      expect(res.status).toBe(200);
      const networksLab = res.body.data.timetable.find(
        (t: any) => t.code === "CS302L",
      );
      expect(networksLab.slotId).toBe(raviNetworksSlotId);
      expect(networksLab.batch).toBe("Batch A");
    });
  });

  describe("PHASE 25 & 26 — AUDIT LOGS & ADMIN DASHBOARD", () => {
    it("should retrieve system audit logs for Admin", async () => {
      const res = await request(app)
        .get("/api/admin/audit-logs")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);

      const actions = res.body.data.map((l: any) => l.action);
      expect(actions).toContain("SWAP_CREATED");
      expect(actions).toContain("SWAP_ACCEPTED");
      expect(actions).toContain("SWAP_APPROVED");
      expect(actions).toContain("TIMETABLE_UPDATED");
    });

    it("should retrieve admin dashboard statistics", async () => {
      const res = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.students).toBeGreaterThanOrEqual(15);
      expect(res.body.data.approvedSwaps).toBeGreaterThanOrEqual(1);
    });
  });
});
