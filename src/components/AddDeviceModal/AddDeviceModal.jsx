import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { mockDevices, MOCK_USERS } from '../../Api/mockData';
import { QRScanner } from '../QRScanner/QRScanner';
import { useAuth } from '../../context/AuthContext';

const deviceTypes = [
  'ECG Machine',
  'Ventilator',
  'Infusion Pump',
  'Defibrillator',
  'X-Ray Machine',
  'Ultrasound',
  'MRI Machine',
  'CT Scanner',
  'Dialysis Machine',
  'Anesthesia Machine',
  'Other'
];

const facilities = [
  'City Hospital',
  'General Clinic',
  'Trauma Center',
  'Maternity Ward',
  'Emergency Department',
  'ICU',
  'Cardiology Department',
  'Radiology Department'
];

const steps = ['Device Information', 'Technical Details', 'AMC/CMC Setup'];

const initialFormData = {
  id: '',
  type: '',
  facility: '',
  serialNumber: '',
  manufacturer: '',
  model: '',
  purchaseDate: '',
  warrantyExpiry: '',
  amcStatus: 'Active',
  amcExpiry: '',
  cmcProvider: '',
  status: 'Online',
  battery: 100,
  lastServiceDate: '',
  assignedTechnician: '',
  notes: ''
};

export const AddDeviceModal = ({ open, onClose, onDeviceAdded }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.id || !formData.type || !formData.facility) {
          setError('Please fill in all required fields');
          return false;
        }
        // Check if device ID already exists
        if (mockDevices.some(device => device.id === formData.id)) {
          setError('Device ID already exists');
          return false;
        }
        break;
      case 1:
        if (!formData.serialNumber || !formData.manufacturer || !formData.model) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.amcExpiry) {
          setError('Please set AMC expiry date');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDevice = {
        ...formData,
        lastServiceDate: formData.lastServiceDate || new Date().toISOString().split('T')[0],
        // If user is a technician and no technician is assigned, assign to current user
        assignedTechnician: formData.assignedTechnician || (user.role === 'technician' ? user.id : null),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to mock data
      mockDevices.push(newDevice);
      
      // Store in localStorage
      localStorage.setItem('devices', JSON.stringify(mockDevices));

      onDeviceAdded(newDevice);
      handleClose();
    } catch (err) {
      setError('Failed to add device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData(initialFormData);
    setError('');
    setShowQRScanner(false);
    onClose();
  };

  const handleQRScan = (result) => {
    if (result) {
      // Assume QR contains device ID or parse JSON
      try {
        const qrData = JSON.parse(result);
        setFormData(prev => ({ ...prev, ...qrData }));
      } catch {
        // If not JSON, treat as device ID
        setFormData(prev => ({ ...prev, id: result }));
      }
    }
    setShowQRScanner(false);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                name="id"
                label="Device ID"
                value={formData.id}
                onChange={handleInputChange}
                required
                fullWidth
                placeholder="e.g., DEV007"
              />
              <IconButton 
                onClick={() => setShowQRScanner(true)}
                color="primary"
                title="Scan QR Code"
              >
                <QrCodeScannerIcon />
              </IconButton>
            </Box>
            
            <FormControl fullWidth required>
              <InputLabel>Device Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="Device Type"
              >
                {deviceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Facility</InputLabel>
              <Select
                name="facility"
                value={formData.facility}
                onChange={handleInputChange}
                label="Facility"
              >
                {facilities.map(facility => (
                  <MenuItem key={facility} value={facility}>{facility}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Initial Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Initial Status"
              >
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="serialNumber"
              label="Serial Number"
              value={formData.serialNumber}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              name="manufacturer"
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              name="model"
              label="Model"
              value={formData.model}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              name="purchaseDate"
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              name="warrantyExpiry"
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              name="battery"
              label="Battery Level (%)"
              type="number"
              value={formData.battery}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>AMC Status</InputLabel>
              <Select
                name="amcStatus"
                value={formData.amcStatus}
                onChange={handleInputChange}
                label="AMC Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="amcExpiry"
              label="AMC Expiry Date"
              type="date"
              value={formData.amcExpiry}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <TextField
              name="cmcProvider"
              label="CMC Provider"
              value={formData.cmcProvider}
              onChange={handleInputChange}
              fullWidth
            />

            <TextField
              name="lastServiceDate"
              label="Last Service Date"
              type="date"
              value={formData.lastServiceDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Assign Technician</InputLabel>
              <Select
                name="assignedTechnician"
                value={formData.assignedTechnician}
                onChange={handleInputChange}
                label="Assign Technician"
              >
                <MenuItem value="">Unassigned</MenuItem>
                {Object.values(MOCK_USERS)
                  .filter(userData => userData.role === 'technician')
                  .map(tech => (
                    <MenuItem key={tech.id} value={tech.id}>
                      {tech.name} ({tech.username})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              name="notes"
              label="Additional Notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add New Device</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Adding Device...' : 'Add Device'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <QRScanner
        open={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </>
  );
};