import { EnrollmentStatus } from "./../constants/roles";
import { RuleCheckCode, SwapRequestStatus } from "./../constants/swapStatus";
import { Enrollment } from "./../models/enrollment.model";
import { ISlot, Slot } from "./../models/slot.model";
import { IRuleCheckItem, SwapRequest } from "./../models/swapRequest.model";
import { ISwapRule, SwapRule } from "./../models/swapRule.model";
import { IUser, User } from "./../models/user.model";

export interface RuleEvaluationResult {
  passed: boolean;
  checks: IRuleCheckItem[];
}

export const hasTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  return start1 < end2 && end1 > start2;
};

export class SwapRuleEngine {
  static async getRuleForStudent(student: IUser): Promise<ISwapRule> {
    const rule = await SwapRule.findOne({
      $or: [
        {
          programId: student.programId,
          semesterId: student.semesterId,
          isActive: true,
        },
        { isActive: true },
      ],
    }).sort({ programId: -1, semesterId: -1 });

    if (rule) return rule;

    return new SwapRule({
      maxSwapsPerStudent: 2,
      swapWindowStart: new Date("2026-01-01"),
      swapWindowEnd: new Date("2026-12-31"),
      sameCourseOnly: true,
      sameProgramOnly: true,
      capacityCheckEnabled: true,
      clashCheckEnabled: true,
      requireFacultyApproval: true,
      isActive: true,
    });
  }

  static async checkEnrollment(
    studentId: string,
    currentSlotId: string,
  ): Promise<IRuleCheckItem> {
    const enrollment = await Enrollment.findOne({
      studentId,
      slotId: currentSlotId,
      status: EnrollmentStatus.ACTIVE,
    });

    if (!enrollment) {
      return {
        code: RuleCheckCode.ENROLLMENT_OWNERSHIP,
        name: "Enrollment Ownership",
        passed: false,
        message: "You are not enrolled in the selected starting slot",
      };
    }

    return {
      code: RuleCheckCode.ENROLLMENT_OWNERSHIP,
      name: "Enrollment Ownership",
      passed: true,
      message: "Verified enrollment in starting slot",
    };
  }

  static checkSameCourse(
    currentSlot: ISlot,
    desiredSlot: ISlot,
    rule: ISwapRule,
  ): IRuleCheckItem {
    if (!rule.sameCourseOnly) {
      return {
        code: RuleCheckCode.SAME_COURSE,
        name: "Same Course Restriction",
        passed: true,
        message: "Same course rule is disabled",
      };
    }

    const isSame =
      currentSlot.courseId.toString() === desiredSlot.courseId.toString();

    return {
      code: RuleCheckCode.SAME_COURSE,
      name: "Same Course Restriction",
      passed: isSame,
      message: isSame
        ? "Both slots belong to the same course module"
        : "Swaps can only occur within the same course module",
    };
  }

  static async checkClash(
    studentId: string,
    currentSlotId: string,
    desiredSlot: ISlot,
    rule: ISwapRule,
  ): Promise<IRuleCheckItem> {
    if (!rule.clashCheckEnabled) {
      return {
        code: RuleCheckCode.CLASH_CHECK,
        name: "Clash Check",
        passed: true,
        message: "Clash check disabled",
      };
    }

    const activeEnrollments = await Enrollment.find({
      studentId,
      status: EnrollmentStatus.ACTIVE,
      slotId: { $ne: currentSlotId },
    }).populate("slotId");

    for (const enrollment of activeEnrollments) {
      const existingSlot = enrollment.slotId as any as ISlot;
      if (!existingSlot || !existingSlot.isActive) continue;

      if (existingSlot.dayOfWeek === desiredSlot.dayOfWeek) {
        if (
          hasTimeOverlap(
            desiredSlot.startTime,
            desiredSlot.endTime,
            existingSlot.startTime,
            existingSlot.endTime,
          )
        ) {
          return {
            code: RuleCheckCode.CLASH_CHECK,
            name: "Clash Check",
            passed: false,
            message: `Timetable clash with existing slot (${existingSlot.startTime} - ${existingSlot.endTime}) on ${existingSlot.dayOfWeek}`,
          };
        }
      }
    }

    return {
      code: RuleCheckCode.CLASH_CHECK,
      name: "Clash Check",
      passed: true,
      message: "No timetable clash detected",
    };
  }

