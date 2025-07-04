import { differenceInDays, parseISO } from 'date-fns'; 
import {
  Paper,
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { mockDevices } from '../Api/mockData';
import { StatusChip } from '../components/StatusChip';
import { exportAMCDataToCSV } from '../utils/csvExport';


export const AmcTracker = () => {
    // This page is admin-only, so we don't need to filter by role here.
    const devices = mockDevices;

    const exportToCsv = () => {
        const success = exportAMCDataToCSV(devices);
        if (success) {
            alert("AMC/CMC data exported successfully!");
        } else {
            alert("Failed to export data. Please try again.");
        }
    }

    const isExpiringSoon = (dateStr) => {
        const expiryDate = parseISO(dateStr);
        const daysUntilExpiry = differenceInDays(expiryDate, new Date());
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">AMC/CMC Tracker</Typography>
                <Button variant="contained" onClick={exportToCsv}>Export to CSV</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Facility</TableCell>
                            <TableCell>AMC/CMC Status</TableCell>
                            <TableCell>Expiry Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((device) => (
                        <TableRow 
                            key={device.id} 
                            sx={{ 
                                backgroundColor: isExpiringSoon(device.amcExpiry) ? 'warning.light' : 'transparent' 
                            }}
                        >
                            <TableCell>{device.id}</TableCell>
                            <TableCell>{device.type}</TableCell>
                            <TableCell>{device.facility}</TableCell>
                            <TableCell><StatusChip status={device.amcStatus} /></TableCell>
                            <TableCell>{device.amcExpiry}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}