import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  Paper,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';

export const QRScanner = ({ open, onClose, onScan }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (open) {
      checkCameraPermission();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  const checkCameraPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 0) {
        setHasCamera(true);
        startCamera();
      } else {
        setHasCamera(false);
        setError('No camera found on this device');
      }
    } catch (err) {
      setHasCamera(false);
      setError('Camera access denied or not supported');
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }]
          });
          setFlashEnabled(!flashEnabled);
        } catch (err) {
          console.error('Flash not supported:', err);
        }
      }
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // In a real implementation, you would use a QR code scanning library here
      // For now, we'll simulate QR code detection
      simulateQRDetection();
    }
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection - in real app, use libraries like qr-scanner or jsQR
    const mockQRData = [
      'DEV008',
      'DEV009', 
      'DEV010',
      '{"id":"DEV011","type":"ECG Machine","facility":"City Hospital"}'
    ];
    
    const randomData = mockQRData[Math.floor(Math.random() * mockQRData.length)];
    handleScanSuccess(randomData);
  };

  const handleScanSuccess = (data) => {
    if (data) {
      onScan(data);
      handleClose();
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setManualInput('');
    setError('');
    setFlashEnabled(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">QR Code Scanner</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {hasCamera && isScanning ? (
          <Box sx={{ position: 'relative' }}>
            <Paper elevation={3} sx={{ p: 1, mb: 2 }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                autoPlay
                playsInline
                muted
              />
              
              {/* QR Code scanning overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  border: '2px solid #fff',
                  borderRadius: '16px',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    width: '30px',
                    height: '30px',
                    border: '4px solid #1976d2',
                    borderRight: 'transparent',
                    borderBottom: 'transparent',
                    borderRadius: '16px 0 0 0'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '30px',
                    height: '30px',
                    border: '4px solid #1976d2',
                    borderLeft: 'transparent',
                    borderBottom: 'transparent',
                    borderRadius: '0 16px 0 0'
                  }
                }}
              />

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
              <Button
                variant="contained"
                onClick={captureFrame}
                startIcon={<PhotoCameraIcon />}
              >
                Capture & Scan
              </Button>
              <IconButton onClick={toggleFlash} color="primary">
                {flashEnabled ? <FlashOffIcon /> : <FlashOnIcon />}
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" align="center">
              Position the QR code within the frame and tap "Capture & Scan"
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <QrCodeScannerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Camera not available
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please enable camera permissions or enter the device ID manually
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Manual Entry
          </Typography>
          <TextField
            fullWidth
            label="Enter Device ID or QR Code Data"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g., DEV001 or JSON data"
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleManualSubmit}
          disabled={!manualInput.trim()}
        >
          Use Manual Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};