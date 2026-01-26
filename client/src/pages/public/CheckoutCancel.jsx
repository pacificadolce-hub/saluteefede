import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Pagamento Annullato
        </h1>

        <p className="text-gray-600 mb-8">
          Il pagamento è stato annullato. Non ti è stato addebitato nulla.
          Se hai cambiato idea, puoi sempre tornare a completare l'acquisto.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Hai riscontrato problemi?
          </h3>
          <p className="text-gray-600 text-sm">
            Se hai avuto difficoltà durante il processo di pagamento o hai domande,
            non esitare a contattarci. Siamo qui per aiutarti!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pacchetti" className="btn btn-primary">
            <ArrowLeft size={18} />
            Torna ai Pacchetti
          </Link>
          <Link to="/contatti" className="btn btn-secondary">
            Contattaci
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Email:{' '}
          <a href="mailto:info@saluteefede.it" className="text-primary hover:underline">
            info@saluteefede.it
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default CheckoutCancel;
