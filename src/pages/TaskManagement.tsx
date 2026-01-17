import React, { useState, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { 
  Plus, 
  Search, 
  Trash2, 
  ClipboardList, 
  UserPlus, 
  AlertCircle,
  X,
  ArrowRight,
  Filter,
  CheckCircle2,
  Users as UsersIcon,
  ChevronRight
} from 'lucide-react';

export default function TaskManagement() {
  const { 
    tasks, 
    users, 
    userTasksWithDetails, 
    createTask, 
    deleteTask, 
    assignTask, 
    currentUser 
  } = useTaskContext();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskDesignation, setTaskDesignation] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const taskInputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = tasks.filter(task => 
    task.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDesignation.trim()) {
      createTask(taskDesignation.trim());
      setTaskDesignation('');
      setIsTaskModalOpen(false);
    }
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTaskId && selectedUserId) {
      assignTask(selectedTaskId, selectedUserId);
      setIsAssignModalOpen(false);
      setSelectedTaskId('');
      setSelectedUserId('');
    }
  };

  if (currentUser?.role !== 'MANAGER') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 opacity-20" />
        </div>
        <p className="text-2xl font-black tracking-tight text-slate-900">Accès Restreint</p>
        <p className="mt-2 font-medium">Seuls les gestionnaires peuvent accéder à cette section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-2xl">
            🛠️
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Tâches</h1>
            <p className="text-slate-500 mt-1 font-medium">Configurez les types de missions et gérez les attributions.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all shadow-sm hover:bg-slate-50 active:scale-95 text-sm"
          >
            <UserPlus className="w-4 h-4 text-indigo-600" />
            Attribuer
          </button>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Task Catalogue */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                  <Filter className="w-4 h-4 text-indigo-500" />
                  Catalogue
                </h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{tasks.length} TYPES</span>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un type..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-bold italic">Aucun résultat trouvé.</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div key={task.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform group-hover:shadow-md group-hover:border-indigo-100">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-700 group-hover:text-slate-900 transition-colors">{task.designation}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (window.confirm('Supprimer ce type de tâche ? Cela supprimera toutes les assignations liées.')) {
                            deleteTask(task.id);
                          }
                        }}
                        className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Assignments Track */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Suivi des Attributions</h2>
                  <p className="text-xs text-slate-400 font-medium">Visualisez qui travaille sur quoi en temps réel</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                {userTasksWithDetails.length} ACTIVES
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Collaborateur</th>
                    <th className="px-8 py-5">Mission Assignée</th>
                    <th className="px-8 py-5">Statut</th>
                    <th className="px-8 py-5 text-right">Dernière MAJ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {userTasksWithDetails.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-10 h-10 text-slate-200" />
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-lg">Aucune attribution</p>
                            <p className="text-slate-400 font-medium text-sm mt-1">Commencez par assigner une tâche à un collaborateur.</p>
                          </div>
                          <button 
                            onClick={() => setIsAssignModalOpen(true)}
                            className="mt-2 text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2"
                          >
                            Assigner maintenant <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    userTasksWithDetails.map(ut => (
                      <tr key={ut.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xs font-black text-indigo-700 border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                              {ut.username[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{ut.username}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Collaborateur</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{ut.taskDesignation}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full shadow-sm ${
                              ut.status === 'COMPLETED' ? 'bg-emerald-500' : 
                              ut.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-300'
                            }`}></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ut.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-[11px] font-bold text-slate-400 tabular-nums bg-slate-50 px-2 py-1 rounded-md">
                            {new Date(ut.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Nouveau Type</h3>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-10 space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Désignation de la Mission</label>
                <input 
                  ref={taskInputRef}
                  type="text" 
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="ex: Maintenance des Systèmes"
                  value={taskDesignation}
                  onChange={e => setTaskDesignation(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Attribuer</h3>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAssignTask} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sélectionner la Tâche</label>
                  <div className="relative">
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      value={selectedTaskId}
                      onChange={e => setSelectedTaskId(e.target.value)}
                      required
                    >
                      <option value="">— Choisir un type —</option>
                      {tasks.map(t => (
                        <option key={t.id} value={t.id}>{t.designation}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sélectionner le Collaborateur</label>
                  <div className="relative">
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      required
                    >
                      <option value="">— Choisir un agent —</option>
                      {users.filter(u => u.role === 'USER').map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                  Assigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