  static async checkEligibility(
    student: IUser,
    rule: ISwapRule,
  ): Promise<IRuleCheckItem> {
    if (!student.isActive) {
      return {
        code: RuleCheckCode.ELIGIBILITY_CHECK,
        name: "Eligibility & Swap Limit",
        passed: false,
        message: "Student account is inactive",
      };
    }

    const activeSwapCount = await SwapRequest.countDocuments({
      requesterId: student._id,
      status: {
        $in: [
          SwapRequestStatus.OPEN,
          SwapRequestStatus.MATCHED,
          SwapRequestStatus.PENDING_APPROVAL,
          SwapRequestStatus.APPROVED,
        ],
      },
    });

    if (activeSwapCount >= rule.maxSwapsPerStudent) {
      return {
        code: RuleCheckCode.ELIGIBILITY_CHECK,
        name: "Eligibility & Swap Limit",
        passed: false,
        message: `Maximum swap limit of ${rule.maxSwapsPerStudent} requests per student reached`,
      };
    }

    return {
      code: RuleCheckCode.ELIGIBILITY_CHECK,
      name: "Eligibility & Swap Limit",
      passed: true,
      message: `Student eligible (${activeSwapCount}/${rule.maxSwapsPerStudent} swaps used)`,
    };
  }

  static async checkCapacity(
    desiredSlot: ISlot,
    rule: ISwapRule,
  ): Promise<IRuleCheckItem> {
    if (!rule.capacityCheckEnabled) {
      return {
        code: RuleCheckCode.CAPACITY_CHECK,
        name: "Lab Capacity Check",
        passed: true,
        message: "Capacity check disabled",
      };
    }

    const currentEnrollmentCount = await Enrollment.countDocuments({
      slotId: desiredSlot._id,
      status: EnrollmentStatus.ACTIVE,
    });

    if (currentEnrollmentCount >= desiredSlot.capacity) {
      return {
        code: RuleCheckCode.CAPACITY_CHECK,
        name: "Lab Capacity Check",
        passed: false,
        message: `Target slot is full (${currentEnrollmentCount}/${desiredSlot.capacity})`,
      };
    }

    return {
      code: RuleCheckCode.CAPACITY_CHECK,
      name: "Lab Capacity Check",
      passed: true,
      message: `Available seat capacity (${currentEnrollmentCount}/${desiredSlot.capacity})`,
    };
  }

  static checkDeadline(rule: ISwapRule): IRuleCheckItem {
    const now = new Date();
    if (now < rule.swapWindowStart || now > rule.swapWindowEnd) {
      return {
        code: RuleCheckCode.DEADLINE_CHECK,
        name: "Swap Window Deadline",
        passed: false,
        message: "Swap window is closed for this academic term",
      };
    }

    return {
      code: RuleCheckCode.DEADLINE_CHECK,
      name: "Swap Window Deadline",
      passed: true,
      message: "Within allowable swap period",
    };
  }

  static async runAllChecks(
    studentId: string,
    currentSlotId: string,
    desiredSlotId: string,
  ): Promise<RuleEvaluationResult> {
    const student = await User.findById(studentId);
    if (!student) {
      return {
        passed: false,
        checks: [
          {
            code: RuleCheckCode.ELIGIBILITY_CHECK,
            name: "Student Check",
            passed: false,
            message: "Student record not found",
          },
        ],
      };
    }

    const currentSlot = await Slot.findById(currentSlotId);
    const desiredSlot = await Slot.findById(desiredSlotId);

    if (!currentSlot || !desiredSlot) {
      return {
        passed: false,
        checks: [
          {
            code: RuleCheckCode.ENROLLMENT_OWNERSHIP,
            name: "Slot Check",
            passed: false,
            message: "Invalid starting or target class slot",
          },
        ],
      };
    }

    const rule = await this.getRuleForStudent(student);

    const checks: IRuleCheckItem[] = [];

    const enrollmentCheck = await this.checkEnrollment(
      studentId,
      currentSlotId,
    );
    checks.push(enrollmentCheck);

    const sameCourseCheck = this.checkSameCourse(
      currentSlot,
      desiredSlot,
      rule,
    );
    checks.push(sameCourseCheck);

    const clashCheck = await this.checkClash(
      studentId,
      currentSlotId,
      desiredSlot,
      rule,
    );
    checks.push(clashCheck);

    const eligibilityCheck = await this.checkEligibility(student, rule);
    checks.push(eligibilityCheck);

    const capacityCheck = await this.checkCapacity(desiredSlot, rule);
    checks.push(capacityCheck);

    const deadlineCheck = this.checkDeadline(rule);
    checks.push(deadlineCheck);

    const passed = checks.every((c) => c.passed);

    return {
      passed,
      checks,
    };
  }
}
