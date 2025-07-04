import { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Checkbox, FormControlLabel, FormGroup, Stepper, Step, StepLabel, Alert, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../context/AuthContext';
import { mockInstallations } from '../Api/mockData';

const steps = ['Device Information', 'Installation Checklist', 'Training & Confirmation'];

const deviceTypes = [
    'ECG Machine', 'Ventilator', 'Infusion Pump', 'Defibrillator', 'X-Ray Machine', 'Ultrasound', 'Other'
];

const initialFormData = {
    deviceId: '',
    deviceType: '',
    facilityName: '',
    staffName: '',
    notes: '',
};

export const NewInstallation = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [fileName, setFileName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const resetForm = () => {
      setFormData(initialFormData);
      setActiveStep(0);
      setFileName('');
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      const newInstallation = {
          id: `INST${Date.now()}`,
          deviceId: formData.deviceId,
          deviceType: formData.deviceType,
          facility: formData.facilityName,
          technicianId: user.id,
          date: new Date().toISOString().split('T')[0],
          photos: [fileName],
          // In a real app, you'd collect the checklist state
          checklist: ['Power On Test', 'Calibration'], 
          trainingComplete: true,
          staffTrained: formData.staffName,
          notes: formData.notes
      };
      
      // Add to our mock data array
      mockInstallations.push(newInstallation);
      
      console.log("New Installation Logged:", newInstallation);
      console.log("Updated Installations Array:", mockInstallations);

      setFormSubmitted(true);
      resetForm();
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>New Installation & Training Log</Typography>
      {formSubmitted && <Alert severity="success" sx={{mb: 2}} onClose={() => setFormSubmitted(false)}>Installation logged successfully!</Alert>}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" mb={2}>Step 1: Device & Location</Typography>
            <TextField name="deviceId" label="Device ID" value={formData.deviceId} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
            <TextField name="deviceType" select label="Device Type" value={formData.deviceType} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }}>
              {deviceTypes.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField name="facilityName" label="Facility Name" value={formData.facilityName} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Unboxing Photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {fileName && <Typography sx={{display: 'inline', ml: 2}}>{fileName}</Typography>}
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" mb={2}>Step 2: Installation Checklist</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Device powered on successfully" />
              <FormControlLabel control={<Checkbox />} label="Initial calibration completed" />
              <FormControlLabel control={<Checkbox />} label="Network connectivity verified" />
              <FormControlLabel control={<Checkbox />} label="All physical components inspected" />
            </FormGroup>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" mb={2}>Step 3: Training Form</Typography>
            <TextField name="staffName" label="Name of Staff Trained" value={formData.staffName} onChange={handleInputChange} fullWidth required sx={{ mb: 2 }} />
            <TextField name="notes" label="Technician Notes" value={formData.notes} onChange={handleInputChange} fullWidth multiline rows={4} sx={{ mb: 2 }} />
            <FormControlLabel control={<Checkbox required />} label="I confirm that training has been completed." />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" onClick={handleNext}>Next</Button>}
          {activeStep === steps.length - 1 && <Button variant="contained" color="primary" type="submit">Submit Log</Button>}
        </Box>
      </form>
    </Paper>
  );
};