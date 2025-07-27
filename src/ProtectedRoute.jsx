import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ roles, partnerOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store the current location for later redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (roles && !roles.includes(user.role)) {
    // Redirect based on user role
    return <Navigate to="/unauthorized" replace />;
  }

  // Partner-only routes
  if (partnerOnly && user.role !== 'partner') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Specific route restrictions based on role
  const currentPath = location.pathname;
  
  // Partner role restrictions
  if (user.role === 'partner') {
    const partnerAllowedRoutes = [

      '/CoursesPartner',
      '/courses/:courseId/detailsPartner',
      '/courses/:courseId/editPartner',
      '/ProfilePage',
      '/notifications'
    ];

    // Check if current path matches any partner-allowed route pattern
    const isAllowed = partnerAllowedRoutes.some(route => {
      // Convert route pattern to regex for dynamic routes
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentPath);
    });
  
    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  };

  // Student role restrictions


  // Trainer role restrictions
  if (user.role === 'trainer') {
    const trainerAllowedRoutes = [
      '/dashboard',
      '/courses',
      '/courses/add',
      '/courses/addSame',
      '/courses/:courseId/details',
      '/courses/:courseId/edit',
      '/allcorcrsestrainer',
      '/ProfilePage',
      '/notifications'
    ];

    const isAllowed = trainerAllowedRoutes.some(route => {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentPath);
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Manager role restrictions
  if (user.role === 'manager') {
    const managerAllowedRoutes = [
      '/dashboard',
      '/registrations',
      '/registrations/all',
      '/registrations/pending',
      '/registrations/approved',
      '/registrations/rejected',
      '/registrations/:registrationId/details',
      '/courses',
      '/courses/add',
      '/courses/addSame',
      '/courses/all',
      '/courses/:courseId/details',
      '/courses/:courseId/edit',
      '/courses/categories',
      '/courses/categories/add',
      '/courses/categories/:categoryId/details',
      '/students',
      '/students/add',
      '/students/all',
      '/students/:userId/details',
      '/users',
      '/users/add',
      '/ProfilePage',
      '/notifications',
      '/notifications/:notificationsId'
    ];

    const isAllowed = managerAllowedRoutes.some(route => {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentPath);
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Admin has access to all routes
  if (user.role === 'Admin') {
    // Admin can access everything
    return <Outlet />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;