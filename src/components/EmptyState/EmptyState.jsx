import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const iconMap = {
  empty: InboxIcon,
  search: SearchOffIcon,
  error: ErrorOutlineIcon
};

export const EmptyState = ({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  icon: CustomIcon,
  children
}) => {
  const Icon = CustomIcon || iconMap[type] || InboxIcon;
  
  const defaultTitles = {
    empty: 'No data available',
    search: 'No results found',
    error: 'Something went wrong'
  };
  
  const defaultDescriptions = {
    empty: 'There are no items to display at the moment.',
    search: 'Try adjusting your search criteria or filters.',
    error: 'An error occurred while loading the data.'
  };

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        backgroundColor: 'grey.50',
        border: '2px dashed',
        borderColor: 'grey.300'
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Icon
          sx={{
            fontSize: 64,
            color: 'text.disabled',
            mb: 2
          }}
        />
        <Typography variant="h5" gutterBottom color="text.secondary">
          {title || defaultTitles[type]}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description || defaultDescriptions[type]}
        </Typography>
      </Box>
      
      {onAction && actionLabel && (
        <Button
          variant="contained"
          onClick={onAction}
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
        >
          {actionLabel}
        </Button>
      )}
      
      {children}
    </Paper>
  );
};

// Specific empty states for different scenarios
export const EmptyDeviceList = ({ onAddDevice }) => (
  <EmptyState
    type="empty"
    title="No devices found"
    description="Start by adding your first device to the inventory."
    actionLabel="Add New Device"
    onAction={onAddDevice}
    icon={InboxIcon}
  />
);

export const EmptyServiceLogs = ({ onAddLog }) => (
  <EmptyState
    type="empty"
    title="No service logs"
    description="Service visit logs will appear here once you start logging maintenance activities."
    actionLabel="Log New Visit"
    onAction={onAddLog}
  />
);

export const EmptyAlerts = ({ onAddAlert }) => (
  <EmptyState
    type="empty"
    title="No alerts"
    description="System alerts and notifications will appear here."
    actionLabel="Create Alert"
    onAction={onAddAlert}
  />
);

export const EmptyPhotos = ({ onUploadPhoto }) => (
  <EmptyState
    type="empty"
    title="No photos uploaded"
    description="Upload photos related to device installations, maintenance, or issues."
    actionLabel="Upload Photo"
    onAction={onUploadPhoto}
  />
);

export const EmptySearchResults = ({ onClearSearch }) => (
  <EmptyState
    type="search"
    title="No matching results"
    description="Try different keywords or clear your search to see all items."
    actionLabel="Clear Search"
    onAction={onClearSearch}
  />
);

export const ErrorState = ({ onRetry, error }) => (
  <EmptyState
    type="error"
    title="Failed to load data"
    description={error?.message || "There was a problem loading the data. Please try again."}
    actionLabel="Retry"
    onAction={onRetry}
  />
);