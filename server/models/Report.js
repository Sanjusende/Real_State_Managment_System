import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter reference is required'],
      index: true,
    },
    targetType: {
      type: String,
      enum: ['PROPERTY', 'USER', 'ENQUIRY', 'REVIEW'],
      required: [true, 'Target entity type is required'],
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      enum: [
        'INCORRECT_INFORMATION',
        'FRAUD_OR_SCAM',
        'SPAM_OR_DUPLICATE',
        'OFFENSIVE_CONTENT',
        'UNRESPONSIVE_AGENT',
        'ALREADY_SOLD',
        'OTHER',
      ],
      default: 'OTHER',
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
