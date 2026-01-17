import { Routes, Route, Navigate } from 'react-router-dom';
import { useTaskContext } from './context/TaskContext';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TaskManagement from './pages/TaskManagement';
import { CheckSquare } from 'lucide-react';

export default function App() {
  const { currentUser, isInitialized } = useTaskContext();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="animate-bounce mb-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckSquare className="text-white w-10 h-10" />
          </div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Chargement de l'application...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          currentUser ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/users"
        element={
          currentUser?.role === 'MANAGER' ? (
            <Layout>
              <UserManagement />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/tasks"
        element={
          currentUser?.role === 'MANAGER' ? (
            <Layout>
              <TaskManagement />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
