import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 md:pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton phoneNumber="393331234567" />
    </div>
  );
};

export default PublicLayout;
