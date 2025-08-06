# DroneDelivery Platform 🚁

A complete drone-based food delivery platform built with the MERN stack (MongoDB, Express, React, Node.js) and Firebase for real-time features.

## 🌟 Features

### For Customers
- **Browse Restaurants**: Discover local restaurants with advanced filtering
- **Real-time Tracking**: Track your order and drone location live
- **AI Chatbot**: Get instant help and recommendations
- **Multiple Payment Options**: Credit cards, digital wallets, and more
- **Order History**: View past orders and reorder favorites
- **Loyalty Program**: Earn points and get rewards

### For Restaurant Owners
- **Menu Management**: Easy-to-use interface for managing menu items
- **Order Processing**: Streamlined workflow for order fulfillment
- **Analytics Dashboard**: Insights into sales, popular items, and performance
- **Real-time Notifications**: Get notified of new orders instantly
- **Revenue Tracking**: Monitor earnings and payouts

### For Administrators & Drone Operators
- **Fleet Management**: Monitor and control drone fleet
- **Real-time Monitoring**: Live tracking of all active drones
- **User Management**: Manage customers, restaurants, and operators
- **System Analytics**: Comprehensive platform statistics
- **Emergency Controls**: Safety features and emergency protocols

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Firebase Admin SDK** for push notifications
- **Stripe** for payment processing
- **OpenAI API** for AI features

### Infrastructure
- **Docker** containers for easy deployment
- **Nginx** reverse proxy
- **Redis** for caching and sessions
- **Firebase** for real-time database and notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7+
- Redis (optional, for production)
- Firebase project (for real-time features)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/drone-delivery-platform.git
   cd drone-delivery-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Backend (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configurations
   ```
   
   Frontend (`frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your configurations
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend application on http://localhost:5173

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 📱 User Roles & Demo Accounts

### Customer
- **Email**: customer@demo.com
- **Password**: password
- **Features**: Browse restaurants, place orders, track deliveries

### Restaurant Owner
- **Email**: seller@demo.com
- **Password**: password
- **Features**: Manage menu, process orders, view analytics

### Admin/Drone Operator
- **Email**: admin@demo.com
- **Password**: password
- **Features**: Fleet management, user management, system analytics

## 🏗 Project Structure

```
drone-delivery-platform/
├── backend/                 # Node.js backend
│   ├── config/             # Database and service configurations
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── utils/         # Helper functions
│   │   └── App.tsx        # Main App component
├── docker-compose.yml     # Docker services configuration
├── nginx/                 # Nginx configuration
└── README.md
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://firebase.google.com/
2. Enable Authentication, Realtime Database, and Cloud Messaging
3. Download service account key and add to backend `.env`
4. Add Firebase config to frontend `.env`

### Stripe Setup
1. Create a Stripe account at https://stripe.com/
2. Get API keys from the dashboard
3. Add keys to backend and frontend `.env` files

### Google Maps Setup
1. Enable Google Maps JavaScript API
2. Create an API key
3. Add to frontend `.env`

## 📊 Database Schema

### Key Collections
- **Users**: Customer, seller, and admin profiles
- **Restaurants**: Restaurant information and menus
- **Orders**: Order details and tracking
- **Drones**: Drone fleet management
- **Reviews**: Customer feedback

### Sample Data
Run the seed script to populate the database with sample data:
```bash
cd backend && npm run seed
```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Encrypted password storage

## 📡 Real-time Features

- Live order tracking
- Drone location updates
- Instant notifications
- Chat support
- Fleet monitoring
- Emergency alerts

## 🎨 UI/UX Features

- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Intuitive navigation
- Accessibility compliance
- Progressive Web App (PWA) support

## 📈 Analytics & Monitoring

- Order tracking and metrics
- Revenue analytics
- User behavior insights
- Drone performance monitoring
- System health checks
- Error logging and reporting

## 🚀 Deployment

### Production Deployment with Docker
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Set up production MongoDB and Redis instances
2. Configure environment variables for production
3. Build frontend: `cd frontend && npm run build`
4. Deploy backend to your server
5. Serve frontend static files with Nginx

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run integration tests
npm run test:integration
```

## 📚 API Documentation

API documentation is available at `/api/docs` when running in development mode.

### Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/restaurants` - Get restaurants
- `POST /api/orders` - Create order
- `GET /api/orders/:id/track` - Track order
- `GET /api/drones` - Get drone fleet status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@dronedelivery.com
- 💬 Discord: [Join our server](https://discord.gg/dronedelivery)
- 📖 Documentation: [docs.dronedelivery.com](https://docs.dronedelivery.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/drone-delivery-platform/issues)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice ordering integration
- [ ] Advanced AI recommendations
- [ ] Multi-language support
- [ ] Blockchain integration for transparency
- [ ] IoT sensors integration
- [ ] Weather-based delivery optimization
- [ ] Carbon footprint tracking

---

**Built with ❤️ by the DroneDelivery Team**

*Revolutionizing food delivery, one drone at a time* 🚁🍕