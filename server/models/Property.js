import mongoose from 'mongoose';
import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_STATUS,
  APPROVAL_STATUS,
} from '../config/constants.js';

const propertyImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
    isThumbnail: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: PROPERTY_TYPES,
        message: '{VALUE} is not a supported property type',
      },
      index: true,
    },
    listingType: {
      type: String,
      required: [true, 'Listing type (SALE, RENT, LEASE) is required'],
      enum: {
        values: LISTING_TYPES,
        message: '{VALUE} is not a valid listing type',
      },
      default: 'SALE',
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    priceUnit: {
      type: String,
      default: 'INR',
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Property area is required'],
      min: [1, 'Area must be at least 1 unit'],
    },
    areaUnit: {
      type: String,
      default: 'sqft',
      enum: ['sqft', 'sqyd', 'sqm', 'acre'],
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    balconies: {
      type: Number,
      default: 0,
      min: 0,
    },
    floor: {
      type: Number,
      default: 0,
    },
    totalFloors: {
      type: Number,
      default: 1,
    },
    furnishingStatus: {
      type: String,
      enum: ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'],
      default: 'UNFURNISHED',
    },
    constructionStatus: {
      type: String,
      enum: ['READY_TO_MOVE', 'UNDER_CONSTRUCTION'],
      default: 'READY_TO_MOVE',
    },
    possessionDate: {
      type: Date,
    },
    yearBuilt: {
      type: Number,
    },
    parking: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [propertyImageSchema],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [72.8777, 19.0760],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property owner is required'],
      index: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: PROPERTY_STATUS,
        message: '{VALUE} is not a valid property status',
      },
      default: 'AVAILABLE',
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: APPROVAL_STATUS,
        message: '{VALUE} is not a valid approval status',
      },
      default: 'PENDING',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Spatial index for geolocation queries
propertySchema.index({ coordinates: '2dsphere' });

// Full text search index
propertySchema.index(
  {
    title: 'text',
    description: 'text',
    address: 'text',
    city: 'text',
  },
  {
    weights: {
      title: 10,
      city: 5,
      address: 3,
      description: 1,
    },
    name: 'PropertyTextIndex',
  }
);

// Compound and multi-key indexes for public catalog performance
propertySchema.index({ approvalStatus: 1, status: 1, price: 1 });
propertySchema.index({ approvalStatus: 1, status: 1, city: 1, propertyType: 1 });
propertySchema.index({ approvalStatus: 1, status: 1, city: 1, price: 1 });
propertySchema.index({ approvalStatus: 1, status: 1, propertyType: 1, listingType: 1, price: 1 });
propertySchema.index({ approvalStatus: 1, status: 1, views: -1, createdAt: -1 });
propertySchema.index({ approvalStatus: 1, status: 1, bedrooms: 1, bathrooms: 1 });
propertySchema.index({ approvalStatus: 1, isFeatured: 1, createdAt: -1 });
propertySchema.index({ city: 1, state: 1 });
propertySchema.index({ amenities: 1 });
propertySchema.index({ owner: 1, createdAt: -1 });
propertySchema.index({ agent: 1, createdAt: -1 });

// Helper to ensure thumbnail fallback
propertySchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    const thumbObj = this.images.find((img) => img.isThumbnail);
    this.thumbnail = thumbObj ? thumbObj.url : this.images[0].url;
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
