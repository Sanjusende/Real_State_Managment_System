import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_platform_settings',
    },
    siteName: {
      type: String,
      default: 'EstateCraft Real Estate',
    },
    supportEmail: {
      type: String,
      default: 'support@estatecraft.com',
    },
    supportPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    autoApproveVerifiedAgents: {
      type: Boolean,
      default: false,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    featuredPropertyFee: {
      type: Number,
      default: 4999,
    },
    maxImagesPerListing: {
      type: Number,
      default: 15,
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
