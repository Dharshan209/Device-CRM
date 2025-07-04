// CSV Export Utility Functions

export const exportToCSV = (data, filename, headers = null) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Generate headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Header row
      csvHeaders.join(','),
      // Data rows
      ...data.map(row => 
        csvHeaders.map(header => {
          let value = row[header] || '';
          
          // Handle special characters and quotes
          if (typeof value === 'string') {
            // Escape quotes and wrap in quotes if contains comma or quotes
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
          }
          
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};

export const exportDevicesToCSV = (devices) => {
  const headers = [
    'Device ID',
    'Type',
    'Facility',
    'Status',
    'Battery %',
    'Last Service Date',
    'AMC Status',
    'AMC Expiry',
    'Serial Number',
    'Manufacturer',
    'Model'
  ];
  
  const mappedData = devices.map(device => ({
    'Device ID': device.id,
    'Type': device.type,
    'Facility': device.facility,
    'Status': device.status,
    'Battery %': device.battery,
    'Last Service Date': device.lastServiceDate,
    'AMC Status': device.amcStatus,
    'AMC Expiry': device.amcExpiry,
    'Serial Number': device.serialNumber || '',
    'Manufacturer': device.manufacturer || '',
    'Model': device.model || ''
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  return exportToCSV(mappedData, `device-inventory-${timestamp}`, headers);
};

export const exportServiceLogsToCSV = (logs) => {
  const headers = [
    'Log ID',
    'Device ID',
    'Technician ID',
    'Date',
    'Purpose',
    'Notes'
  ];
  
  const mappedData = logs.map(log => ({
    'Log ID': log.id,
    'Device ID': log.deviceId,
    'Technician ID': log.technicianId,
    'Date': log.date,
    'Purpose': log.purpose,
    'Notes': log.notes
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  return exportToCSV(mappedData, `service-logs-${timestamp}`, headers);
};

export const exportAMCDataToCSV = (devices) => {
  const headers = [
    'Device ID',
    'Type',
    'Facility',
    'AMC Status',
    'AMC Expiry',
    'Days Until Expiry',
    'CMC Provider'
  ];
  
  const mappedData = devices.map(device => {
    const expiryDate = new Date(device.amcExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      'Device ID': device.id,
      'Type': device.type,
      'Facility': device.facility,
      'AMC Status': device.amcStatus,
      'AMC Expiry': device.amcExpiry,
      'Days Until Expiry': daysUntilExpiry,
      'CMC Provider': device.cmcProvider || ''
    };
  });
  
  const timestamp = new Date().toISOString().split('T')[0];
  return exportToCSV(mappedData, `amc-cmc-tracker-${timestamp}`, headers);
};

export const exportInstallationsToCSV = (installations) => {
  const headers = [
    'Installation ID',
    'Device ID',
    'Device Type',
    'Facility',
    'Technician ID',
    'Date',
    'Training Complete',
    'Staff Trained',
    'Notes'
  ];
  
  const mappedData = installations.map(installation => ({
    'Installation ID': installation.id,
    'Device ID': installation.deviceId,
    'Device Type': installation.deviceType || '',
    'Facility': installation.facility || '',
    'Technician ID': installation.technicianId,
    'Date': installation.date,
    'Training Complete': installation.trainingComplete ? 'Yes' : 'No',
    'Staff Trained': installation.staffTrained || '',
    'Notes': installation.notes || ''
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  return exportToCSV(mappedData, `installations-${timestamp}`, headers);
};

export const exportAlertsToCSV = (alerts) => {
  const headers = [
    'Alert ID',
    'Device ID',
    'Type',
    'Title',
    'Description',
    'Priority',
    'Timestamp',
    'Status',
    'Acknowledged By'
  ];
  
  const mappedData = alerts.map(alert => ({
    'Alert ID': alert.id,
    'Device ID': alert.deviceId,
    'Type': alert.type,
    'Title': alert.title,
    'Description': alert.description,
    'Priority': alert.priority,
    'Timestamp': new Date(alert.timestamp).toLocaleString(),
    'Status': alert.acknowledged ? 'Acknowledged' : 'Pending',
    'Acknowledged By': alert.acknowledgedBy || ''
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  return exportToCSV(mappedData, `alerts-${timestamp}`, headers);
};

// Advanced CSV export with custom formatting
export const exportWithCustomFormat = (data, config) => {
  const {
    filename,
    headers,
    formatters = {},
    filters = {},
    sortBy = null,
    sortOrder = 'asc'
  } = config;
  
  let processedData = [...data];
  
  // Apply filters
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      processedData = processedData.filter(item => 
        String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase())
      );
    }
  });
  
  // Apply sorting
  if (sortBy) {
    processedData.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
  
  // Apply custom formatters
  const formattedData = processedData.map(item => {
    const formatted = { ...item };
    Object.keys(formatters).forEach(key => {
      if (formatted[key] !== undefined) {
        formatted[key] = formatters[key](formatted[key], item);
      }
    });
    return formatted;
  });
  
  return exportToCSV(formattedData, filename, headers);
};