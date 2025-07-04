import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const FormModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  error,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  maxWidth = 'sm',
  fullWidth = true,
  steps = null,
  activeStep = 0,
  onNext,
  onBack,
  disableSubmit = false,
  showCloseButton = true,
  actions = null,
  scrollable = true
}) => {
  const [internalStep, setInternalStep] = useState(0);
  
  const currentStep = steps ? (activeStep !== undefined ? activeStep : internalStep) : 0;
  const isLastStep = steps ? currentStep === steps.length - 1 : true;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      setInternalStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setInternalStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleClose = () => {
    setInternalStep(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: subtitle ? 1 : 2
        }}
      >
        <Box>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {showCloseButton && (
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {steps && (
        <>
          <Box sx={{ px: 3, pb: 2 }}>
            <Stepper activeStep={currentStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Divider />
        </>
      )}

      <DialogContent
        sx={{
          pt: 3,
          ...(scrollable && { overflow: 'auto' })
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {children}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        {actions ? (
          actions
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outlined"
            >
              {cancelLabel}
            </Button>
            
            {steps && !isFirstStep && (
              <Button
                onClick={handleBack}
                disabled={loading}
                variant="outlined"
              >
                Back
              </Button>
            )}
            
            {steps && !isLastStep ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                variant="contained"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || disableSubmit}
                variant="contained"
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Saving...' : submitLabel}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Confirmation dialog variant
export const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  severity = 'warning',
  loading = false
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert severity={severity} sx={{ border: 'none', p: 0 }}>
          {message}
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={severity === 'error' ? 'error' : 'primary'}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Processing...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};