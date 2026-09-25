import mongoose, { Document, Schema } from 'mongoose';

export interface ISwapRule extends Document {
  programId?: mongoose.Types.ObjectId;
  semesterId?: mongoose.Types.ObjectId;
  maxSwapsPerStudent: number;
  swapWindowStart: Date;
  swapWindowEnd: Date;
  sameCourseOnly: boolean;
  sameProgramOnly: boolean;
  capacityCheckEnabled: boolean;
  clashCheckEnabled: boolean;
  requireFacultyApproval: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SwapRuleSchema = new Schema<ISwapRule>(
  {
    programId: { type: Schema.Types.ObjectId, ref: 'Program', index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', index: true },
    maxSwapsPerStudent: { type: Number, required: true, default: 2 },
    swapWindowStart: { type: Date, required: true, default: () => new Date('2026-01-01') },
    swapWindowEnd: { type: Date, required: true, default: () => new Date('2026-12-31') },
    sameCourseOnly: { type: Boolean, default: true },
    sameProgramOnly: { type: Boolean, default: true },
    capacityCheckEnabled: { type: Boolean, default: true },
    clashCheckEnabled: { type: Boolean, default: true },
    requireFacultyApproval: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SwapRule = mongoose.model<ISwapRule>('SwapRule', SwapRuleSchema);
