import mongoose from 'mongoose';
import Report from '../models/Report.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/constants.js';

/**
 * Submit a property moderation report
 */
export const createReport = async (userId, { propertyId, reason, description }) => {
  if (!reason) {
    throw new ApiError(400, 'Reason for report is required');
  }

  if (!description || !description.trim()) {
    throw new ApiError(400, 'Please provide a detailed description of the issue');
  }

  let targetPropertyId = propertyId;
  let property = null;

  if (mongoose.Types.ObjectId.isValid(propertyId)) {
    property = await Property.findById(propertyId);
  } else {
    property = await Property.findOne({ slug: propertyId });
  }

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  targetPropertyId = property._id;

  const report = await Report.create({
    property: targetPropertyId,
    reportedBy: userId,
    reason,
    description: description.trim(),
    status: 'PENDING',
  });

  return report;
};

/**
 * Get reports submitted by a specific user
 */
export const getUserReports = async (userId, query = {}) => {
  const page = Math.max(1, parseInt(query.page || 1, 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || 10, 10)));
  const skip = (page - 1) * limit;

  const [reports, total] = await Promise.all([
    Report.find({ reportedBy: userId })
      .populate('property', 'title slug thumbnail city state price priceUnit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Report.countDocuments({ reportedBy: userId }),
  ]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Update report status (Admin only)
 */
export const updateReportStatus = async (reportId, adminUser, { status, adminNotes }) => {
  const report = await Report.findById(reportId).populate('reportedBy property');
  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  const validStatuses = ['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED', 'DISMISSED'];
  if (status && !validStatuses.includes(status.toUpperCase())) {
    throw new ApiError(400, `Invalid status. Valid values are: ${validStatuses.join(', ')}`);
  }

  if (status) report.status = status.toUpperCase();
  if (adminNotes !== undefined) report.adminNotes = adminNotes;
  report.reviewedBy = adminUser.id || adminUser._id;

  await report.save();

  // Log activity
  try {
    await ActivityLog.create({
      user: adminUser.id || adminUser._id,
      action: `REPORT_${report.status}`,
      entityType: 'Report',
      entityId: report._id.toString(),
      details: `Admin marked report #${report._id} as ${report.status}. Notes: ${adminNotes || 'None'}`,
    });
  } catch (logErr) {
    console.error('Failed to log report activity:', logErr);
  }

  // Notify the reporter about status update
  if (report.reportedBy?._id) {
    try {
      await Notification.create({
        recipient: report.reportedBy._id,
        sender: adminUser.id || adminUser._id,
        type: 'SYSTEM_ANNOUNCEMENT',
        title: `Report Status: ${report.status}`,
        message: `Your report regarding "${report.property?.title || 'a property'}" has been updated to ${report.status}.${adminNotes ? ` Admin notes: ${adminNotes}` : ''}`,
        relatedProperty: report.property?._id || null,
      });
    } catch (notifErr) {
      console.error('Failed to notify reporter:', notifErr);
    }
  }

  return report;
};
