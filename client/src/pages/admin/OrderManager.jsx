import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  Mail,
  Phone,
  Download,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderManager = () => {
  const { getAccessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const token = getAccessToken();
      const data = await adminApi.getOrders(token);
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = getAccessToken();
      await adminApi.updateOrderStatus(token, orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      alert('Errore durante l\'aggiornamento');
    }
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefono', 'Pacchetto', 'Importo', 'Stato', 'Data'];
    const rows = filteredOrders.map((order) => [
      order.customer_name,
      order.customer_email,
      order.customer_phone || '',
      order.packages?.name || '',
      order.amount,
      order.status,
      new Date(order.created_at).toLocaleDateString('it-IT'),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordini_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'In attesa',
      completed: 'Completato',
      cancelled: 'Annullato',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Gestione Ordini</h1>
          <p className="text-gray-600">{filteredOrders.length} ordini trovati</p>
        </div>
        <button onClick={exportCSV} className="btn btn-secondary">
          <Download size={18} />
          Esporta CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-40"
            >
              <option value="all">Tutti gli stati</option>
              <option value="pending">In attesa</option>
              <option value="completed">Completati</option>
              <option value="cancelled">Annullati</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">Nessun ordine trovato</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{order.customer_name}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {order.customer_email}
                      </span>
                      {order.customer_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {order.customer_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.created_at).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Totale</p>
                      <p className="text-xl font-bold text-primary">€{parseFloat(order.amount).toFixed(2)}</p>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="px-4 md:px-6 pb-6 border-t bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dettagli Pacchetto</h4>
                      <p className="text-gray-600">{order.packages?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Prezzo: €{order.packages?.price || order.amount}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">ID Pagamento Stripe</h4>
                      <p className="text-gray-600 text-sm font-mono break-all">
                        {order.stripe_payment_id || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <span className="text-sm font-medium text-gray-700">Aggiorna stato:</span>
                    <div className="flex gap-2">
                      {['pending', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order.id, status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            order.status === status
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {status === 'pending' && 'In attesa'}
                          {status === 'completed' && 'Completato'}
                          {status === 'cancelled' && 'Annullato'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
