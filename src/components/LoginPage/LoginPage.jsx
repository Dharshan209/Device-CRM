import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Box, Typography, TextField, Button, ToggleButtonGroup, ToggleButton, Alert, Paper, InputAdornment, CircularProgress } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

export const LoginPage = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  // --- FIX: This useEffect handles the redirection ---
  useEffect(() => {
    // If the user object exists, it means login was successful.
    if (user) {
      // Navigate to the dashboard's home page.
      // `replace: true` removes the login page from the browser history.
      navigate('/', { replace: true });
    }
  }, [user, navigate]);


  const handleLogin = (e) => {
    e.preventDefault();
    login(role, username, password);
  };
  
  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <MedicalServicesIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography component="h1" variant="h5" fontWeight="bold">
              Device CRM Portal
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            aria-label="user role"
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="admin" aria-label="admin role">
              <AdminPanelSettingsIcon sx={{ mr: 1 }} />
              Admin
            </ToggleButton>
            <ToggleButton value="technician" aria-label="technician role">
              <EngineeringIcon sx={{ mr: 1 }} />
              Technician
            </ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
              autoFocus
              InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>) }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
               InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }}
            />
            
            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontWeight: 'bold', mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Box>
        <Box sx={{ p: 1.5, backgroundColor: 'action.hover' }}>
            <Typography variant="caption" display="block" align="center" color="text.secondary">
                Hint: Use password 'password123' for both roles.
            </Typography>
        </Box>
      </Paper>
    </Container>
  );
};