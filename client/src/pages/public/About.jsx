import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: t('about.passion'),
      description: t('about.passionDesc'),
    },
    {
      icon: Leaf,
      title: t('about.natural'),
      description: t('about.naturalDesc'),
    },
    {
      icon: Sparkles,
      title: t('about.care'),
      description: t('about.careDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Yaneth Section */}
      <section className="py-6 md:py-10 bg-white">
        <div className="container-custom">
          {/* Title */}
          <div className="mb-6">
            <span className="text-primary font-medium text-sm">Salute e Fede</span>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-1">
              {t('about.greeting')}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=500&fit=crop"
                alt="Yaneth Quinones"
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-4">
                {t('about.name')}
              </h2>
              <p className="text-primary font-medium mb-4">{t('about.role')}</p>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('about.story1')}</p>
                <p>{t('about.story2')}</p>
                <p>{t('about.story3')}</p>
                <p>{t('about.story4')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
              {t('about.myValues')}
            </h2>
            <p className="text-gray-600">
              {t('about.valuesSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              {t('about.startJourney')}
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {t('about.startJourneyDesc')}
            </p>
            <Link
              to="/pacchetti"
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3"
            >
              {t('about.viewPackages')}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
