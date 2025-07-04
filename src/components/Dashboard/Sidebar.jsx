import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Drawer, Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const allNavItems = [
    { text: 'Device Inventory', icon: <InventoryIcon />, path: '/', roles: ['admin', 'technician'] },
    { text: 'New Installation', icon: <AddCircleOutlineIcon />, path: '/installation', roles: ['admin', 'technician'] },
    { text: 'Service Logs', icon: <HistoryIcon />, path: '/service-logs', roles: ['admin', 'technician'] },
    { text: 'AMC/CMC Tracker', icon: <DescriptionIcon />, path: '/amc-cmc-tracker', roles: ['admin'] },
    { text: 'Alerts & Photos', icon: <NotificationsIcon />, path: '/alerts-photos', roles: ['admin', 'technician'] },
];

export const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const { user } = useAuth(); // Get the current user

    // Filter the nav items based on the user's role
    const visibleNavItems = allNavItems.filter(item => item.roles.includes(user.role));

    const drawerContent = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {visibleNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    // The rest of the component (rendering the mobile and desktop drawers) remains the same
    return (
         <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="navigation"
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};