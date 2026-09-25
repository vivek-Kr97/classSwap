import { AuditLog } from "./../models/auditLog.model";
import { IUser } from "./../models/user.model";

export interface CreateAuditLogParams {
  actor?: IUser;
  actorName?: string;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details: string;
  metadata?: any;
  ipAddress?: string;
}

export const logAudit = async (params: CreateAuditLogParams) => {
  try {
    const actorId = params.actor ? params.actor._id : undefined;
    const actorName = params.actor
      ? params.actor.fullName
      : params.actorName || "System";
    const actorRole = params.actor
      ? params.actor.role
      : params.actorRole || "SYSTEM";

    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details,
      metadata: params.metadata,
      ipAddress: params.ipAddress,
    });
  } catch (err: any) {
    console.error("[AuditLog] Error saving audit log:", err.message);
  }
};
