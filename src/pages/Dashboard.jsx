import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  BarChart3, 
  Calendar, 
  FileText, 
  Grid,
  Sparkles,
  Briefcase,
  LogOut,
  HelpCircle,
  Settings,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    { icon: Users, label: 'Votre équipe', color: 'bg-emerald-100 text-emerald-700' },
    { icon: Search, label: 'Moteur de casting', color: 'bg-amber-100 text-amber-700' },
    { icon: BarChart3, label: 'Pipeline de staffing', color: 'bg-yellow-100 text-yellow-700' },
    { icon: Grid, label: 'Staffing Board', color: 'bg-orange-100 text-orange-700' },
    { icon: Calendar, label: 'Master schedule', color: 'bg-pink-100 text-pink-700' },
    { icon: Sparkles, label: 'Tableau de bord staffing', color: 'bg-purple-100 text-purple-700' },
    { icon: Briefcase, label: 'Créer un besoin', color: 'bg-indigo-100 text-indigo-700' },
    { icon: FileText, label: 'Créer une action', color: 'bg-blue-100 text-blue-700' },
  ];

  const stats = [
    { 
      label: 'Vos actions à réaliser', 
      sublabel: 'dans les 7 prochains jours', 
      value: '0' 
    },
    { 
      label: 'Opportunités', 
      sublabel: 'que vous possédez ou gérez', 
      value: '0' 
    },
    { 
      label: 'Talents en surcharge', 
      sublabel: 'dans l\'espace courant', 
      value: '3',
      highlight: true
    },
    { 
      label: 'Talents sur le bench', 
      sublabel: 'dans les 8 prochaines semaines', 
      value: '25',
      highlight: true
    },
    { 
      label: 'Profils en attente de validation', 
      sublabel: 'dans l\'espace courant', 
      value: '3',
      highlight: true
    },
  ];

  const additionalStat = {
    label: 'Besoins partagés en attente de réponse',
    sublabel: 'soumis par d\'autres espaces',
    value: '0',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-900 font-bold text-xl">M</span>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="hidden md:flex gap-6">
                <button className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1">
                  Mister IA
                  <span className="text-xs">▼</span>
                </button>
                <button className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1">
                  Talents
                  <span className="text-xs">▼</span>
                </button>
                <button className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1">
                  Demandes
                  <span className="text-xs">▼</span>
                </button>
                <button className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1">
                  Opérations
                  <span className="text-xs">▼</span>
                </button>
                <button className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1">
                  Analytics
                  <span className="text-xs">▼</span>
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              </div>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <HelpCircle size={20} />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <User size={20} />
              </button>
              <div className="bg-whoz-purple px-3 py-2 rounded-lg font-medium text-sm">
                GA
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Bonjour {user?.fullName || 'Gabriel A.'} !
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col items-center gap-3 group"
            >
              <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            En un coup d'œil
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                  stat.highlight ? 'ring-2 ring-purple-200' : ''
                }`}
              >
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {stat.sublabel}
                </div>
                <div className={`text-4xl font-display font-bold ${
                  stat.highlight ? 'text-whoz-purple' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all max-w-sm">
            <div className="text-sm text-gray-600 mb-1 font-medium">
              {additionalStat.label}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {additionalStat.sublabel}
            </div>
            <div className="text-4xl font-display font-bold text-gray-900">
              {additionalStat.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
