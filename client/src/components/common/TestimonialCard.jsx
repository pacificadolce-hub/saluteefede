import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const TestimonialCard = ({ testimonial }) => {
  const { t } = useLanguage();
  const hasTransformation = testimonial.before_image_url && testimonial.after_image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full flex flex-col"
    >
      {/* Before/After Transformation */}
      {hasTransformation && (
        <div className="mb-4 -mx-5 -mt-5 rounded-t-xl overflow-hidden">
          <div className="relative">
            <div className="grid grid-cols-2">
              <div className="relative">
                <img
                  src={testimonial.before_image_url}
                  alt="Prima"
                  className="w-full h-32 object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                  Prima
                </span>
              </div>
              <div className="relative">
                <img
                  src={testimonial.after_image_url}
                  alt="Dopo"
                  className="w-full h-32 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                  Dopo
                </span>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg">
              <ArrowRight size={14} className="text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 text-sm leading-relaxed flex-grow mb-4">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        {testimonial.image_url ? (
          <img
            src={testimonial.image_url}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800 text-sm">{testimonial.name}</p>
          <p className="text-xs text-gray-400">{t('testimonials.verifiedClient')}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
