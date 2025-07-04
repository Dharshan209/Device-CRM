import React from 'react';
import { Chip } from '@mui/material';

export const StatusChip = ({ status }) => {
  const statusColors = {
    Online: 'success',
    Offline: 'error',
    Maintenance: 'warning',
    Active: 'success',
    Expired: 'error',
    Upcoming: 'warning',
  };

  return <Chip label={status} color={statusColors[status] || 'default'} size="small" />;
};