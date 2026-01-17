import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  BarChart3,
  ListTodo,
  ArrowRight,
  History,
  Edit3,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Layout as LayoutIcon,
  ClipboardList,
  Users,
  BookOpen,
  Download,
  Shield,
  Zap,
  Star
} from 'lucide-react';
import { TaskStatus } from '../types';

export default function Dashboard() {
  const { currentUser, userTasksWithDetails, globalStats, updateTaskProgress } = useTaskContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    startDate: '', 
    endDate: '', 
    status: 'NOT_STARTED' as TaskStatus,
    notes: '' 
  });

  const myTasks = userTasksWithDetails.filter(ut => ut.userId === currentUser?.id);
  const recentActivities = userTasksWithDetails.slice(0, 6);

  const stats = [
    { 
      label: 'Mes Tâches', 
      value: myTasks.length, 
      icon: ListTodo, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    { 
      label: 'Terminées', 
      value: myTasks.filter(t => t.status === 'COMPLETED').length, 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    { 
      label: 'En cours', 
      value: myTasks.filter(t => t.status === 'IN_PROGRESS').length, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    { 
      label: 'À faire', 
      value: myTasks.filter(t => t.status === 'NOT_STARTED').length, 
      icon: AlertCircle, 
      color: 'text-slate-600', 
      bg: 'bg-slate-50',
      border: 'border-slate-100'
    },
  ];

  const handleStartEdit = (task: typeof myTasks[0]) => {
    setEditingId(task.id);
    setEditForm({
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      status: task.status,
      notes: task.notes || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateTaskProgress(editingId, {
        startDate: editForm.startDate || undefined,
        endDate: editForm.endDate || undefined,
        status: editForm.status,
        notes: editForm.notes || undefined
      });
      setEditingId(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-2xl">
            👋
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tableau de Bord</h1>
            <p className="text-slate-500 mt-1 font-medium">
              Ravi de vous revoir, <span className="text-indigo-600 font-bold">{currentUser.username}</span>. Voici le point sur vos activités.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <button 
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all font-bold text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Rapport Hebdo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-20 h-20 -mr-4 -mt-4" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase">
                En direct
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <span className="text-[10px] font-bold text-emerald-500">+2%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: My Tasks */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <LayoutIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Mes Missions</h2>
                  <p className="text-xs text-slate-400 font-medium">Liste des tâches qui vous sont confiées</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {myTasks.length} Tâches au total
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Désignation de la Tâche</th>
                    <th className="px-8 py-5">Planning Prévu</th>
                    <th className="px-8 py-5">État Actuel</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myTasks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ListTodo className="w-10 h-10 text-slate-200" />
                          </div>
                          <p className="text-slate-400 font-bold italic">Aucune mission assignée pour le moment.</p>
                          <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Voir les tâches globales</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    myTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{task.taskDesignation}</span>
                            {task.notes ? (
                              <span className="text-xs text-slate-400 mt-1 line-clamp-1">{task.notes}</span>
                            ) : (
                              <span className="text-[10px] text-slate-300 italic mt-1 font-medium">Aucune note particulière</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {editingId === task.id ? (
                            <div className="flex flex-col gap-2 min-w-[160px]">
                              <div className="relative">
                                <span className="absolute left-2 top-1 text-[8px] font-black text-slate-400 uppercase">Début</span>
                                <input 
                                  type="date" 
                                  className="w-full text-xs pt-4 pb-1 px-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                                  value={editForm.startDate}
                                  onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute left-2 top-1 text-[8px] font-black text-slate-400 uppercase">Fin</span>
                                <input 
                                  type="date" 
                                  className="w-full text-xs pt-4 pb-1 px-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                                  value={editForm.endDate}
                                  onChange={e => setEditForm({...editForm, endDate: e.target.value})}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 text-sm text-slate-600 font-bold">
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">Début</span>
                                <span className="tabular-nums">{task.startDate ? new Date(task.startDate).toLocaleDateString('fr-FR') : '—'}</span>
                              </div>
                              <ArrowRight className="w-3 h-3 text-slate-200" />
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">Fin</span>
                                <span className="tabular-nums">{task.endDate ? new Date(task.endDate).toLocaleDateString('fr-FR') : '—'}</span>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          {editingId === task.id ? (
                            <div className="relative">
                              <span className="absolute left-2 top-1 text-[8px] font-black text-slate-400 uppercase">Statut</span>
                              <select 
                                className="w-full text-xs pt-4 pb-1 px-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100 appearance-none font-bold"
                                value={editForm.status}
                                onChange={e => setEditForm({...editForm, status: e.target.value as TaskStatus})}
                              >
                                <option value="NOT_STARTED">À FAIRE</option>
                                <option value="IN_PROGRESS">EN COURS</option>
                                <option value="COMPLETED">TERMINÉ</option>
                              </select>
                            </div>
                          ) : (
                            <StatusBadge status={task.status} />
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {editingId === task.id ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingId(null)}
                                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                title="Annuler"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleSaveEdit}
                                className="p-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-100"
                                title="Enregistrer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleStartEdit(task)}
                              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                              title="Mettre à jour"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Progression Globale - Manager Only */}
          {currentUser.role === 'MANAGER' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">Progression</h2>
                </div>
                <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Détails</button>
              </div>
              <div className="p-6 space-y-6">
                {globalStats.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-4 font-medium">Aucune donnée disponible.</p>
                ) : (
                  globalStats.map(stat => (
                    <div key={stat.taskId} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-700 truncate max-w-[160px]">{stat.designation}</span>
                        <span className="text-xs font-black text-indigo-600">{Math.round(stat.progressPercentage)}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                          style={{ width: `${stat.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-tight">
                        <span className="flex items-center gap-1">
                          <Users className="w-2.5 h-2.5" />
                          Assigné: {stat.totalAssigned}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                          Fait: {stat.completedCount}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <History className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Activité Récente</h2>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {recentActivities.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-slate-400 font-bold italic uppercase tracking-tighter">Flux vide</p>
                </div>
              ) : (
                recentActivities.map(activity => (
                  <div key={activity.id} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                      activity.status === 'COMPLETED' ? 'bg-emerald-500' : 
                      activity.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{activity.taskDesignation}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                        {activity.username} <span className="mx-1 text-slate-200">•</span> {new Date(activity.updatedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))
              )}
            </div>
            {recentActivities.length > 0 && (
              <button className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] border-t border-slate-50 transition-colors">
                Voir tout l'historique
              </button>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <ClipboardList className="w-32 h-32 -mr-10 -mt-10" />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-3 tracking-tight">TaskManager <span className="text-indigo-400">PRO</span></h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                Optimisez votre workflow avec nos outils d'analyse avancés. Toutes vos données sont sécurisées et synchronisées.
              </p>
              <button 
                onClick={() => setIsDocOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md"
              >
                Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rapport Hebdo Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsReportOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rapport Hebdomadaire</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Saine 02 • Janvier 2026</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficacité</p>
                  <p className="text-3xl font-black text-slate-900">84%</p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[84%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tâches Finies</p>
                  <p className="text-3xl font-black text-slate-900">{myTasks.filter(t => t.status === 'COMPLETED').length}</p>
                  <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% vs semaine dernière
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">Progression par Projet</h3>
                <div className="space-y-4">
                  {globalStats.slice(0, 3).map(stat => (
                    <div key={stat.taskId} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-700">{stat.designation}</span>
                          <span className="text-xs font-black text-indigo-600">{Math.round(stat.progressPercentage)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stat.progressPercentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter PDF
                </button>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black text-sm transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Modal */}
      {isDocOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDocOpen(false)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="flex flex-col md:flex-row h-[600px]">
              <div className="w-full md:w-1/3 bg-indigo-600 p-8 text-white">
                <div className="flex items-center gap-2 mb-10">
                  <BookOpen className="w-6 h-6" />
                  <span className="font-black tracking-tighter text-xl">GUIDE PRO</span>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <Zap className="w-5 h-5 text-indigo-300 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Démarrage Rapide</p>
                  </div>
                  <div className="p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                    <Shield className="w-5 h-5 text-indigo-300 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Sécurité & Rôles</p>
                  </div>
                  <div className="p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                    <Star className="w-5 h-5 text-indigo-300 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Astuces Avancées</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3 p-10 flex flex-col">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setIsDocOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Bienvenue sur TaskManager</h2>
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">1. Gérer vos tâches</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        Utilisez le tableau de bord pour voir vos missions assignées. Cliquez sur l'icône d'édition pour mettre à jour vos dates de début, de fin et l'état d'avancement.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">2. Rôles & Permissions</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        Les <span className="text-slate-900 font-bold">Managers</span> peuvent créer des tâches et gérer les utilisateurs. Les <span className="text-slate-900 font-bold">Utilisateurs</span> se concentrent sur l'exécution des missions qui leur sont attribuées.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">3. Rapports & Suivi</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        Le rapport hebdomadaire vous donne une vue d'ensemble de votre efficacité. Les notifications vous alertent en temps réel de tout changement important.
                      </p>
                    </section>
                  </div>
                </div>
                <div className="pt-8 mt-auto border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Version 2.4.0 Documentation</p>
                  <button 
                    onClick={() => setIsDocOpen(false)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    J'ai compris
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
