import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Check,
  Star,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getPackageBySlug, createCheckoutSession } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Customer info for checkout
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Get all images (main + gallery)
  const getAllImages = () => {
    if (!pkg) return [];
    const images = [];
    if (pkg.image_url) images.push(pkg.image_url);
    if (pkg.gallery_images && pkg.gallery_images.length > 0) {
      images.push(...pkg.gallery_images);
    }
    return images;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await getPackageBySlug(slug);
        setPkg(data);
      } catch (err) {
        setError('Pacchetto non trovato');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);

    try {
      const { url } = await createCheckoutSession({
        packageId: pkg.id,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
      });

      window.location.href = url;
    } catch (err) {
      alert('Errore durante il checkout. Riprova.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const faqs = [
    {
      question: 'Come ricevo il programma?',
      answer: 'Subito dopo il pagamento riceverai via email tutti i materiali in formato digitale.',
    },
    {
      question: 'Posso modificare il piano?',
      answer: 'Si, il piano e flessibile. Contattaci per modifiche basate su tue esigenze o intolleranze.',
    },
    {
      question: 'E incluso supporto?',
      answer: 'Si, tutti i pacchetti includono supporto via email per la durata del programma.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">{error}</h1>
        <Link to="/pacchetti" className="btn btn-primary">
          <ArrowLeft size={18} />
          Torna ai Pacchetti
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Back link - mobile friendly */}
      <div className="bg-white border-b sticky top-14 md:top-16 z-40">
        <div className="container-custom py-3">
          <Link
            to="/pacchetti"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Tutti i pacchetti
          </Link>
        </div>
      </div>

      <div className="container-custom py-6 md:py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Image & Details (3 cols) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3"
          >
            {/* Image Gallery */}
            <div className="mb-6 pt-2">
              {(() => {
                const images = getAllImages();
                const hasImages = images.length > 0;

                return (
                  <>
                    <div className="relative">
                      {pkg.is_featured && (
                        <span className="absolute top-3 left-4 z-10 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Star size={12} fill="white" />
                          Popolare
                        </span>
                      )}
                      <div className="rounded-2xl overflow-hidden">
                        {hasImages ? (
                          <img
                            src={images[selectedImage]}
                            alt={pkg.name}
                            className="w-full h-auto min-h-56 md:min-h-80 max-h-[500px] object-contain bg-gray-100"
                          />
                        ) : (
                          <div className="w-full h-56 md:h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-7xl">🥗</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`${pkg.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Title - Mobile */}
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                {pkg.name}
              </h1>
              {pkg.duration_days && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{pkg.duration_days} giorni</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-5 md:p-6 mb-6">
              <h2 className="font-heading text-lg font-semibold mb-3">Descrizione</h2>
              <p className="text-gray-600 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Features */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="bg-white rounded-xl p-5 md:p-6 mb-6">
                <h2 className="font-heading text-lg font-semibold mb-4">Cosa include</h2>
                <ul className="grid gap-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ */}
            <div className="bg-white rounded-xl p-5 md:p-6">
              <h2 className="font-heading text-lg font-semibold mb-4">Domande frequenti</h2>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp size={18} className="text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-3">
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Purchase Card (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 lg:sticky lg:top-32">
              {/* Title - Desktop */}
              <div className="hidden lg:block mb-4">
                <h1 className="text-xl font-heading font-bold text-gray-900 mb-1">
                  {pkg.name}
                </h1>
                {pkg.duration_days && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{pkg.duration_days} giorni</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6 pb-4 border-b">
                <span className="text-3xl font-bold text-gray-900">€{pkg.price}</span>
                <span className="text-gray-500 text-sm">una tantum</span>
              </div>

              {/* Purchase Form */}
              {!showCheckoutForm ? (
                <>
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="btn btn-primary w-full py-3.5 text-base mb-4"
                  >
                    Acquista ora
                    <ArrowRight size={18} />
                  </button>

                  {/* Trust signals */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <ShieldCheck size={18} className="text-primary flex-shrink-0" />
                      <span>Garanzia soddisfatti o rimborsati</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CreditCard size={18} className="text-primary flex-shrink-0" />
                      <span>Pagamento sicuro con Stripe</span>
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="input"
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="input"
                      placeholder="mario@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefono (opzionale)
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="input"
                      placeholder="+39 333 123 4567"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="btn btn-primary w-full py-3.5"
                  >
                    {checkoutLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        Procedi al pagamento
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    Annulla
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
