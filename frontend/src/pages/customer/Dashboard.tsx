import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  Truck,
  Utensils,
  TrendingUp,
  Gift,
  Search
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';

const CustomerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Mock data for demonstration
  const recentOrders = [
    {
      id: '1',
      restaurant: 'Pizza Palace',
      items: ['Margherita Pizza', 'Caesar Salad'],
      status: 'delivered',
      total: 28.50,
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      restaurant: 'Burger Junction',
      items: ['Double Cheeseburger', 'Fries'],
      status: 'in_transit',
      total: 15.99,
      date: '2024-01-14',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const featuredRestaurants = [
    {
      id: '1',
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.8,
      deliveryTime: '25-35 min',
      image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.6,
      deliveryTime: '20-30 min',
      image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Pasta Roma',
      cuisine: 'Italian',
      rating: 4.7,
      deliveryTime: '30-40 min',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const quickStats = [
    {
      title: 'Total Orders',
      value: user?.customerProfile?.totalOrders || 0,
      icon: Truck,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Spent',
      value: `$${user?.customerProfile?.totalSpent || 0}`,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Loyalty Points',
      value: user?.customerProfile?.loyaltyPoints || 0,
      icon: Gift,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready for your next delicious delivery?
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/customer/restaurants"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Browse Restaurants</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/customer/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={order.image}
                  alt={order.restaurant}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{order.restaurant}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {order.items.join(', ')}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">${order.total}</span>
                  </div>
                </div>
                {order.status === 'in_transit' && (
                  <Link
                    to={`/customer/track/${order.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors"
                  >
                    Track
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Restaurants */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Featured Restaurants</h2>
            <Link
              to="/customer/restaurants"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={`/customer/restaurant/${restaurant.id}`}
                  className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors block"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{restaurant.name}</p>
                    <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Current Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delivering to</h3>
            <p className="text-gray-600">123 Main Street, Downtown</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
              Change Address
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;