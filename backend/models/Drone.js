import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
  // Basic Information
  droneId: {
    type: String,
    unique: true,
    required: [true, 'Drone ID is required']
  },
  name: {
    type: String,
    required: [true, 'Drone name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Drone model is required']
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required']
  },
  
  // Technical Specifications
  specifications: {
    maxPayload: { type: Number, required: true }, // in kg
    maxSpeed: { type: Number, required: true }, // in km/h
    maxRange: { type: Number, required: true }, // in km
    batteryCapacity: { type: Number, required: true }, // in mAh
    flightTime: { type: Number, required: true }, // in minutes
    dimensions: {
      length: Number, // in cm
      width: Number,
      height: Number,
      weight: Number // in kg
    },
    camera: {
      hasCamera: { type: Boolean, default: true },
      resolution: String,
      hasNightVision: { type: Boolean, default: false }
    },
    sensors: {
      gps: { type: Boolean, default: true },
      obstacle: { type: Boolean, default: true },
      weather: { type: Boolean, default: false },
      altitude: { type: Boolean, default: true }
    }
  },
  
  // Current Status
  status: {
    type: String,
    enum: [
      'available',      // Ready for assignment
      'assigned',       // Assigned to an order
      'in_flight',      // Currently flying
      'returning',      // Returning to base
      'charging',       // Battery charging
      'maintenance',    // Under maintenance
      'offline',        // Not operational
      'emergency'       // Emergency situation
    ],
    default: 'offline'
  },
  
  // Location and Position
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, default: 0 }, // in meters
    heading: { type: Number, default: 0 }, // in degrees (0-360)
    speed: { type: Number, default: 0 }, // current speed in km/h
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Home Base Information
  homeBase: {
    name: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    chargingStation: String
  },
  
  // Battery Information
  battery: {
    currentLevel: { type: Number, min: 0, max: 100, default: 100 }, // percentage
    isCharging: { type: Boolean, default: false },
    lastChargedAt: Date,
    estimatedFlightTime: { type: Number, default: 0 }, // remaining flight time in minutes
    chargingStartedAt: Date,
    lowBatteryThreshold: { type: Number, default: 20 } // percentage
  },
  
  // Assignment Information
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  assignedOperator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Operating Zone
  operatingZone: {
    name: String,
    boundaries: [{
      latitude: Number,
      longitude: Number
    }],
    maxAltitude: { type: Number, default: 120 }, // in meters
    restrictions: [String] // no-fly zones, time restrictions, etc.
  },
  
  // Flight History
  flightHistory: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    startTime: { type: Date, required: true },
    endTime: Date,
    startLocation: {
      latitude: Number,
      longitude: Number
    },
    endLocation: {
      latitude: Number,
      longitude: Number
    },
    route: [{
      latitude: Number,
      longitude: Number,
      altitude: Number,
      timestamp: Date,
      speed: Number
    }],
    distance: Number, // total distance in km
    flightTime: Number, // in minutes
    batteryUsed: Number, // percentage
    issues: [String],
    status: {
      type: String,
      enum: ['completed', 'aborted', 'emergency', 'maintenance_required']
    }
  }],
  
  // Maintenance Information
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    totalFlightHours: { type: Number, default: 0 },
    totalFlights: { type: Number, default: 0 },
    totalDistance: { type: Number, default: 0 }, // in km
    serviceHistory: [{
      date: Date,
      type: { type: String, enum: ['routine', 'repair', 'upgrade', 'inspection'] },
      description: String,
      technician: String,
      cost: Number,
      partsReplaced: [String],
      nextServiceDue: Date
    }],
    issues: [{
      reported: { type: Date, default: Date.now },
      description: String,
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      status: { type: String, enum: ['open', 'investigating', 'resolved'], default: 'open' },
      resolvedAt: Date
    }]
  },
  
  // Performance Metrics
  performance: {
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, // in minutes
    averageSpeed: { type: Number, default: 0 }, // in km/h
    efficiency: { type: Number, default: 100 }, // percentage
    reliability: { type: Number, default: 100 }, // percentage
    customerRating: { type: Number, default: 5, min: 1, max: 5 }
  },
  
  // Safety and Compliance
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateNumber: String
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    coverage: Number,
    expiryDate: Date
  },
  
  // Communication
  communicationStatus: {
    lastPing: Date,
    signalStrength: { type: Number, min: 0, max: 100 }, // percentage
    dataConnection: { type: String, enum: ['4G', '5G', 'WiFi', 'Satellite'] },
    emergencyContactEnabled: { type: Boolean, default: true }
  },
  
  // Weather Conditions
  operationalWeather: {
    maxWindSpeed: { type: Number, default: 25 }, // km/h
    minVisibility: { type: Number, default: 5 }, // km
    maxPrecipitation: { type: Number, default: 2 }, // mm/h
    temperatureRange: {
      min: { type: Number, default: -10 }, // Celsius
      max: { type: Number, default: 40 }
    }
  },
  
  // Emergency Features
  emergency: {
    parachuteDeployed: { type: Boolean, default: false },
    returnToHomeTriggered: { type: Boolean, default: false },
    emergencyLanding: { type: Boolean, default: false },
    lastEmergencyDate: Date,
    emergencyContacts: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
droneSchema.index({ droneId: 1 });
droneSchema.index({ status: 1 });
droneSchema.index({ currentLocation: '2dsphere' });
droneSchema.index({ assignedOperator: 1 });
droneSchema.index({ currentOrder: 1 });

// Virtual for battery status
droneSchema.virtual('batteryStatus').get(function() {
  if (this.battery.currentLevel <= this.battery.lowBatteryThreshold) {
    return 'low';
  } else if (this.battery.currentLevel <= 50) {
    return 'medium';
  } else {
    return 'good';
  }
});

// Virtual for operational status
droneSchema.virtual('isOperational').get(function() {
  return ['available', 'assigned', 'in_flight', 'returning'].includes(this.status) &&
         this.battery.currentLevel > this.battery.lowBatteryThreshold &&
         this.communicationStatus.lastPing &&
         (Date.now() - this.communicationStatus.lastPing.getTime()) < 300000; // 5 minutes
});

// Virtual for distance from home
droneSchema.virtual('distanceFromHome').get(function() {
  if (!this.currentLocation.latitude || !this.homeBase.coordinates.latitude) return 0;
  
  const R = 6371; // Earth's radius in km
  const dLat = (this.currentLocation.latitude - this.homeBase.coordinates.latitude) * Math.PI / 180;
  const dLon = (this.currentLocation.longitude - this.homeBase.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.homeBase.coordinates.latitude * Math.PI / 180) * 
    Math.cos(this.currentLocation.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 100) / 100; // Round to 2 decimal places
});

// Method to update location
droneSchema.methods.updateLocation = function(latitude, longitude, altitude = null, heading = null, speed = null) {
  this.currentLocation = {
    latitude,
    longitude,
    altitude: altitude || this.currentLocation.altitude,
    heading: heading || this.currentLocation.heading,
    speed: speed || 0,
    lastUpdated: new Date()
  };
  
  return this.save();
};

// Method to assign to order
droneSchema.methods.assignToOrder = function(orderId, operatorId) {
  this.currentOrder = orderId;
  this.assignedOperator = operatorId;
  this.status = 'assigned';
  return this.save();
};

// Method to complete delivery
droneSchema.methods.completeDelivery = function(flightData) {
  // Add to flight history
  this.flightHistory.push({
    orderId: this.currentOrder,
    ...flightData,
    status: 'completed'
  });
  
  // Update performance metrics
  this.performance.successfulDeliveries += 1;
  this.performance.totalFlights = this.flightHistory.length;
  
  // Calculate average delivery time
  const completedFlights = this.flightHistory.filter(f => f.status === 'completed');
  if (completedFlights.length > 0) {
    const totalTime = completedFlights.reduce((sum, flight) => sum + flight.flightTime, 0);
    this.performance.averageDeliveryTime = Math.round(totalTime / completedFlights.length);
  }
  
  // Reset assignment
  this.currentOrder = null;
  this.assignedOperator = null;
  this.status = 'returning';
  
  return this.save();
};

// Method to report maintenance issue
droneSchema.methods.reportIssue = function(description, severity = 'medium') {
  this.maintenance.issues.push({
    description,
    severity,
    reported: new Date()
  });
  
  if (severity === 'critical') {
    this.status = 'maintenance';
  }
  
  return this.save();
};

// Method to check if drone can take order
droneSchema.methods.canTakeOrder = function(payload = 0, distance = 0) {
  // Check basic operational status
  if (!this.isOperational || this.status !== 'available') return false;
  
  // Check payload capacity
  if (payload > this.specifications.maxPayload) return false;
  
  // Check if drone has enough battery for the trip
  const estimatedFlightTime = (distance / this.specifications.maxSpeed) * 60 * 2; // Round trip
  const requiredBattery = (estimatedFlightTime / this.specifications.flightTime) * 100;
  
  if (this.battery.currentLevel < requiredBattery + 20) return false; // 20% safety margin
  
  return true;
};

// Method to estimate delivery time
droneSchema.methods.estimateDeliveryTime = function(distance) {
  const travelTime = (distance / this.specifications.maxSpeed) * 60; // in minutes
  const setupTime = 5; // 5 minutes for takeoff and landing
  return Math.ceil(travelTime + setupTime);
};

// Pre-save middleware to update maintenance counters
droneSchema.pre('save', function(next) {
  if (this.isModified('flightHistory')) {
    const totalDistance = this.flightHistory.reduce((sum, flight) => sum + (flight.distance || 0), 0);
    const totalTime = this.flightHistory.reduce((sum, flight) => sum + (flight.flightTime || 0), 0);
    
    this.maintenance.totalDistance = totalDistance;
    this.maintenance.totalFlightHours = Math.round(totalTime / 60 * 10) / 10; // Convert to hours
    this.maintenance.totalFlights = this.flightHistory.length;
  }
  next();
});

export default mongoose.model('Drone', droneSchema);