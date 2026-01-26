import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { sendContactMessage } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'info@saluteefede.it',
      link: 'mailto:info@saluteefede.it',
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: '+39 333 123 4567',
      link: 'tel:+393331234567',
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      value: 'Via della Salute, 123\n00100 Roma, Italia',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-6 md:py-10">
        <div className="container-custom">
          {/* Title */}
          <div className="mb-6">
            <span className="text-primary font-medium text-sm">Salute e Fede</span>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-1">
              {t('contact.title')}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
                {t('contact.contactInfo')}
              </h2>

              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{info.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Social Links */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">{t('contact.followSocial')}</h3>
                <div className="flex gap-4">
                  {['facebook', 'instagram', 'youtube'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors capitalize text-gray-600"
                    >
                      {social.charAt(0).toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                  {t('contact.sendMessage')}
                </h2>

                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {t('contact.messageSent')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('contact.thankYou')}
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn btn-primary"
                    >
                      {t('contact.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('contact.fullName')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input"
                          placeholder="Mario Rossi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input"
                          placeholder="mario@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.message')} *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="input resize-none"
                        placeholder="..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full md:w-auto"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Send size={18} />
                          {t('contact.send')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
