import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import Chatbot from '../Medical-Chatbot/Chatbot';

import Home from '../pages/Home';
import AboutPage from '../pages/About';
import ServicePage from '../pages/Service';
import Registration from '../pages/Registration';
import TermsAndConditions from '../pages/TermsAndConditions';
import NotFound from '../pages/NotFound';
import LabTestMedipedia from '../pages/LabTest';
import BlogPage from '../pages/Blog';
import BlogDetailsPage from '../pages/BlogDetailsPage';
import HospitalsAround from '../pages/HospitalsAround';
import ProfilePage from '../pages/Profile';
import AuthPage from '../pages/AuthForm';
import OPDSchedule from '../pages/OPDSchedule';
import OPDRegistrationForm from '../pages/OPDRegistration';
import HospitalsList from '../pages/HospitalList';
import HospitalDetails from '../pages/HospitalDetail';
import HospitalAppointments from '../pages/HospitalPanal';
import BusinessContactForm from './BusinessContactForm';
import ForgotPassword from './ForgotPassword';
import PrivateRoute from '../privateroute/privateroute';
import Success from '../pages/Success';
import Newsletters from '../pages/Newsletters';
import PredictSkin from '../pages/SkinDiseasePredictor';

function Layout() {
  const location = useLocation();

  const showNavAndFooterRoutes = [
    '/',
    '/about',
    '/registerOPD',
    '/checkOPDschedule',
    '/success',
    '/login',
    '/register',
    '/hospitals',
    '/hospitalDetails',
    '/panal',
    '/profile',
    '/services',
    '/terms-and-conditions',
    '/Labtest',
    '/blog',
    '/business',
    '/forgot-password',
    '/newsletter-dashboard',
    '/predict-skin' // ✅ Added new route here
  ];

  const showNavAndFooter = showNavAndFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavAndFooter && <Navbar />}
      <div className="mt-14">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/registerOPD" element={<OPDRegistrationForm />} />
          <Route path="/checkOPDschedule" element={<OPDSchedule />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/hospitals" element={<HospitalsList />} />
          <Route path="/hospitalDetails" element={<HospitalDetails />} />
          <Route path="/panal" element={<HospitalAppointments />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/Labtest" element={<LabTestMedipedia />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/hospitals-around" element={<HospitalsAround />} />
          <Route path="/business" element={<BusinessContactForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/newsletter-dashboard" element={<Newsletters />} />
          <Route path="/predict-skin" element={<PredictSkin />} /> {/* ✅ Added Route */}

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>

      {/* Chatbot and Footer logic */}
      {showNavAndFooter ? (
        <>
          <Chatbot />
          <Footer />
        </>
      ) : (
        <div className="fixed bottom-4 right-6 flex flex-col gap-3">
          <Chatbot />
        </div>
      )}
    </>
  );
}

export default Layout;
