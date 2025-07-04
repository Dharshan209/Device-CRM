import { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mockDevices } from '../Api/mockData';
import { useAuth } from '../context/AuthContext';

// Mock data for alerts and photos
const mockAlerts = [
  {
    id: 'ALR001',
    deviceId: 'DEV002',
    type: 'critical',
    title: 'Device Offline',
    description: 'Ventilator has been offline for 30 minutes',
    timestamp: '2025-01-04T10:30:00Z',
    acknowledged: false,
    acknowledgedBy: null,
    priority: 'high'
  },
  {
    id: 'ALR002',
    deviceId: 'DEV004',
    type: 'warning',
    title: 'AMC Expiring Soon',
    description: 'Annual Maintenance Contract expires in 21 days',
    timestamp: '2025-01-04T09:15:00Z',
    acknowledged: true,
    acknowledgedBy: 'admin01',
    priority: 'medium'
  },
  {
    id: 'ALR003',
    deviceId: 'DEV003',
    type: 'info',
    title: 'Maintenance Scheduled',
    description: 'Preventive maintenance scheduled for tomorrow',
    timestamp: '2025-01-04T08:00:00Z',
    acknowledged: false,
    acknowledgedBy: null,
    priority: 'low'
  }
];

const mockPhotos = [
  {
    id: 'PHT001',
    deviceId: 'DEV001',
    title: 'Installation Photo',
    description: 'Device installation completed',
    url: 'https://via.placeholder.com/300x200?text=ECG+Machine+Install',
    timestamp: '2025-01-04T14:30:00Z',
    uploadedBy: 'tech01',
    category: 'installation'
  },
  {
    id: 'PHT002',
    deviceId: 'DEV002',
    title: 'Maintenance Issue',
    description: 'Power supply unit replacement',
    url: 'https://via.placeholder.com/300x200?text=Ventilator+Issue',
    timestamp: '2025-01-04T11:45:00Z',
    uploadedBy: 'tech01',
    category: 'maintenance'
  },
  {
    id: 'PHT003',
    deviceId: 'DEV003',
    title: 'Calibration Report',
    description: 'Post-calibration verification',
    url: 'https://via.placeholder.com/300x200?text=Infusion+Pump+Cal',
    timestamp: '2025-01-04T13:20:00Z',
    uploadedBy: 'admin01',
    category: 'calibration'
  }
];

export const AlertsAndPhotos = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [photos, setPhotos] = useState(mockPhotos);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newAlert, setNewAlert] = useState({
    deviceId: '',
    type: 'info',
    title: '',
    description: '',
    priority: 'medium'
  });
  const [newPhoto, setNewPhoto] = useState({
    deviceId: '',
    title: '',
    description: '',
    category: 'maintenance',
    file: null
  });

  // Load data from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('alerts');
    const savedPhotos = localStorage.getItem('photos');
    
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Error parsing saved alerts:', error);
      }
    }
    
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (error) {
        console.error('Error parsing saved photos:', error);
      }
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAcknowledgeAlert = (alertId) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedBy: user.id }
        : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    setSnackbar({
      open: true,
      message: 'Alert acknowledged successfully',
      severity: 'success'
    });
  };

  const handleDeleteAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
      setAlerts(updatedAlerts);
      localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
      setSnackbar({
        open: true,
        message: 'Alert deleted successfully',
        severity: 'success'
      });
    }
  };

  const handleAddAlert = () => {
    const alert = {
      id: `ALR${Date.now()}`,
      ...newAlert,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      acknowledgedBy: null
    };
    
    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    
    setNewAlert({
      deviceId: '',
      type: 'info',
      title: '',
      description: '',
      priority: 'medium'
    });
    setAlertDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Alert added successfully',
      severity: 'success'
    });
  };

  const handleAddPhoto = () => {
    const photo = {
      id: `PHT${Date.now()}`,
      ...newPhoto,
      url: newPhoto.file ? URL.createObjectURL(newPhoto.file) : 'https://via.placeholder.com/300x200?text=New+Photo',
      timestamp: new Date().toISOString(),
      uploadedBy: user.id
    };
    
    const updatedPhotos = [...photos, photo];
    setPhotos(updatedPhotos);
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));
    
    setNewPhoto({
      deviceId: '',
      title: '',
      description: '',
      category: 'maintenance',
      file: null
    });
    setPhotoDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Photo uploaded successfully',
      severity: 'success'
    });
  };

  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      const updatedPhotos = photos.filter(photo => photo.id !== photoId);
      setPhotos(updatedPhotos);
      localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      setSnackbar({
        open: true,
        message: 'Photo deleted successfully',
        severity: 'success'
      });
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alerts & Photo Logs</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<NotificationsIcon />}
            onClick={() => setAlertDialogOpen(true)}
          >
            Add Alert
          </Button>
          <Button
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            onClick={() => setPhotoDialogOpen(true)}
          >
            Upload Photo
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={
              <Badge badgeContent={unacknowledgedCount} color="error">
                Alerts
              </Badge>
            } 
          />
          <Tab label="Photo Logs" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Device ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} sx={{ 
                  backgroundColor: !alert.acknowledged ? 'rgba(255, 0, 0, 0.05)' : 'transparent'
                }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getAlertIcon(alert.type)}
                      <Chip 
                        label={alert.type} 
                        size="small" 
                        color={getAlertColor(alert.type)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{alert.deviceId}</TableCell>
                  <TableCell>{alert.title}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={alert.priority} 
                      size="small" 
                      color={getPriorityColor(alert.priority)}
                    />
                  </TableCell>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    {alert.acknowledged ? (
                      <Chip label="Acknowledged" size="small" color="success" />
                    ) : (
                      <Chip label="Pending" size="small" color="warning" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {!alert.acknowledged && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        sx={{ mr: 1 }}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt={photo.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {photo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {photo.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={photo.deviceId} size="small" />
                    <Chip label={photo.category} size="small" color="primary" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded by {photo.uploadedBy} • {new Date(photo.timestamp).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Download
                  </Button>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Alert Dialog */}
      <Dialog open={alertDialogOpen} onClose={() => setAlertDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Device ID</InputLabel>
              <Select
                value={newAlert.deviceId}
                onChange={(e) => setNewAlert(prev => ({ ...prev, deviceId: e.target.value }))}
                label="Device ID"
              >
                {mockDevices.map(device => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.id} - {device.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Alert Type</InputLabel>
              <Select
                value={newAlert.type}
                onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                label="Alert Type"
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newAlert.priority}
                onChange={(e) => setNewAlert(prev => ({ ...prev, priority: e.target.value }))}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title"
              value={newAlert.title}
              onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={newAlert.description}
              onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddAlert}
            disabled={!newAlert.deviceId || !newAlert.title || !newAlert.description}
          >
            Add Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Device ID</InputLabel>
              <Select
                value={newPhoto.deviceId}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, deviceId: e.target.value }))}
                label="Device ID"
              >
                {mockDevices.map(device => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.id} - {device.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newPhoto.category}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                <MenuItem value="installation">Installation</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="calibration">Calibration</MenuItem>
                <MenuItem value="issue">Issue</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title"
              value={newPhoto.title}
              onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={newPhoto.description}
              onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              fullWidth
            >
              Choose Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNewPhoto(prev => ({ ...prev, file: e.target.files[0] }))}
              />
            </Button>
            {newPhoto.file && (
              <Typography variant="body2" color="text.secondary">
                Selected: {newPhoto.file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddPhoto}
            disabled={!newPhoto.deviceId || !newPhoto.title}
          >
            Upload Photo
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};