import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/common/ScrollToTop';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Packages from './pages/public/Packages';
import PackageDetail from './pages/public/PackageDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import CheckoutSuccess from './pages/public/CheckoutSuccess';
import CheckoutCancel from './pages/public/CheckoutCancel';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PackageManager from './pages/admin/PackageManager';
import OrderManager from './pages/admin/OrderManager';
import TestimonialManager from './pages/admin/TestimonialManager';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pacchetti" element={<Packages />} />
            <Route path="/pacchetti/:slug" element={<PackageDetail />} />
            <Route path="/chi-siamo" element={<About />} />
            <Route path="/contatti" element={<Contact />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pacchetti" element={<PackageManager />} />
            <Route path="ordini" element={<OrderManager />} />
            <Route path="testimonianze" element={<TestimonialManager />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
