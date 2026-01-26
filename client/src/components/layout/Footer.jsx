import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const menuLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.packages'), path: '/pacchetti' },
    { label: t('nav.about'), path: '/chi-siamo' },
    { label: t('nav.contact'), path: '/contatti' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-lg font-bold">
                Salute e Fede
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-1">
              {t('footer.by')}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://wa.me/393331234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.menu')}
            </h4>
            <ul className="space-y-2.5">
              {menuLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.shipping')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.refunds')}
                </a>
              </li>
              <li>
                <Link to="/contatti" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.assistance')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.contacts')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@saluteefede.it"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  info@saluteefede.it
                </a>
              </li>
              <li>
                <a
                  href="tel:+393331234567"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  +39 333 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} Salute e Fede. {t('footer.rights')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
