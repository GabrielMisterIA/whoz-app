import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  Users,
  FileText,
  Briefcase,
  Grid,
  Calendar,
  BarChart3,
  Sparkles,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // TODO: Implémenter la recherche globale
      console.log('Recherche:', searchTerm);
    }
  };

  const menus = {
    talents: [
      { label: 'Tous les talents', path: '/talents', icon: Users },
      { label: 'Talents internes', path: '/talents?type=Interne', icon: Users },
      { label: 'Talents externes', path: '/talents?type=Externe', icon: Users },
      { label: 'Alumni', path: '/talents?type=Alumni', icon: Users },
    ],
    demandes: [
      { label: 'Pipeline de staffing', path: '/pipeline', icon: Grid },
      { label: 'Tous les besoins', path: '/besoins', icon: FileText },
      { label: 'Besoins urgents', path: '/pipeline?priority=Urgente', icon: Sparkles },
      { label: 'Opportunités', path: '/dashboard', icon: Briefcase },
    ],
    operations: [
      { label: 'Staffing board', path: '/staffing-board', icon: Grid },
      { label: 'Master schedule', path: '/schedule', icon: Calendar },
      { label: 'Affectations', path: '/affectations', icon: Users },
      { label: 'Projets', path: '/projets', icon: Briefcase },
    ],
    analytics: [
      { label: 'Vue d\'ensemble', path: '/analytics', icon: BarChart3 },
      { label: 'Analyses des talents', path: '/analytics/talents', icon: Users },
      { label: 'Analyses des besoins', path: '/analytics/besoins', icon: FileText },
      { label: 'Performance', path: '/analytics/performance', icon: Sparkles },
    ],
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'Accueil', path: '/dashboard' }];

    if (path.includes('/talents')) {
      crumbs.push({ label: 'Talents', path: '/talents' });
      if (path.includes('/talents/')) {
        crumbs.push({ label: 'Détail', path: path });
      }
    } else if (path.includes('/pipeline')) {
      crumbs.push({ label: 'Pipeline', path: '/pipeline' });
    } else if (path.includes('/besoins')) {
      crumbs.push({ label: 'Besoins', path: '/besoins' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-900 font-bold text-xl">W</span>
                </div>
              </Link>

              {/* Dropdown du nom de l'entreprise */}
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === 'company' ? null : 'company')}
                  className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2"
                >
                  {user?.company || 'Mon Entreprise'}
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="hidden md:flex gap-4">
                {Object.entries(menus).map(([key, items]) => (
                  <div key={key} className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                      className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2 capitalize"
                    >
                      {key}
                      <ChevronDown size={16} />
                    </button>
                    {activeMenu === key && (
                      <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-64 z-50">
                        {items.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                            onClick={() => setActiveMenu(null)}
                          >
                            <item.icon size={18} className="text-gray-600" />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              </form>

              {/* Icons */}
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Aide">
                <HelpCircle size={20} />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Paramètres">
                <Settings size={20} />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === 'user' ? null : 'user')}
                  className="bg-purple-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
                >
                  {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'GA'}
                </button>
                {activeMenu === 'user' && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setActiveMenu(null)}
                    >
                      <User size={18} />
                      Mon profil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setActiveMenu(null)}
                    >
                      <Settings size={18} />
                      Paramètres
                    </Link>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-blue-600 hover:text-blue-800">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
