import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import TreksCatalogPage from './pages/TreksCatalogPage';
import FortGuidePage from './pages/FortGuidePage';
import SafetyPage from './pages/SafetyPage';
import BookingTrackPage from './pages/BookingTrackPage';
import AdminPortalPage from './pages/AdminPortalPage';
import BookingModal from './components/booking/BookingModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import ReviewModal from './components/review/ReviewModal';
import { TrekProvider } from './context/TrekContext';
import { BookingProvider } from './context/BookingContext';
import { PaymentConfigProvider } from './context/PaymentConfigContext';
import { ReviewProvider } from './context/ReviewContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  return (
    <PaymentConfigProvider>
      <TrekProvider>
        <BookingProvider>
          <ReviewProvider>
            <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-orange-500 selection:text-white">
              <ScrollToTop />
              
              {/* Main Navigation Bar */}
              <Navbar onOpenAdmin={() => setIsAdminLoginModalOpen(true)} />

              {/* Application Routes */}
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/treks" element={<TreksCatalogPage />} />
                  <Route path="/forts" element={<FortGuidePage />} />
                  <Route path="/safety" element={<SafetyPage />} />
                  <Route path="/track" element={<BookingTrackPage />} />
                  <Route path="/admin" element={<AdminPortalPage />} />
                </Routes>
              </div>

              {/* Global Booking Modal (Accessible from all pages) */}
              <BookingModal />

              {/* Global User Rating & Review Modal */}
              <ReviewModal />

              {/* Admin Quick Login Modal */}
              <AdminLoginModal
                isOpen={isAdminLoginModalOpen}
                onClose={() => setIsAdminLoginModalOpen(false)}
                onLoginSuccess={() => {
                  setIsAdminLoginModalOpen(false);
                  window.location.href = '/admin';
                }}
              />

              {/* Brand Footer */}
              <Footer />
            </div>
          </ReviewProvider>
        </BookingProvider>
      </TrekProvider>
    </PaymentConfigProvider>
  );
}
