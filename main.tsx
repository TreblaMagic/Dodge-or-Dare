import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';

// Admin Imports
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import DareManager from './components/admin/DareManager';
import DodgeManager from './components/admin/DodgeManager';
import DifficultyManager from './components/admin/DifficultyManager';
import PatternManager from './components/admin/PatternManager';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - Must be defined before catch-all to ensure they match first */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dares" element={<DareManager />} />
          <Route path="dodges" element={<DodgeManager />} />
          <Route path="difficulties" element={<DifficultyManager />} />
          <Route path="patterns" element={<PatternManager />} />
          {/* Catch-all for unmatched admin routes - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Game Route - Only matches paths that don't start with /admin */}
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);