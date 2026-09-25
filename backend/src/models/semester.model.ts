import mongoose, { Document, Schema } from 'mongoose';

export interface ISemester extends Document {
  name: string;
  number: number;
  academicYear: string;
  programId: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    name: { type: String, required: true, trim: true },
    number: { type: Number, required: true },
    academicYear: { type: String, required: true, trim: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
