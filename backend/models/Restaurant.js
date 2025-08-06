import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  website: String,
  
  // Location Information
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  
  // Service Area (for drone delivery)
  serviceArea: {
    radius: { type: Number, default: 5 }, // in kilometers
    zones: [{
      name: String,
      coordinates: [{
        latitude: Number,
        longitude: Number
      }]
    }]
  },
  
  // Business Information
  businessLicense: String,
  taxId: String,
  
  // Media
  images: {
    logo: String,
    cover: String,
    gallery: [String]
  },
  
  // Categories and Cuisine
  cuisineTypes: [{
    type: String,
    required: true
  }],
  categories: [String],
  
  // Menu
  menu: [{
    category: { type: String, required: true },
    items: [{
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true, min: 0 },
      images: [String],
      ingredients: [String],
      allergens: [String],
      nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      },
      isVegetarian: { type: Boolean, default: false },
      isVegan: { type: Boolean, default: false },
      isGlutenFree: { type: Boolean, default: false },
      spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra_hot'] },
      preparationTime: { type: Number, required: true }, // in minutes
      isAvailable: { type: Boolean, default: true },
      tags: [String]
    }]
  }],
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
  
  // Status and Verification
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  // Ratings and Reviews
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    reply: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Business Metrics
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
  averagePreparationTime: { type: Number, default: 0 },
  
  // Delivery Settings
  deliverySettings: {
    minimumOrderValue: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    freeDeliveryThreshold: { type: Number, default: 50 },
    estimatedDeliveryTime: { type: Number, default: 30 }, // in minutes
    acceptsScheduledOrders: { type: Boolean, default: false },
    maxAdvanceBookingDays: { type: Number, default: 7 }
  },
  
  // Payment Information
  paymentSettings: {
    acceptsCash: { type: Boolean, default: false },
    acceptsCard: { type: Boolean, default: true },
    acceptsDigitalWallet: { type: Boolean, default: true },
    stripeAccountId: String,
    commissionRate: { type: Number, default: 0.15 } // 15% platform commission
  },
  
  // Promotional Information
  promotions: [{
    title: String,
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: Number,
    minimumOrderValue: Number,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 }
  }],
  
  // Special Features
  features: {
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    acceptsPreOrders: { type: Boolean, default: false },
    hasLiveTracking: { type: Boolean, default: true }
  },
  
  // Compliance and Certifications
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date,
    documentUrl: String
  }],
  
  // Analytics Data
  analytics: {
    totalViews: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    peakHours: [{
      hour: Number,
      orderCount: Number
    }],
    popularItems: [{
      itemId: String,
      orderCount: Number
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
restaurantSchema.index({ 'address.coordinates': '2dsphere' });
restaurantSchema.index({ cuisineTypes: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ isActive: 1, isVerified: 1 });
restaurantSchema.index({ owner: 1 });

// Virtual for full address
restaurantSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Virtual for current operating status
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[currentDay];
  if (todayHours.isClosed) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Method to calculate distance from a point
restaurantSchema.methods.calculateDistance = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.address.coordinates.latitude) * Math.PI / 180;
  const dLon = (longitude - this.address.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.address.coordinates.latitude * Math.PI / 180) * 
    Math.cos(latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Method to check if location is within service area
restaurantSchema.methods.isWithinServiceArea = function(latitude, longitude) {
  const distance = this.calculateDistance(latitude, longitude);
  return distance <= this.serviceArea.radius;
};

// Method to update rating
restaurantSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

// Pre-save middleware to update analytics
restaurantSchema.pre('save', function(next) {
  if (this.totalOrders > 0 && this.totalRevenue > 0) {
    this.averageOrderValue = Math.round((this.totalRevenue / this.totalOrders) * 100) / 100;
  }
  next();
});

export default mongoose.model('Restaurant', restaurantSchema);