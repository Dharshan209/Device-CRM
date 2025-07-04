export const MOCK_USERS = {
  admin: { id: 'admin01', username: 'admin@medcorp.com', password: 'password123', name: 'Admin User', role: 'admin' },
  technician: { id: 'tech01', username: 'tech@medcorp.com', password: 'password123', name: 'John Smith', role: 'technician' },
  technician2: { id: 'tech02', username: 'tech2@medcorp.com', password: 'password123', name: 'Sarah Johnson', role: 'technician' },
};

export let mockDevices = [
  { id: 'DEV001', type: 'ECG Machine', facility: 'City Hospital', status: 'Online', battery: 95, lastServiceDate: '2025-06-15', amcStatus: 'Active', amcExpiry: '2026-01-15', assignedTechnician: 'tech01' },
  { id: 'DEV002', type: 'Ventilator', facility: 'General Clinic', status: 'Offline', battery: 0, lastServiceDate: '2025-05-20', amcStatus: 'Expired', amcExpiry: '2025-01-20', assignedTechnician: 'tech01' },
  { id: 'DEV003', type: 'Infusion Pump', facility: 'City Hospital', status: 'Maintenance', battery: 55, lastServiceDate: '2025-07-01', amcStatus: 'Active', amcExpiry: '2025-08-01', assignedTechnician: null },
  { id: 'DEV004', type: 'Defibrillator', facility: 'Trauma Center', status: 'Online', battery: 100, lastServiceDate: '2025-04-10', amcStatus: 'Upcoming', amcExpiry: '2025-07-25', assignedTechnician: null },
  { id: 'DEV005', type: 'X-Ray Machine', facility: 'General Clinic', status: 'Online', battery: 100, lastServiceDate: '2025-02-11', amcStatus: 'Active', amcExpiry: '2025-11-30', assignedTechnician: 'tech01' },
  { id: 'DEV006', type: 'Ultrasound', facility: 'Maternity Ward', status: 'Maintenance', battery: 70, lastServiceDate: '2025-06-28', amcStatus: 'Active', amcExpiry: '2026-03-10', assignedTechnician: null },
];

export let mockInstallations = [
    { id: 'INST001', deviceId: 'DEV001', technicianId: 'tech01', date: '2024-01-15', photos: ['unboxing1.jpg'], checklist: ['Power On Test', 'Calibration'], trainingComplete: true },
    { id: 'INST002', deviceId: 'DEV005', technicianId: 'tech01', date: '2024-03-20', photos: ['xray_install.jpg'], checklist: ['Power On Test', 'Lead Shielding Check'], trainingComplete: true },
];

export let mockServiceLogs = [
    { id: 'LOG001', deviceId: 'DEV002', technicianId: 'tech01', date: '2025-05-20', purpose: 'Breakdown', notes: 'Replaced faulty power supply unit.' },
    { id: 'LOG002', deviceId: 'DEV003', technicianId: 'admin01', date: '2025-07-01', purpose: 'Preventive', notes: 'Routine maintenance and software update.' },
    { id: 'LOG003', deviceId: 'DEV006', technicianId: 'tech01', date: '2025-06-28', purpose: 'Preventive', notes: 'Cleaned filters and checked sensors.' },
    { id: 'LOG004', deviceId: 'DEV001', technicianId: 'admin01', date: '2025-06-15', purpose: 'Preventive', notes: 'Annual check-up, all systems nominal.' },
];