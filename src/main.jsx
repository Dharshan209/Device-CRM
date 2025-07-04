import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import App from './App';

const Root = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <CustomThemeProvider>
                    <CssBaseline />
                    <App />
                </CustomThemeProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);