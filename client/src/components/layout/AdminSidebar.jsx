import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  LogOut,
  Leaf,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Pacchetti', path: '/admin/pacchetti', icon: Package },
    { name: 'Ordini', path: '/admin/ordini', icon: ShoppingCart },
    { name: 'Testimonianze', path: '/admin/testimonianze', icon: MessageSquare },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-primary">Admin</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Torna al sito</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Esci</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
