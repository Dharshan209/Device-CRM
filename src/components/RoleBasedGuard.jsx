import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A guard component that renders its children only if the current user's role
 * is included in the `allowedRoles` prop.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to render if authorized.
 * @param {string[]} props.allowedRoles - An array of roles that are allowed to see the content.
 */
export const RoleBasedGuard = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // If user is not logged in or their role is not allowed, render nothing.
    return null;
  }

  // Otherwise, render the children.
  return <>{children}</>;
};