import mongoose from 'mongoose';
import slugify from 'slugify';

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    image: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    propertyCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// GeoJSON 2dsphere index for location-based spatial queries
locationSchema.index({ coordinates: '2dsphere' });
// Compound index for uniqueness across city and state
locationSchema.index({ city: 1, state: 1 }, { unique: true });

// Pre-save hook to generate unique slug
locationSchema.pre('save', function (next) {
  if (this.isModified('city') || this.isModified('state')) {
    this.slug = slugify(`${this.city}-${this.state}`, { lower: true, strict: true });
  }
  next();
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
