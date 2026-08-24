import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get reviews and aggregated statistics for a specific property
 */
export const getPropertyReviews = async (propertyId, query = {}) => {
  let targetPropertyId = propertyId;

  // Support both Mongo ObjectId and Property Slug
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    const prop = await Property.findOne({ slug: propertyId });
    if (!prop) {
      throw new ApiError(404, 'Property not found');
    }
    targetPropertyId = prop._id;
  }

  const page = Math.max(1, parseInt(query.page || 1, 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || 10, 10)));
  const skip = (page - 1) * limit;

  const filter = { property: targetPropertyId, status: 'APPROVED' };

  const [reviews, total, stats] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
    Review.getReviewStats(targetPropertyId),
  ]);

  return {
    reviews,
    total,
    stats,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Add or update review for a property (with duplicate prevention)
 */
export const addOrUpdateReview = async (propertyId, user, { rating, comment }) => {
  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, 'Rating must be an integer between 1 and 5');
  }

  if (!comment || !comment.trim()) {
    throw new ApiError(400, 'Review comment is required');
  }

  let targetPropertyId = propertyId;
  let property = null;

  if (mongoose.Types.ObjectId.isValid(propertyId)) {
    property = await Property.findById(propertyId).populate('owner agent');
  } else {
    property = await Property.findOne({ slug: propertyId }).populate('owner agent');
  }

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  targetPropertyId = property._id;

  // Check for existing review by this user on this property
  let review = await Review.findOne({
    property: targetPropertyId,
    user: user.id || user._id,
  });

  const isNew = !review;

  if (review) {
    // Update existing review
    review.rating = numericRating;
    review.comment = comment.trim();
    review.status = 'APPROVED';
    await review.save();
  } else {
    // Create fresh review
    review = await Review.create({
      property: targetPropertyId,
      user: user.id || user._id,
      rating: numericRating,
      comment: comment.trim(),
      status: 'APPROVED',
    });
  }

  // Populate user info for immediate frontend display
  await review.populate('user', 'name avatar role');

  // Trigger Notification to property owner / agent if submitted by someone else
  const recipient = property.owner?._id || property.agent?._id;
  const submitterId = user.id || user._id;

  if (isNew && recipient && recipient.toString() !== submitterId.toString()) {
    try {
      await Notification.create({
        recipient,
        sender: submitterId,
        type: 'REVIEW_ADDED',
        title: 'New Property Review ⭐',
        message: `${user.name || 'A buyer'} left a ${numericRating}-star review on "${property.title}": "${comment.trim().slice(0, 120)}..."`,
        relatedProperty: property._id,
      });
    } catch (notifErr) {
      console.error('Failed to dispatch review notification:', notifErr);
    }
  }

  const stats = await Review.getReviewStats(targetPropertyId);

  return {
    review,
    stats,
    message: isNew ? 'Review submitted successfully' : 'Your review has been updated',
  };
};

/**
 * Delete a review (by author or admin)
 */
export const deleteReview = async (reviewId, user) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const isOwner = review.user.toString() === (user.id || user._id).toString();
  const isAdmin = user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to delete this review');
  }

  await Review.findByIdAndDelete(reviewId);
  const stats = await Review.getReviewStats(review.property);

  return { message: 'Review deleted', stats };
};
