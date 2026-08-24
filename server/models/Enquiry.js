import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient agent/owner reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'],
      default: 'PENDING',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast lookup by sender, recipient, and property
enquirySchema.index({ recipient: 1, createdAt: -1 });
enquirySchema.index({ sender: 1, createdAt: -1 });
enquirySchema.index({ property: 1, createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
