import mongoose, { Document, Schema } from "mongoose";

export interface IProgram extends Document {
  name: string;
  code: string;
  departmentId: mongoose.Types.ObjectId;
  durationSemesters: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    durationSemesters: { type: Number, required: true, default: 4 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const Program = mongoose.model<IProgram>("Program", ProgramSchema);
