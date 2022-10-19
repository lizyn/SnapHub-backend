import React, { useLocation, Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();
  RequireAuth.propTypes = {
    allowedRoles: PropTypes.func.isRequired
  };

  return auth.roles.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
