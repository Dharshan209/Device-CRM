import { Box, Toolbar, Typography, Paper } from '@mui/material';

export const MainContent = () => {
    return (
        <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
        >
            <Toolbar />
            <Paper sx={{p: 3}}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography paragraph>
                    Select a module from the sidebar to get started. This is where the main content for each section, like the device inventory table, will be displayed.
                </Typography>
                 <Typography paragraph>
                    The application is now fully set up with authentication, theming, and a responsive layout. The next step is to build out the core features, starting with the Device Inventory Dashboard.
                </Typography>
            </Paper>
        </Box>
    );
}
