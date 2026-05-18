const mongoose = require('mongoose');

/**
 * Employee Schema
 * Stores employee details including name, email, department,
 * skills array, performance score, and years of experience.
 */
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Development',
          'Design',
          'Marketing',
          'Sales',
          'HR',
          'Finance',
          'Operations',
          'Management',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Employee must have at least one skill',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Performance score cannot be less than 0'],
      max: [100, 'Performance score cannot be more than 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
