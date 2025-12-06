import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  Users, 
  Search, 
  BarChart3, 
  Calendar, 
  FileText, 
  Grid,
  Sparkles,
  Briefcase
} from 'lucide-react';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    talents: 0,
    needs: 0,
    needsToStaff: 0,
    talentsAvailable: 0,
  });

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
    <Layout>
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-[calc(100vh-64px)]">
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
    </Layout>
  );
};

export default Dashboard;
