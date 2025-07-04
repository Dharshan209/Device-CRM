import { 
  mockServiceLogs 
} from '../Api/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Box,
  Typography,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const ServiceLogs = () => {
    const { user } = useAuth();
    // In a real app, you would fetch this data.
    // Here we filter based on role. Admins see all, technicians see their own.
    const logs = user.role === 'admin' 
        ? mockServiceLogs 
        : mockServiceLogs.filter(log => log.technicianId === user.id);

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Service Visit Logs</Typography>
                <Button variant="contained" startIcon={<AddIcon />}>Log New Visit</Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Log ID</TableCell>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Technician ID</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell>{log.id}</TableCell>
                            <TableCell>{log.deviceId}</TableCell>
                            <TableCell>{log.date}</TableCell>
                            <TableCell>{log.technicianId}</TableCell>
                            <TableCell>{log.purpose}</TableCell>
                            <TableCell>{log.notes}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}