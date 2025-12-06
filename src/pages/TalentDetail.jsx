import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

const TalentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const [talent, setTalent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTalentData();
  }, [id]);

  const fetchTalentData = async () => {
    try {
      // Fetch talent
      const talentRes = await fetch(
        `${SUPABASE_URL}/rest/v1/talents?id=eq.${id}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );
      const talentData = await talentRes.json();
      
      if (talentData && talentData.length > 0) {
        setTalent(talentData[0]);
        setFormData(talentData[0]);
      }

      // Fetch assignments
      const assignmentsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/assignments?talent_id=eq.${id}&select=*,needs(*)`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData || []);
      
    } catch (err) {
      console.error('Error fetching talent:', err);
      error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const skillsArray = typeof formData.skills === 'string' 
        ? formData.skills.split(',').map(s => s.trim()).filter(s => s)
        : formData.skills;

      const updateData = {
        ...formData,
        skills: skillsArray,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/talents?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        }
      );

      if (response.ok) {
        success('Talent mis à jour avec succès');
        setEditing(false);
        fetchTalentData();
      }
    } catch (err) {
      error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce talent ?')) {
      return;
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/talents?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );

      if (response.ok) {
        success('Talent supprimé avec succès');
        navigate('/talents');
      }
    } catch (err) {
      error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!talent) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Talent non trouvé</h2>
            <button
              onClick={() => navigate('/talents')}
              className="text-blue-600 hover:text-blue-800"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/talents')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          
          <div className="flex gap-2">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit size={18} />
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={18} />
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(talent);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X size={18} />
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">{talent.name}</h1>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {editing ? (
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                      >
                        <option value="Interne">Interne</option>
                        <option value="Externe">Externe</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        talent.type === 'Interne' ? 'bg-blue-100 text-blue-700' :
                        talent.type === 'Externe' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {talent.type}
                      </span>
                    )}
                    {editing ? (
                      <select
                        value={formData.availability || ''}
                        onChange={(e) => setFormData({...formData, availability: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Occupé">Occupé</option>
                        <option value="Partiellement disponible">Partiellement disponible</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        talent.availability === 'Disponible' ? 'bg-green-100 text-green-700' :
                        talent.availability === 'Occupé' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {talent.availability}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Complétude du profil</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${talent.profile_completion}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{talent.profile_completion}%</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {talent.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} />
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span>{talent.email}</span>
                    )}
                  </div>
                )}
                {talent.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} />
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span>{talent.phone}</span>
                    )}
                  </div>
                )}
                {talent.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} />
                    {editing ? (
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span>{talent.location}</span>
                    )}
                  </div>
                )}
                {talent.circle && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase size={18} />
                    {editing ? (
                      <input
                        type="text"
                        value={formData.circle || ''}
                        onChange={(e) => setFormData({...formData, circle: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span>{talent.circle}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compétences</h3>
                {editing ? (
                  <input
                    type="text"
                    value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Node.js, Python..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {talent.skills && talent.skills.length > 0 ? (
                      talent.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Aucune compétence renseignée</span>
                    )}
                  </div>
                )}
              </div>

              {/* Experience */}
              {(talent.experience || editing) && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Expérience</h3>
                  {editing ? (
                    <textarea
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-600 whitespace-pre-line">{talent.experience}</p>
                  )}
                </div>
              )}
            </div>

            {/* Assignments History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Historique des affectations ({assignments.length})
              </h3>
              
              {assignments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucune affectation</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{assignment.needs?.name || 'Besoin supprimé'}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(assignment.start_date).toLocaleDateString('fr-FR')} - {new Date(assignment.end_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === 'En cours' ? 'bg-green-100 text-green-700' :
                          assignment.status === 'Terminé' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Affectations totales</div>
                  <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Affectations en cours</div>
                  <div className="text-2xl font-bold text-green-600">
                    {assignments.filter(a => a.status === 'En cours').length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Membre depuis</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(talent.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Voir les besoins correspondants
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Télécharger le CV
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Contacter par email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TalentDetail;
