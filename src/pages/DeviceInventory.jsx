import { useState, useEffect } from 'react';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, Snackbar, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RoleBasedGuard } from '../components/RoleBasedGuard';
import { StatusChip } from '../components/StatusChip';
import { AddDeviceModal } from '../components/AddDeviceModal/AddDeviceModal';
import { EditDeviceModal } from '../components/EditDeviceModal/EditDeviceModal';
import { useAuth } from '../context/AuthContext';
import { mockDevices, MOCK_USERS } from '../Api/mockData';
import { EmptyState } from '../components/EmptyState/EmptyState';

export const DeviceInventory = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState(mockDevices);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load devices from localStorage on component mount
  useEffect(() => {
    const savedDevices = localStorage.getItem('devices');
    if (savedDevices) {
      try {
        const parsedDevices = JSON.parse(savedDevices);
        setDevices(parsedDevices);
      } catch (error) {
        console.error('Error parsing saved devices:', error);
      }
    }
  }, []);

  const handleDeviceAdded = (newDevice) => {
    setDevices(prev => [...prev, newDevice]);
    setSnackbar({
      open: true,
      message: `Device ${newDevice.id} added successfully!`,
      severity: 'success'
    });
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setEditModalOpen(true);
  };

  const handleDeviceUpdated = (updatedDevice) => {
    setDevices(prev => prev.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
    setSnackbar({
      open: true,
      message: `Device ${updatedDevice.id} updated successfully!`,
      severity: 'success'
    });
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedDevice(null);
  };

  const handleDeleteDevice = (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      const updatedDevices = devices.filter(device => device.id !== deviceId);
      setDevices(updatedDevices);
      localStorage.setItem('devices', JSON.stringify(updatedDevices));
      setSnackbar({
        open: true,
        message: `Device ${deviceId} deleted successfully!`,
        severity: 'success'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter devices based on user role
  const filteredDevices = user.role === 'admin' 
    ? devices 
    : devices.filter(device => device.assignedTechnician === user.id);

  // Get technician name for display
  const getTechnicianName = (technicianId) => {
    if (!technicianId) return 'Unassigned';
    const technician = Object.values(MOCK_USERS).find(u => u.id === technicianId);
    return technician ? technician.name : 'Unknown';
  }; 

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Device Inventory</Typography>
          {user.role === 'technician' && (
            <Typography variant="body2" color="text.secondary">
              Showing devices assigned to you ({filteredDevices.length} devices)
            </Typography>
          )}
        </Box>
        <RoleBasedGuard allowedRoles={['admin']}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Add New Device
          </Button>
        </RoleBasedGuard>
      </Box>
      
      {filteredDevices.length === 0 ? (
        <EmptyState
          title={user.role === 'technician' ? 'No devices assigned' : 'No devices found'}
          description={
            user.role === 'technician' 
              ? 'You have no devices assigned to you yet. Contact your administrator to get devices assigned.'
              : 'Start by adding your first device to the inventory.'
          }
          actionLabel={user.role === 'admin' ? 'Add New Device' : undefined}
          onAction={user.role === 'admin' ? () => setAddModalOpen(true) : undefined}
        />
      ) : (
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Battery</TableCell>
              <TableCell>Last Service</TableCell>
              <TableCell>AMC/CMC</TableCell>
              <RoleBasedGuard allowedRoles={['admin']}>
                <TableCell>Assigned Technician</TableCell>
              </RoleBasedGuard>
              <RoleBasedGuard allowedRoles={['admin']}><TableCell align="right">Actions</TableCell></RoleBasedGuard>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.id}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.facility}</TableCell>
                <TableCell><StatusChip status={device.status} /></TableCell>
                <TableCell>{device.battery}%</TableCell>
                <TableCell>{device.lastServiceDate}</TableCell>
                <TableCell><StatusChip status={device.amcStatus} /></TableCell>
                <RoleBasedGuard allowedRoles={['admin']}>
                  <TableCell>{getTechnicianName(device.assignedTechnician)}</TableCell>
                </RoleBasedGuard>
                <RoleBasedGuard allowedRoles={['admin']}>
                    <TableCell align="right">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditDevice(device)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </RoleBasedGuard>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}

      <AddDeviceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onDeviceAdded={handleDeviceAdded}
      />

      <EditDeviceModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        device={selectedDevice}
        onDeviceUpdated={handleDeviceUpdated}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};