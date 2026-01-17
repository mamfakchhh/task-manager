import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ClipboardList,
  ChevronDown,
  User as UserIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  BookOpen,
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, userTasksWithDetails } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isContactOpen, setIsContactOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Tableau de bord",
      icon: LayoutDashboard,
      path: "/",
      roles: ["USER", "MANAGER"],
    },
    {
      label: "Gestion des Tâches",
      icon: ClipboardList,
      path: "/tasks",
      roles: ["MANAGER"],
    },
    { label: "Utilisateurs", icon: Users, path: "/users", roles: ["MANAGER"] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentUser.role),
  );

  const isActive = (path: string) => location.pathname === path;

  // Mock notifications based on recent activities
  const notifications = userTasksWithDetails.slice(0, 5).map((task) => ({
    id: task.id,
    title: task.taskDesignation,
    description: `${task.username} a mis à jour le statut en ${task.status === "COMPLETED" ? "Terminé" : task.status === "IN_PROGRESS" ? "En cours" : "À faire"}`,
    time: new Date(task.updatedAt).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: task.status,
  }));

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      {/* Top Banner / Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/mcc-logo.svg"
              alt="MCC"
              className="h-10 transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none">
                MCC
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">
                Professional
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${isActive(item.path) ? "text-indigo-600" : "text-slate-400"}`}
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar - Desktop */}
          <div className="hidden xl:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded-full transition-all relative group ${isNotificationsOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsNotificationsOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h3>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">
                      {notifications.length} Nouvelles
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                notif.status === "COMPLETED"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : notif.status === "IN_PROGRESS"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {notif.status === "COMPLETED" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : notif.status === "IN_PROGRESS" ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {notif.description}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Aucune notification
                        </p>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 transition-colors">
                    Tout marquer comme lu
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 leading-none">
                  {currentUser.username}
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${currentUser.role === "MANAGER" ? "bg-amber-400" : "bg-emerald-400"}`}
                  ></span>
                  {currentUser.role}
                </span>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                {currentUser.username[0].toUpperCase()}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Compte
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate mt-1">
                      {currentUser.username}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Mon Profil
                  </button>

                  <div className="h-px bg-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-slate-200 py-4 px-6 flex flex-col gap-2 shadow-xl z-50 animate-in slide-in-from-top duration-300">
            <div className="mb-4 xl:hidden flex items-center bg-slate-100 rounded-xl px-4 py-3 gap-2 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none focus:ring-0 text-base w-full outline-none"
              />
            </div>

            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold transition-all ${
                  isActive(item.path)
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
            <ClipboardList className="text-slate-400 w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-indigo-600 tracking-tight">
            MCC TASK MANAGER
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} - Version 2.4.0 Production Ready
        </p>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Aide
          </button>
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Support
          </button>
        </div>
      </footer>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
            <div className="h-32 bg-indigo-600 relative">
              <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl">
                <div className="w-24 h-24 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-3xl font-black text-indigo-600 border-4 border-white shadow-lg">
                  {currentUser.username[0].toUpperCase()}
                </div>
              </div>
            </div>
            <div className="pt-16 p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {currentUser.username}
                  </h2>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {currentUser.role}
                  </p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Email Professionnel
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {currentUser.username.toLowerCase()}@taskmanager.pro
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Téléphone
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      +33 01 23 45 67 89
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Localisation
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Paris, France (HQ)
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Modifier les informations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsContactOpen(false)}
          ></div>
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    Centre de Support
                  </h2>
                </div>
                <button
                  onClick={() => setIsContactOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Besoin d'aide ? Notre équipe technique est disponible du lundi
                  au vendredi de 9h à 18h pour vous accompagner.
                </p>

                <div className="space-y-3">
                  <a
                    href="mailto:support@taskmanager.pro"
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      <span className="text-sm font-bold text-slate-900">
                        support@taskmanager.pro
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90" />
                  </a>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-900">
                        Temps de réponse : &lt; 2h
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsContactOpen(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Ouvrir un ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
