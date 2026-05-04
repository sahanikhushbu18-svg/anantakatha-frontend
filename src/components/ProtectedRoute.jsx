import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const { status, user } = useSelector((state) => state.auth);

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user?.userType !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};