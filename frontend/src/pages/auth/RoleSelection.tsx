import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Store, Settings, ArrowRight, ArrowLeft } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Order delicious food delivered by drones',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Browse restaurants',
        'Real-time tracking',
        'AI recommendations',
        'Loyalty rewards'
      ]
    },
    {
      id: 'seller',
      title: 'Restaurant Owner',
      description: 'Manage your restaurant and reach more customers',
      icon: Store,
      color: 'from-green-500 to-green-600',
      features: [
        'Menu management',
        'Order processing',
        'Sales analytics',
        'Customer insights'
      ]
    },
    {
      id: 'drone_operator',
      title: 'Drone Operator',
      description: 'Operate drones and manage deliveries',
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Fleet monitoring',
        'Delivery management',
        'Safety protocols',
        'Performance tracking'
      ]
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/register', { state: { role: selectedRole } });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleBack}
            className="absolute top-8 left-8 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select how you'd like to use DroneDelivery. You can always change this later in your profile.
            </p>
          </motion.div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative cursor-pointer group ${
                  isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Header with Gradient */}
                  <div className={`bg-gradient-to-r ${role.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8" />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </motion.div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                    <p className="text-white/90">{role.description}</p>
                  </div>

                  {/* Features List */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Key Features:</h4>
                    <ul className="space-y-3">
                      {role.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                          className="flex items-center space-x-3"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${role.color}`}></div>
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Overlay */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-blue-500/10 pointer-events-none"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: selectedRole ? 1.05 : 1 }}
            whileTap={{ scale: selectedRole ? 0.95 : 1 }}
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-4 rounded-full font-semibold flex items-center space-x-2 mx-auto transition-all ${
              selectedRole
                ? 'bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Registration</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {!selectedRole && (
            <p className="text-gray-500 mt-4">Please select a role to continue</p>
          )}
        </div>

        {/* Already have account */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;