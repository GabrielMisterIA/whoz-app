import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
  User,
  ChevronDown
} from 'lucide-react';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    talents: 0,
    needs: 0,
    needsToStaff: 0,
    talentsAvailable: 0,
  });
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [talentsRes, needsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/talents`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/needs`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        })
      ]);

      const talents = await talentsRes.json();
      const needs = await needsRes.json();

      setStats({
        talents: talents?.length || 0,
        needs: needs?.length || 0,
        needsToStaff: needs?.filter(n => n.status === 'À staffer').length || 0,
        talentsAvailable: talents?.filter(t => t.availability === 'Disponible').length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    { icon: Users, label: 'Votre équipe', link: '/talents', color: 'bg-emerald-100 text-emerald-700' },
    { icon: Search, label: 'Moteur de casting', link: '/talents', color: 'bg-amber-100 text-amber-700' },
    { icon: BarChart3, label: 'Pipeline de staffing', link: '/pipeline', color: 'bg-yellow-100 text-yellow-700' },
    { icon: Grid, label: 'Staffing Board', link: '/pipeline', color: 'bg-orange-100 text-orange-700' },
    { icon: Calendar, label: 'Master schedule', link: '/pipeline', color: 'bg-pink-100 text-pink-700' },
    { icon: Sparkles, label: 'Dashboard staffing', link: '/dashboard', color: 'bg-purple-100 text-purple-700' },
    { icon: Briefcase, label: 'Créer un besoin', link: '/pipeline', color: 'bg-indigo-100 text-indigo-700' },
    { icon: FileText, label: 'Créer une action', link: '/dashboard', color: 'bg-blue-100 text-blue-700' },
  ];

  const menus = {
    talents: [
      { label: 'Moteur de casting', icon: Search },
      { label: 'Talents', icon: Users },
      { label: 'Talents internes', icon: Users },
      { label: 'Talents externes', icon: Users },
      { label: 'Certifications', icon: FileText },
      { label: 'Références commerciales', icon: Briefcase },
    ],
    demandes: [
      { label: 'Pipeline de staffing', icon: Grid },
      { label: 'Besoins', icon: FileText },
      { label: 'Postes ouverts', icon: Briefcase },
      { label: 'Pipeline business', icon: BarChart3 },
      { label: 'Opportunités', icon: Sparkles },
      { label: 'Comptes', icon: Users },
      { label: 'Contacts', icon: User },
    ],
    operations: [
      { label: 'Staffing board', icon: Grid },
      { label: 'Master schedule', icon: Calendar },
      { label: 'Planning projets', icon: Calendar },
      { label: 'Projets', icon: Briefcase },
      { label: 'Affaires', icon: FileText },
      { label: 'Affectations', icon: Users },
      { label: 'Suivi des temps', icon: Calendar },
      { label: 'Suivi financier', icon: BarChart3 },
      { label: 'Pilotage', icon: Settings },
    ],
    analytics: [
      { label: 'Analyses des actions', icon: BarChart3 },
      { label: 'Analyses des talents', icon: Users },
      { label: 'Analyses des demandes', icon: FileText },
      { label: 'Analyses des opérations', icon: Settings },
      { label: 'Météo de l\'espace courant', icon: Sparkles },
      { label: 'Performance center', icon: BarChart3 },
    ],
  };

  const statsDisplay = [
    { 
      label: 'Vos actions à réaliser', 
      sublabel: 'dans les 7 prochains jours', 
      value: '0' 
    },
    { 
      label: 'Opportunités', 
      sublabel: 'que vous possédez ou gérez', 
      value: stats.needs.toString()
    },
    { 
      label: 'Talents en surcharge', 
      sublabel: 'dans l\'espace courant', 
      value: '0',
      highlight: true
    },
    { 
      label: 'Talents disponibles', 
      sublabel: 'dans les prochaines semaines', 
      value: stats.talentsAvailable.toString(),
      highlight: true
    },
    { 
      label: 'Besoins à staffer', 
      sublabel: 'dans l\'espace courant', 
      value: stats.needsToStaff.toString(),
      highlight: true
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-900 font-bold text-xl">M</span>
                </div>
              </Link>

              {/* Navigation Items */}
              <div className="hidden md:flex gap-4 relative">
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === 'talents' ? null : 'talents')}
                    className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2"
                  >
                    Talents
                    <ChevronDown size={16} />
                  </button>
                  {activeMenu === 'talents' && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-56 z-50">
                      {menus.talents.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.label === 'Talents' ? '/talents' : '/dashboard'}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === 'demandes' ? null : 'demandes')}
                    className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2"
                  >
                    Demandes
                    <ChevronDown size={16} />
                  </button>
                  {activeMenu === 'demandes' && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-56 z-50">
                      {menus.demandes.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.label.includes('Pipeline') || item.label === 'Besoins' ? '/pipeline' : '/dashboard'}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === 'operations' ? null : 'operations')}
                    className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2"
                  >
                    Opérations
                    <ChevronDown size={16} />
                  </button>
                  {activeMenu === 'operations' && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-56 z-50">
                      {menus.operations.map((item, idx) => (
                        <Link
                          key={idx}
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === 'analytics' ? null : 'analytics')}
                    className="hover:text-purple-200 transition-colors font-medium flex items-center gap-1 py-2"
                  >
                    Analytics
                    <ChevronDown size={16} />
                  </button>
                  {activeMenu === 'analytics' && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-56 z-50">
                      {menus.analytics.map((item, idx) => (
                        <Link
                          key={idx}
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
              <button onClick={handleLogout} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <LogOut size={20} />
              </button>
              <div className="bg-whoz-purple px-3 py-2 rounded-lg font-medium text-sm">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'GA'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Bonjour {user?.fullName || 'Gabriel A.'} !
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col items-center gap-3 group"
            >
              <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            En un coup d'œil
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsDisplay.map((stat, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
