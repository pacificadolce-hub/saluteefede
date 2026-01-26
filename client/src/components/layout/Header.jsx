import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const langRef = useRef(null);

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.packages'), path: '/pacchetti' },
    { name: t('nav.about'), path: '/chi-siamo' },
    { name: t('nav.contact'), path: '/contatti' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-heading text-lg md:text-xl font-bold text-primary">
              Salute e Fede
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                <Globe size={16} />
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-primary/5 text-primary' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/pacchetti" className="btn btn-primary py-2 px-4 text-sm">
              {language === 'it' ? 'Inizia Ora' : 'Empieza'}
            </Link>
          </nav>

          {/* Mobile: Language + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Language Dropdown Mobile */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700"
              >
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm ${
                          language === lang.code ? 'bg-primary/5 text-primary' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="container-custom py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/pacchetti"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary w-full"
              >
                {language === 'it' ? 'Inizia Ora' : 'Empieza'}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
