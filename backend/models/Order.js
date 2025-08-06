import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Restaurant Information
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  
  // Order Items
  items: [{
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    specialInstructions: String,
    customizations: [{
      name: String,
      options: [String],
      additionalPrice: { type: Number, default: 0 }
    }],
    totalPrice: { type: Number, required: true, min: 0 }
  }],
  
  // Pricing Details
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tip: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  
  // Delivery Information
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    instructions: String,
    contactPhone: String
  },
  
  // Order Status and Timeline
  status: {
    type: String,
    enum: [
      'placed',           // Order placed by customer
      'confirmed',        // Confirmed by restaurant
      'preparing',        // Being prepared
      'ready',           // Ready for pickup
      'drone_assigned',   // Drone assigned
      'picked_up',       // Picked up by drone
      'in_transit',      // On the way
      'delivered',       // Successfully delivered
      'cancelled',       // Cancelled
      'failed'           // Delivery failed
    ],
    default: 'placed'
  },
  
  // Order Timeline
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  
  // Timing Information
  timing: {
    placedAt: { type: Date, default: Date.now },
    confirmedAt: Date,
    preparingAt: Date,
    readyAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date
  },
  
  // Drone Information
  assignedDrone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  droneOperator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Real-time Tracking
  tracking: {
    currentLocation: {
      latitude: Number,
      longitude: Number,
      altitude: Number,
      timestamp: Date
    },
    route: [{
      latitude: Number,
      longitude: Number,
      altitude: Number,
      timestamp: Date,
      speed: Number // km/h
    }],
    estimatedArrival: Date,
    distance: {
      total: Number, // total distance in km
      remaining: Number // remaining distance in km
    }
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['card', 'digital_wallet', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  
  // Special Instructions and Notes
  specialInstructions: String,
  customerNotes: String,
  restaurantNotes: String,
  droneOperatorNotes: String,
  
  // Promotions and Discounts
  appliedPromotion: {
    code: String,
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: Number,
    appliedAmount: Number
  },
  
  // Scheduling (for pre-orders)
  isScheduled: { type: Boolean, default: false },
  scheduledFor: Date,
  
  // Rating and Feedback
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    food: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    comment: String,
    ratedAt: Date
  },
  
  // Order Type
  orderType: {
    type: String,
    enum: ['regular', 'scheduled', 'group', 'subscription'],
    default: 'regular'
  },
  
  // Group Order Information (if applicable)
  groupOrder: {
    isGroupOrder: { type: Boolean, default: false },
    groupId: String,
    participants: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      items: [String], // Array of item IDs they ordered
      amount: Number
    }]
  },
  
  // Cancellation Information
  cancellation: {
    reason: String,
    cancelledBy: { type: String, enum: ['customer', 'restaurant', 'system', 'drone_operator'] },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'] }
  },
  
  // Analytics and Metadata
  metadata: {
    orderSource: { type: String, enum: ['web', 'mobile', 'api'], default: 'web' },
    userAgent: String,
    ipAddress: String,
    weatherConditions: {
      temperature: Number,
      windSpeed: Number,
      visibility: Number,
      conditions: String
    },
    trafficConditions: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ assignedDrone: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Virtual for order duration
orderSchema.virtual('duration').get(function() {
  if (this.timing.deliveredAt && this.timing.placedAt) {
    return Math.round((this.timing.deliveredAt - this.timing.placedAt) / (1000 * 60)); // in minutes
  }
  return null;
});

// Virtual for estimated delivery time remaining
orderSchema.virtual('estimatedTimeRemaining').get(function() {
  if (this.timing.estimatedDeliveryTime && this.status !== 'delivered') {
    const now = new Date();
    const remaining = Math.round((this.timing.estimatedDeliveryTime - now) / (1000 * 60)); // in minutes
    return Math.max(0, remaining);
  }
  return null;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `DD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Method to add timeline event
orderSchema.methods.addTimelineEvent = function(status, note = '', location = null) {
  this.timeline.push({
    status,
    note,
    location,
    timestamp: new Date()
  });
  
  // Update timing based on status
  const now = new Date();
  switch(status) {
    case 'confirmed':
      this.timing.confirmedAt = now;
      break;
    case 'preparing':
      this.timing.preparingAt = now;
      break;
    case 'ready':
      this.timing.readyAt = now;
      break;
    case 'picked_up':
      this.timing.pickedUpAt = now;
      break;
    case 'delivered':
      this.timing.deliveredAt = now;
      this.timing.actualDeliveryTime = now;
      break;
  }
  
  return this.save();
};

// Method to update tracking location
orderSchema.methods.updateLocation = function(latitude, longitude, altitude = null, speed = null) {
  this.tracking.currentLocation = {
    latitude,
    longitude,
    altitude,
    timestamp: new Date()
  };
  
  // Add to route history
  this.tracking.route.push({
    latitude,
    longitude,
    altitude,
    speed,
    timestamp: new Date()
  });
  
  // Keep only last 100 route points to avoid document size issues
  if (this.tracking.route.length > 100) {
    this.tracking.route = this.tracking.route.slice(-100);
  }
  
  return this.save();
};

// Method to calculate estimated delivery time
orderSchema.methods.calculateEstimatedDeliveryTime = function() {
  // Base preparation time (can be customized based on restaurant and order complexity)
  const basePreparationTime = 15; // minutes
  const itemPreparationTime = this.items.reduce((total, item) => total + (item.quantity * 2), 0);
  const preparationTime = basePreparationTime + itemPreparationTime;
  
  // Delivery time estimation (simplified - in real app, use routing APIs)
  const averageSpeed = 30; // km/h for drone
  const distance = this.calculateDeliveryDistance();
  const deliveryTime = (distance / averageSpeed) * 60; // convert to minutes
  
  const totalTime = preparationTime + deliveryTime;
  this.timing.estimatedDeliveryTime = new Date(Date.now() + (totalTime * 60 * 1000));
  
  return this.timing.estimatedDeliveryTime;
};

// Method to calculate delivery distance
orderSchema.methods.calculateDeliveryDistance = function() {
  // This would typically use a routing API like Google Maps
  // For now, we'll calculate straight-line distance
  const R = 6371; // Earth's radius in km
  
  // Get restaurant location (would need to populate restaurant data)
  // For now, using a placeholder calculation
  const restaurantLat = 0; // Would get from this.restaurant.address.coordinates.latitude
  const restaurantLon = 0; // Would get from this.restaurant.address.coordinates.longitude
  
  const customerLat = this.deliveryAddress.coordinates.latitude;
  const customerLon = this.deliveryAddress.coordinates.longitude;
  
  const dLat = (customerLat - restaurantLat) * Math.PI / 180;
  const dLon = (customerLon - restaurantLon) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(restaurantLat * Math.PI / 180) * 
    Math.cos(customerLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default mongoose.model('Order', orderSchema);