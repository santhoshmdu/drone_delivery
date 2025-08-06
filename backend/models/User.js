import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  
  // Role and Status
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin', 'drone_operator'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: ''
  },
  dateOfBirth: Date,
  
  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    isDefault: { type: Boolean, default: false }
  }],
  
  // Customer-specific fields
  customerProfile: {
    favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    preferences: {
      cuisine: [String],
      dietaryRestrictions: [String],
      spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra_hot'] }
    },
    loyaltyPoints: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  
  // Seller-specific fields
  sellerProfile: {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    businessLicense: String,
    taxId: String,
    bankAccount: {
      accountNumber: String,
      routingNumber: String,
      accountHolderName: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalEarnings: { type: Number, default: 0 }
  },
  
  // Admin/Drone Operator fields
  adminProfile: {
    permissions: [String],
    assignedDrones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drone' }],
    operatingZones: [{
      name: String,
      coordinates: [{
        latitude: Number,
        longitude: Number
      }]
    }]
  },
  
  // Notification Preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  },
  
  // Security
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0, max: 5 },
  lockUntil: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Firebase tokens for push notifications
  fcmTokens: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'addresses.coordinates': '2dsphere' });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we hit max attempts and it's not locked, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to add FCM token
userSchema.methods.addFCMToken = function(token) {
  if (!this.fcmTokens.includes(token)) {
    this.fcmTokens.push(token);
    return this.save();
  }
};

// Method to remove FCM token
userSchema.methods.removeFCMToken = function(token) {
  this.fcmTokens = this.fcmTokens.filter(t => t !== token);
  return this.save();
};

export default mongoose.model('User', userSchema);