import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Euro,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { getAccessToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAccessToken();
        const [statsData, ordersData] = await Promise.all([
          adminApi.getStats(token),
          adminApi.getOrders(token),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAccessToken]);

  const statCards = [
    {
      title: 'Pacchetti Attivi',
      value: stats?.activePackages || 0,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/pacchetti',
    },
    {
      title: 'Ordini Totali',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
      link: '/admin/ordini',
    },
    {
      title: 'Ricavi Totali',
      value: `€${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: Euro,
      color: 'bg-primary',
      link: '/admin/ordini',
    },
  ];

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
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
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Benvenuto nel pannello di amministrazione</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const Card = stat.link ? Link : 'div';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                to={stat.link}
                className={`bg-white rounded-xl p-6 shadow-sm ${stat.link ? 'hover:shadow-md transition-shadow' : ''} block`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.link && <ArrowRight size={20} className="text-gray-400" />}
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ordini Recenti</h2>
          <Link
            to="/admin/ordini"
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Vedi tutti
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nessun ordine ancora
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pacchetto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Importo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.packages?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      €{parseFloat(order.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.created_at).toLocaleDateString('it-IT')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
