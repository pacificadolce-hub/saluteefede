import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, LogIn, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signInDemo, loading: authLoading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || 'Email o password non validi');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('Errore durante il login. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInDemo();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Accedi al pannello di amministrazione
          </p>
        </div>

        {/* Demo Mode Notice */}
        {!isConfigured && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-sm mb-6 flex gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Modalita Demo</p>
              <p className="mt-1">Supabase non configurato. Usa le credenziali demo:</p>
              <p className="mt-1 font-mono text-xs bg-blue-100 p-2 rounded">
                Email: admin@demo.com<br />
                Password: demo123
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12"
                placeholder="admin@demo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <LogIn size={20} />
                Accedi
              </>
            )}
          </button>
        </form>

        {/* Demo Login Button */}
        {!isConfigured && (
          <button
            onClick={handleDemoLogin}
            className="btn btn-secondary w-full py-4 mt-4"
          >
            Accedi in Modalita Demo
          </button>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/" className="text-primary hover:underline">
            Torna al sito
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
