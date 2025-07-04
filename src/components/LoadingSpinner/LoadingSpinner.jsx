import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Paper
} from '@mui/material';

// Basic loading spinner
export const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 2
    }}
  >
    <CircularProgress size={size} />
    {message && (
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

// Full page loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6">{message}</Typography>
    </Paper>
  </Box>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box>
    {[...Array(rows)].map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="rectangular"
            height={48}
            sx={{ flex: 1 }}
          />
        ))}
      </Box>
    ))}
  </Box>
);

// Card skeleton loader
export const CardSkeleton = ({ count = 3 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {[...Array(count)].map((_, index) => (
      <Paper key={index} sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      </Paper>
    ))}
  </Box>
);

// Form skeleton loader
export const FormSkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Skeleton variant="text" width="40%" height={40} />
    <Skeleton variant="rectangular" height={56} />
    <Skeleton variant="rectangular" height={56} />
    <Skeleton variant="rectangular" height={56} />
    <Skeleton variant="rectangular" height={120} />
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </Box>
  </Box>
);

// Custom hook for loading states
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  
  const withLoading = React.useCallback(async (asyncFunction) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { loading, setLoading, withLoading };
};