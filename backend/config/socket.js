import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocketIO = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Join role-specific rooms
    socket.join(`role:${socket.userRole}`);

    // Customer-specific events
    if (socket.userRole === 'customer') {
      handleCustomerEvents(socket, io);
    }
    
    // Seller-specific events
    if (socket.userRole === 'seller') {
      handleSellerEvents(socket, io);
    }
    
    // Admin/Drone operator events
    if (socket.userRole === 'admin' || socket.userRole === 'drone_operator') {
      handleAdminEvents(socket, io);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`🔌 Socket error for user ${socket.userId}:`, error);
    });
  });
};

// Customer-specific socket events
const handleCustomerEvents = (socket, io) => {
  // Join order tracking room
  socket.on('track_order', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`👤 Customer ${socket.userId} tracking order ${orderId}`);
  });

  // Stop tracking order
  socket.on('stop_tracking', (orderId) => {
    socket.leave(`order:${orderId}`);
    console.log(`👤 Customer ${socket.userId} stopped tracking order ${orderId}`);
  });

  // Request current location update
  socket.on('request_location_update', (orderId) => {
    // Emit to drone operators handling this order
    io.to(`order:${orderId}`).emit('location_update_requested', { orderId });
  });
};

// Seller-specific socket events
const handleSellerEvents = (socket, io) => {
  // Join restaurant room
  socket.on('join_restaurant', (restaurantId) => {
    socket.join(`restaurant:${restaurantId}`);
    console.log(`🍽️ Seller ${socket.userId} joined restaurant ${restaurantId}`);
  });

  // Update order status
  socket.on('update_order_status', ({ orderId, status, note }) => {
    // Emit to customer tracking this order
    io.to(`order:${orderId}`).emit('order_status_updated', {
      orderId,
      status,
      note,
      timestamp: new Date().toISOString()
    });

    // Emit to admin dashboard
    io.to('role:admin').to('role:drone_operator').emit('order_status_updated', {
      orderId,
      status,
      note,
      timestamp: new Date().toISOString()
    });
    
    console.log(`🍽️ Order ${orderId} status updated to ${status}`);
  });

  // Menu item availability update
  socket.on('update_menu_availability', ({ restaurantId, itemId, isAvailable }) => {
    // Broadcast to all customers
    io.to('role:customer').emit('menu_item_updated', {
      restaurantId,
      itemId,
      isAvailable
    });
  });
};

// Admin/Drone operator socket events
const handleAdminEvents = (socket, io) => {
  // Join drone monitoring room
  socket.on('monitor_drone', (droneId) => {
    socket.join(`drone:${droneId}`);
    console.log(`🚁 Operator ${socket.userId} monitoring drone ${droneId}`);
  });

  // Update drone location
  socket.on('update_drone_location', ({ droneId, location, orderId }) => {
    // Emit to customers tracking orders handled by this drone
    if (orderId) {
      io.to(`order:${orderId}`).emit('drone_location_updated', {
        droneId,
        location,
        timestamp: new Date().toISOString()
      });
    }

    // Emit to admin dashboard
    io.to('role:admin').to('role:drone_operator').emit('drone_location_updated', {
      droneId,
      location,
      timestamp: new Date().toISOString()
    });

    console.log(`🚁 Drone ${droneId} location updated`);
  });

  // Drone status update
  socket.on('update_drone_status', ({ droneId, status, orderId }) => {
    // Emit to customers if drone is handling their order
    if (orderId) {
      io.to(`order:${orderId}`).emit('drone_status_updated', {
        droneId,
        status,
        timestamp: new Date().toISOString()
      });
    }

    // Emit to admin dashboard
    io.to('role:admin').to('role:drone_operator').emit('drone_status_updated', {
      droneId,
      status,
      timestamp: new Date().toISOString()
    });

    console.log(`🚁 Drone ${droneId} status updated to ${status}`);
  });

  // Emergency alert
  socket.on('emergency_alert', ({ droneId, location, message }) => {
    // Emit to all admins and operators
    io.to('role:admin').to('role:drone_operator').emit('emergency_alert', {
      droneId,
      location,
      message,
      timestamp: new Date().toISOString(),
      severity: 'high'
    });

    console.log(`🚨 Emergency alert for drone ${droneId}: ${message}`);
  });
};

// Helper functions to emit events from other parts of the application
export const emitOrderUpdate = (io, orderId, update) => {
  io.to(`order:${orderId}`).emit('order_updated', {
    orderId,
    ...update,
    timestamp: new Date().toISOString()
  });
};

export const emitDroneUpdate = (io, droneId, update) => {
  io.to(`drone:${droneId}`).emit('drone_updated', {
    droneId,
    ...update,
    timestamp: new Date().toISOString()
  });
};

export const emitNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification', {
    ...notification,
    timestamp: new Date().toISOString()
  });
};

export const emitBroadcastToRole = (io, role, event, data) => {
  io.to(`role:${role}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};