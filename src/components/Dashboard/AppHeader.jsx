import { AppBar, Toolbar, IconButton, Typography, Switch, Box,Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

export const AppHeader = ({ drawerWidth, handleDrawerToggle }) => {
    const { user, logout } = useAuth();
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <AppBar
            position="fixed"
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Device Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">Hi, {user.name}</Typography>
                <Switch
                    checked={mode === 'dark'}
                    onChange={toggleColorMode}
                    icon={<Brightness7Icon />}
                    checkedIcon={<Brightness4Icon />}
                />
                <Button color="inherit" onClick={logout}>Logout</Button>
            </Box>
            </Toolbar>
        </AppBar>
    );
}