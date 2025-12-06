import React, { useState, useEffect } from 'react';
import { 
  Plus,
  X,
  Clock,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase
} from 'lucide-react';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

const Pipeline = () => {
  const [needs, setNeeds] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [matchingTalents, setMatchingTalents] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    priority: 'Normale',
    start_date: '',
    end_date: '',
    charge: '',
    description: '',
    required_skills: '',
    remote_possible: false,
    location: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [needsRes, talentsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/needs?order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/talents`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        })
      ]);

      const needsData = await needsRes.json();
      const talentsData = await talentsRes.json();
      
      setNeeds(needsData || []);
      setTalents(talentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const needData = {
        ...formData,
        required_skills: skillsArray,
        charge: parseInt(formData.charge) || 0,
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/needs`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(needData)
      });

      if (response.ok) {
        await fetchData();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating need:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      priority: 'Normale',
      start_date: '',
      end_date: '',
      charge: '',
      description: '',
      required_skills: '',
      remote_possible: false,
      location: '',
    });
  };

  const moveNeed = async (needId, newStatus) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/needs?id=eq.${needId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      await fetchData();
    } catch (error) {
      console.error('Error moving need:', error);
    }
  };

  const calculateMatchScore = (talent, need) => {
    let score = 0;
    const needSkills = need.required_skills || [];
    const talentSkills = talent.skills || [];

    if (needSkills.length === 0) return 50;

    const matchingSkills = needSkills.filter(ns => 
      talentSkills.some(ts => 
        ts.toLowerCase().includes(ns.toLowerCase()) || 
        ns.toLowerCase().includes(ts.toLowerCase())
      )
    );

    score = (matchingSkills.length / needSkills.length) * 100;

    // Bonus si disponible
    if (talent.availability === 'Disponible') score += 10;
    
    return Math.min(Math.round(score), 100);
  };

  const findMatchingTalents = (need) => {
    const matched = talents.map(talent => ({
      ...talent,
      matchScore: calculateMatchScore(talent, need)
    }))
    .filter(t => t.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore);

    setMatchingTalents(matched);
    setSelectedNeed(need);
    setShowMatchingModal(true);
  };

  const assignTalent = async (talentId) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/needs?id=eq.${selectedNeed.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          assigned_talent_id: talentId,
          status: 'À valider'
        })
      });

      // Créer l'affectation
      await fetch(`${SUPABASE_URL}/rest/v1/assignments`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          talent_id: talentId,
          need_id: selectedNeed.id,
          start_date: selectedNeed.start_date,
          end_date: selectedNeed.end_date,
        })
      });

      await fetchData();
      setShowMatchingModal(false);
    } catch (error) {
      console.error('Error assigning talent:', error);
    }
  };

  const columns = [
    { id: 'À qualifier', title: 'À qualifier', color: 'border-yellow-400' },
    { id: 'À staffer', title: 'À staffer', color: 'border-blue-400' },
    { id: 'À valider', title: 'À valider', color: 'border-green-400' },
  ];

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline de staffing</h1>
            <p className="text-gray-600 text-sm mt-1">{needs.length} besoins</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Créer un besoin
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnNeeds = needs.filter(n => n.status === column.id);
            
            return (
              <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {columnNeeds.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnNeeds.map((need) => {
                    const daysRemaining = getDaysRemaining(need.end_date);
                    const assignedTalent = talents.find(t => t.id === need.assigned_talent_id);

                    return (
                      <div
                        key={need.id}
                        className={`bg-white rounded-lg p-4 border-l-4 ${column.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                        onClick={() => findMatchingTalents(need)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{need.name}</h4>
                          {daysRemaining !== null && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              daysRemaining < 7 ? 'bg-red-100 text-red-700' :
                              daysRemaining < 14 ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {daysRemaining}j restants
                            </span>
                          )}
                        </div>

                        {need.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {need.description}
                          </p>
                        )}

                        <div className="space-y-2">
                          {need.charge > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock size={14} />
                              {need.charge} jours
                            </div>
                          )}
                          
                          {need.required_skills && need.required_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {need.required_skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {need.required_skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{need.required_skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {assignedTalent && (
                            <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 p-2 rounded">
                              <Users size={14} />
                              {assignedTalent.name}
                            </div>
                          )}
                        </div>

                        {/* Quick actions */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                          {column.id === 'À qualifier' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveNeed(need.id, 'À staffer');
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              → Qualifier
                            </button>
                          )}
                          {column.id === 'À staffer' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                findMatchingTalents(need);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              🎯 Trouver un talent
                            </button>
                          )}
                          {column.id === 'À valider' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Besoin validé !');
                              }}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              ✓ Valider
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Create Need */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Créer un besoin</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du besoin*
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Normale">Normale</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Charge (jours)
                  </label>
                  <input
                    type="number"
                    value={formData.charge}
                    onChange={(e) => setFormData({...formData, charge: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compétences requises (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.required_skills}
                  onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                  placeholder="React, Node.js, Python..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={formData.remote_possible}
                  onChange={(e) => setFormData({...formData, remote_possible: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="remote" className="text-sm text-gray-700">
                  Télétravail possible
                </label>
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
                  {loading ? 'Création...' : 'Créer le besoin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Matching Talents */}
      {showMatchingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                Talents correspondants pour "{selectedNeed?.name}"
              </h2>
              <button onClick={() => setShowMatchingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {matchingTalents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucun talent correspondant trouvé</p>
              ) : (
                <div className="space-y-3">
                  {matchingTalents.map((talent) => (
                    <div key={talent.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{talent.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              talent.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                              talent.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {talent.matchScore}% match
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              talent.availability === 'Disponible' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {talent.availability}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {talent.skills && talent.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {talent.email && (
                            <p className="text-sm text-gray-600">{talent.email}</p>
                          )}
                        </div>

                        <button
                          onClick={() => assignTalent(talent.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Assigner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
