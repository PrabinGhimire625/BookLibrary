import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Ensure this is being set at login

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  // ✅ Must return the JSX element
  return <Component />;
};

export default ProtectedRoute;
