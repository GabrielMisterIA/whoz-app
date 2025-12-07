import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

const Talents = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    availability: '',
    skills: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Externe',
    circle: '',
    skills: '',
    experience: '',
    location: '',
    availability: 'Disponible'
  });

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/talents?order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      });
      const data = await response.json();
      setTalents(data || []);
    } catch (err) {
      console.error('Error fetching talents:', err);
      showError('Erreur lors du chargement des talents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const talentData = {
        ...formData,
        skills: skillsArray,
        profile_completion: 50,
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/talents`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(talentData)
      });

      if (response.ok) {
        success('Talent créé avec succès');
        await fetchTalents();
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'Externe',
          circle: '',
          skills: '',
          experience: '',
          location: '',
          availability: 'Disponible'
        });
      }
    } catch (err) {
      console.error('Error creating talent:', err);
      showError('Erreur lors de la création du talent');
    } finally {
      setLoading(false);
    }
  };

  const filteredTalents = talents.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filters.type || t.type === filters.type;
    const matchesAvailability = !filters.availability || t.availability === filters.availability;
    const matchesSkills = !filters.skills || (t.skills && t.skills.some(s => 
      s.toLowerCase().includes(filters.skills.toLowerCase())
    ));

    return matchesSearch && matchesType && matchesAvailability && matchesSkills;
  });

  return (
    <Layout>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Talents</h1>
            <p className="text-gray-600 text-sm mt-1">{filteredTalents.length} talent{filteredTalents.length > 1 ? 's' : ''} trouvé{filteredTalents.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Créer un talent
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter size={20} />
            Filtres
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="Interne">Interne</option>
                <option value="Externe">Externe</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="Disponible">Disponible</option>
                <option value="Occupé">Occupé</option>
                <option value="Partiellement disponible">Partiellement disponible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compétence</label>
              <input
                type="text"
                placeholder="Ex: React"
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cercle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibilité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredTalents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div>
                      <Users size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Aucun talent trouvé</p>
                      <p className="text-sm text-gray-400 mt-2">Commencez par créer votre premier talent</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTalents.map((talent) => (
                  <tr 
                    key={talent.id} 
                    onClick={() => navigate(`/talents/${talent.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{talent.name}</div>
                        {talent.email && (
                          <div className="text-sm text-gray-500">{talent.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        talent.type === 'Interne' ? 'bg-blue-100 text-blue-700' :
                        talent.type === 'Externe' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {talent.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{talent.circle || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {talent.skills && talent.skills.length > 0 ? (
                          talent.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                        {talent.skills && talent.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{talent.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        talent.availability === 'Disponible' ? 'bg-green-100 text-green-700' :
                        talent.availability === 'Occupé' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {talent.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500"
                            style={{ width: `${talent.profile_completion}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{talent.profile_completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create Talent - (keeping the existing modal code) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Créer un talent</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type*
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Interne">Interne</option>
                    <option value="Externe">Externe</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cercle/Équipe
                  </label>
                  <input
                    type="text"
                    value={formData.circle}
                    onChange={(e) => setFormData({...formData, circle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilité
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Occupé">Occupé</option>
                    <option value="Partiellement disponible">Partiellement disponible</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compétences (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Node.js, Python..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expérience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer le talent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Talents;
