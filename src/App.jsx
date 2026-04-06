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
import SupportPage from './pages/SupportPage';
import TicketDetailPage from './pages/TicketDetailPage';
import BrowseBooksPage from './pages/BrowseBooksPage';
import AdminPage from './pages/AdminPage';
import WritersPage from './pages/WritersPage';
import InboxPage from './pages/InboxPage';
import WriterProfilePage from './pages/WriterProfilePage';

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
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['writer'/*  */]}><DashboardPage /></ProtectedRoute>} />
        <Route path="/writer/:writerId" element={<ProtectedRoute allowedRoles={['superadmin']}><DashboardPage /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute allowedRoles={['viewer', 'writer', 'superadmin']}><BrowseBooksPage /></ProtectedRoute>} />
        <Route path="/writers" element={<ProtectedRoute allowedRoles={['viewer']}><WritersPage /></ProtectedRoute>} />
        <Route path="/writer-profile/:writerId" element={<ProtectedRoute allowedRoles={['viewer']}><WriterProfilePage /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute allowedRoles={['viewer', 'writer']}><InboxPage /></ProtectedRoute>} />
        <Route path="/editor/:bookId" element={<ProtectedRoute allowedRoles={['writer', 'superadmin']}><EditorPage /></ProtectedRoute>} />
        <Route path="/view-book/:bookId" element={<ProtectedRoute><ViewBookPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute allowedRoles={['viewer', 'writer']}><SupportPage /></ProtectedRoute>} />
        <Route path="/support/:ticketId" element={<ProtectedRoute allowedRoles={['viewer', 'writer']}><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/admin/tickets/:ticketId" element={<ProtectedRoute allowedRoles={['superadmin']}><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App