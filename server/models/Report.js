import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
      index: true,
      alias: 'targetId',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter reference is required'],
      index: true,
      alias: 'reporter',
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      enum: [
        'INCORRECT_INFORMATION',
        'MISLEADING_PRICE',
        'FRAUD_OR_SCAM',
        'SPAM_OR_DUPLICATE',
        'OFFENSIVE_CONTENT',
        'UNRESPONSIVE_AGENT',
        'ALREADY_SOLD',
        'UNAVAILABLE_PROPERTY',
        'OTHER',
      ],
      default: 'OTHER',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

reportSchema.index({ property: 1, status: 1, createdAt: -1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
