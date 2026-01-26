import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Download, ArrowRight } from 'lucide-react';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Pagamento Completato!
        </h1>

        <p className="text-gray-600 mb-8">
          Grazie per il tuo acquisto! Riceverai a breve una email con tutti i dettagli
          e i materiali del tuo programma.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Prossimi Passi:</h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <span className="text-gray-600">
                Controlla la tua email per la conferma dell'ordine
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary mt-0.5" />
              <span className="text-gray-600">
                Scarica i materiali del programma allegati all'email
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <span className="text-gray-600">
                Inizia il tuo percorso verso il benessere!
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Torna alla Home
            <ArrowRight size={18} />
          </Link>
          <Link to="/pacchetti" className="btn btn-secondary">
            Esplora Altri Pacchetti
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Hai domande? Contattaci a{' '}
          <a href="mailto:info@saluteefede.it" className="text-primary hover:underline">
            info@saluteefede.it
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
