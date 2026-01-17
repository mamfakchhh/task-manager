import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  UserPlus2,
  ChevronRight
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export default function UserManagement() {
  const { users, addUser, deleteUser, currentUser } = useTaskContext();
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    addUser(newUser.username, newUser.password);
    setNewUser({ username: '', password: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (currentUser?.role !== 'MANAGER') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 opacity-20" />
        </div>
        <p className="text-2xl font-black tracking-tight text-slate-900">Accès Restreint</p>
        <p className="mt-2 font-medium">Seuls les gestionnaires peuvent gérer les utilisateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-2xl">
            👥
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Équipes</h1>
            <p className="text-slate-500 mt-1 font-medium">Contrôlez les accès et gérez les comptes des collaborateurs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 -mr-4 -mt-4 transition-transform group-hover:rotate-12">
              <UserPlus2 className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Nouveau Compte</h3>
              </div>
              
              <form onSubmit={handleAddUser} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Identifiant</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ex: j.dupont"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      value={newUser.username}
                      onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Mot de passe</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95">
                  Créer l'accès
                </button>
              </form>

              {showSuccess && (
                <div className="mt-6 flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-4 duration-300 border border-emerald-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Compte créé avec succès !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Répertoire des Comptes</h3>
                  <p className="text-xs text-slate-400 font-medium">Liste exhaustive des accès configurés</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                {users.length} Utilisateurs
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50">
                {users.map(u => (
                  <div key={u.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3 ${
                        u.role === 'MANAGER' 
                          ? 'bg-slate-900 text-white shadow-slate-200 shadow-lg' 
                          : 'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {u.role === 'MANAGER' ? <ShieldCheck className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <p className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors leading-none">{u.username}</p>
                          {u.id === currentUser.id && (
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-100">
                              Moi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            u.role === 'MANAGER' 
                              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {u.role}
                          </span>
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1 italic">
                            Accès actif <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {u.role !== 'MANAGER' ? (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Supprimer l'utilisateur ${u.username} ?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="p-3 text-slate-100">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <AlertCircle className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Seul un Manager peut réinitialiser les mots de passe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
