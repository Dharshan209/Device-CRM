import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage/LoginPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DeviceInventory } from './pages/DeviceInventory';
import { NewInstallation } from './pages/NewInstallation';
import { ServiceLogs } from './pages/ServiceLogs';
import { AmcTracker } from './pages/AmcTracker';
import { AlertsAndPhotos } from './pages/AlertsAndPhotos';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* These are the nested pages that will render inside the Dashboard */}
        <Route index element={<DeviceInventory />} />
        <Route path="installation" element={<NewInstallation />} />
        <Route path="service-logs" element={<ServiceLogs />} />
        <Route path="amc-cmc-tracker" element={<AmcTracker />} />
        <Route path="alerts-photos" element={<AlertsAndPhotos />} />
      </Route>
    </Routes>
  );
}

export default App;