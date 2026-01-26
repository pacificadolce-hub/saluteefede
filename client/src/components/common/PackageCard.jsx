import { Link } from 'react-router-dom';
import { Clock, Check, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const PackageCard = ({ pkg, featured = false }) => {
  const { t } = useLanguage();

  // Get display image: use image_url, or first gallery image as fallback
  const getDisplayImage = () => {
    if (pkg.image_url) return pkg.image_url;
    if (pkg.gallery_images && pkg.gallery_images.length > 0) {
      return pkg.gallery_images[0];
    }
    return null;
  };

  const displayImage = getDisplayImage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link
        to={`/pacchetti/${pkg.slug}`}
        className={`block h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
          featured ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={pkg.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-5xl">🥗</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badge */}
          {featured && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <Star size={12} fill="white" />
              {t('packageDetail.popular')}
            </span>
          )}

          {/* Duration badge */}
          {pkg.duration_days && (
            <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              {pkg.duration_days} {t('packageDetail.days')}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {pkg.name}
          </h3>

          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {pkg.short_description || pkg.description}
          </p>

          {/* Features - compact */}
          {pkg.features && pkg.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {pkg.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  <Check size={10} className="flex-shrink-0" />
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">€{pkg.price}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
              {t('packageCard.discover')}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
