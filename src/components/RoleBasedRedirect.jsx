import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const roleFirstPages = {
  inventorymanager: '/',
  cashier: '/',
  admin: '/dashboard',
  partner: '/CoursesPartner',
};

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role) {
      const firstPage = roleFirstPages[user.role];
      if (firstPage) {
        navigate(firstPage);
      }
    }
  }, [user, navigate]);

  return null;
};

export default RoleBasedRedirect;