import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED', // Direct publishing with post-moderation capability
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review for the same property by the same user
reviewSchema.index({ property: 1, user: 1 }, { unique: true });
reviewSchema.index({ property: 1, status: 1, createdAt: -1 });

/**
 * Static method to calculate review summary metrics for a property
 */
reviewSchema.statics.getReviewStats = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: {
        property: new mongoose.Types.ObjectId(propertyId),
        status: 'APPROVED',
      },
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ]);

  let totalReviews = 0;
  let sumRatings = 0;
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  stats.forEach((item) => {
    const star = item._id;
    if (star >= 1 && star <= 5) {
      ratingBreakdown[star] = item.count;
      totalReviews += item.count;
      sumRatings += star * item.count;
    }
  });

  const averageRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

  return {
    averageRating,
    totalReviews,
    ratingBreakdown,
  };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
