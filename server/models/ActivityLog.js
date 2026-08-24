import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action name is required'],
      trim: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['Property', 'User', 'Category', 'Location', 'Enquiry', 'Review', 'Report', 'Setting', 'Auth'],
      required: [true, 'Entity type is required'],
      index: true,
    },
    entityId: {
      type: String,
      default: null,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
