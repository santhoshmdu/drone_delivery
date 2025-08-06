import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plane, ArrowRight } from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { getCurrentUser } from '../../store/slices/authSlice';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after animation delay
    const contentTimer = setTimeout(() => setShowContent(true), 1000);

    // Check for existing token and get user data
    if (token && !user) {
      dispatch(getCurrentUser());
    }

    return () => clearTimeout(contentTimer);
  }, [dispatch, token, user]);

  useEffect(() => {
    // Redirect based on authentication status and user role
    if (isAuthenticated && user && !isLoading) {
      const timer = setTimeout(() => {
        switch (user.role) {
          case 'customer':
            navigate('/customer');
            break;
          case 'seller':
            navigate('/seller');
            break;
          case 'admin':
          case 'drone_operator':
            navigate('/admin');
            break;
          default:
            navigate('/role-selection');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  const handleGetStarted = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-6">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
            <Plane className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        {/* Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            DroneDelivery
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Future of Food Delivery
          </p>
        </motion.div>

        {/* Content */}
        {showContent && !isLoading && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="max-w-md mx-auto space-y-4 text-blue-50">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p>Lightning-fast drone delivery</p>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p>Real-time order tracking</p>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p>AI-powered recommendations</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Loading State */}
        {(isLoading || (isAuthenticated && user)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-100">
              {isAuthenticated && user 
                ? `Welcome back, ${user.firstName}! Redirecting to your dashboard...`
                : 'Loading...'
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-auto text-blue-800 opacity-50">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default SplashScreen;