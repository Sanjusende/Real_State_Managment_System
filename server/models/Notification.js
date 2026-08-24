import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification recipient is required'],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'PROPERTY_APPROVED',
        'PROPERTY_REJECTED',
        'NEW_ENQUIRY',
        'ENQUIRY_RESPONSE',
        'ACCOUNT_BLOCKED',
        'REVIEW_ADDED',
        'PROPERTY_SOLD',
        'PRICE_DROP',
        'SYSTEM_ANNOUNCEMENT',
        'ACCOUNT_VERIFIED',
        'ACCOUNT_STATUS_CHANGE',
      ],
      default: 'SYSTEM_ANNOUNCEMENT',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    relatedProperty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
      alias: 'property',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
