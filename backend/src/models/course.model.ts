import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  name: string;
  departmentId: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  semesterId: mongoose.Types.ObjectId;
  credits: number;
  hasLecture: boolean;
  hasLab: boolean;
  facultyIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    credits: { type: Number, required: true, default: 3 },
    hasLecture: { type: Boolean, default: true },
    hasLab: { type: Boolean, default: false },
    facultyIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
