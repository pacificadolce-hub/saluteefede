import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = ({ phoneNumber = '393331234567', message = 'Ciao! Vorrei informazioni sui pacchetti.' }) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Contattaci su WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </motion.button>
  );
};

export default WhatsAppButton;
