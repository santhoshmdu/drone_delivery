import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { getCurrentUser } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, user, token, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, try to get user data
    if (token && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [token, user, isLoading, dispatch]);

  // Show loading while checking authentication
  if (isLoading || (token && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = 
      user.role === 'customer' ? '/customer' :
      user.role === 'seller' ? '/seller' :
      user.role === 'admin' || user.role === 'drone_operator' ? '/admin' :
      '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;