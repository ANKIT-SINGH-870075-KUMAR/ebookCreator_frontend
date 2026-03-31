import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import toast from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ViewBookPage from './pages/ViewBookPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';

const App = () => {
  useEffect(() => {
    // Test toast message to verify it's working
    setTimeout(() => {
      toast.success('App loaded successfully! Toasts are working.');
    }, 2000);
  }, []);

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/editor/:bookId" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/view-book/:bookId" element={<ProtectedRoute><ViewBookPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App