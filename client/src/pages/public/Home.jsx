import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Target,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { getFeaturedPackages, getTestimonials } from '../../services/api';
import PackageCard from '../../components/common/PackageCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, testimonialsData] = await Promise.all([
          getFeaturedPackages(),
          getTestimonials(),
        ]);
        setPackages(packagesData);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const benefits = [
    {
      icon: Heart,
      title: t('home.benefits.passion'),
      description: t('home.benefits.passionDesc'),
    },
    {
      icon: Target,
      title: t('home.benefits.personalized'),
      description: t('home.benefits.personalizedDesc'),
    },
    {
      icon: Sparkles,
      title: t('home.benefits.quality'),
      description: t('home.benefits.qualityDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('home.benefits.guaranteed'),
      description: t('home.benefits.guaranteedDesc'),
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Brand focused */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-custom py-8 md:py-12 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Brand name prominent */}
              <div className="mb-6">
                <span className="text-primary font-heading text-lg md:text-xl font-semibold">
                  {t('home.brand')}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                {t('home.heroTitle')}{' '}
                <span className="text-primary">{t('home.heroHighlight')}</span>
              </h1>

              <p className="text-gray-600 text-lg mb-3 max-w-2xl mx-auto">
                {t('home.heroDescription')}
              </p>

              <p className="text-gray-500 text-sm mb-8">
                {t('home.heroSubtext')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/pacchetti"
                  className="btn btn-primary px-8 py-3.5 text-base"
                >
                  {t('home.discoverPackages')}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/chi-siamo"
                  className="btn btn-secondary px-8 py-3.5 text-base"
                >
                  {t('home.meetYaneth')}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Benefits bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{benefit.title}</p>
                    <p className="text-gray-500 text-xs">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
                {t('home.ourPackages')}
              </h2>
              <p className="text-gray-500 mt-1">
                {t('home.choosePerfect')}
              </p>
            </div>
            <Link
              to="/pacchetti"
              className="hidden md:inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
            >
              {t('home.viewAll')}
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('home.noPackagesYet')}</p>
            </div>
          ) : (
            <>
              {/* Unified Horizontal Scroll for all screens */}
              <div className="relative group">
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="w-80 md:w-96 flex-shrink-0">
                      <PackageCard pkg={pkg} featured={pkg.is_featured} />
                    </div>
                  ))}
                </div>
                {/* Visual hint for scrolling on desktop */}
                <div className="hidden md:block absolute right-0 top-0 bottom-8 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
              </div>
            </>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/pacchetti" className="btn btn-secondary">
              {t('home.viewAllPackages')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
                {t('home.testimonials')}
              </h2>
              <p className="text-gray-500">{t('home.testimonialsSubtitle')}</p>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            {/* Mobile: Carousel */}
            <div className="md:hidden">
              <TestimonialCard testimonial={testimonials[currentTestimonial]} />
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-white/80 mb-8">
              {t('home.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/pacchetti"
                className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3.5"
              >
                {t('home.choosePackage')}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
