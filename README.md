# 📟 Device CRM Dashboard

A comprehensive and modern dashboard for managing **medical device inventory**, **installation logs**, **service visits**, and **maintenance contracts** — designed with role-based access to streamline operations for administrators and technicians.

🌐 [Live Demo](https://device-crm.vercel.app/login)
📦 [GitHub Repository](https://github.com/Dharshan209/Device-CRM)

---

## ✨ Features

* **🔧 Device Inventory Management**
  Add, view, edit, and delete devices.

  * Admins: Full access to all devices
  * Technicians: View only assigned devices

* **📝 New Installation Logging**
  A multi-step form to log new device installations, including:

  * Device details
  * Installation checklist
  * Training confirmation

* **🛠️ Service Visit Logs**
  View detailed service logs for each device.

  * Admins: See all logs
  * Technicians: View only their own logs

* **📅 AMC/CMC Tracker**
  Track **Annual Maintenance Contracts (AMC)** and **Comprehensive Maintenance Contracts (CMC)**

  * Highlights contracts expiring within 30 days
  * Export data to CSV for reports

* **🚨 Alerts & Photo Logs**
  Centralized view for:

  * System-generated alerts (e.g., "Device Offline")
  * Upload/view photos related to installations and maintenance

* **🔐 Role-Based Access Control (RBAC)**

  * **Admin:** Full access to the system
  * **Technician:** Limited to assigned data and functionality

* **🧾 Data Export**
  Export AMC/CMC data to CSV for reporting and sharing.

* **💡 Modern UI**
  Built using **Material-UI**, with:

  * Status chips
  * Responsive layouts
  * Modal-based data entry forms

---

## 👥 User Roles & Demo Credentials

Use the following **mock credentials** to test role-based functionality:

### 👨‍💼 Administrator

* **Username:** `admin@medcorp.com`
* **Password:** `password123`
* **Permissions:**

  * Full device inventory access
  * Assign devices to technicians
  * View all service/installation logs
  * Manage AMC/CMC contracts and alerts
  * Export data

### 🧑‍🔧 Technicians

* **Usernames:**

  * `tech@medcorp.com`
  * `tech2@medcorp.com`
* **Password:** `password123`
* **Permissions:**

  * View only assigned devices
  * Log new installations and service visits
  * View personal service logs
  * Access alerts and upload photos for assigned devices

---

## 🛠️ Tech Stack

* **React** – Frontend library for building UI
* **React Router** – Routing for navigation
* **Material-UI** – UI components and design
* **Date-fns** – Date utility for managing contract expiries
* **Vite** – Fast and optimized frontend tooling

---

## 🚀 Getting Started

### ✅ Prerequisites

* **Node.js** (v14 or above)
* **npm** or **yarn**

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Dharshan209/Device-CRM.git

# Navigate into the project directory
cd device-crm-dashboard

# Install dependencies
npm install
```

### 🔄 Run Locally

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Folder Structure Overview

```
device-crm-dashboard/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route pages (Dashboard, Login, etc.)
│   ├── mockData.js        # Mock data for demo
│   ├── routes/            # Role-based route definitions
│   ├── utils/             # Helper functions
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## 📝 License

This project is for educational and demonstration purposes. You are free to fork, clone, and adapt it as needed.


