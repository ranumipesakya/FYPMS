import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Showcase from './pages/Showcase';
import ProjectSetup from './pages/ProjectSetup';
import Register from './pages/Register';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Meetings from './pages/Meetings';
import Chat from './pages/Chat';
import Projects from './pages/Projects';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/project-setup" element={
          <ProtectedRoute>
            <ProjectSetup />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : 
             user?.role === 'supervisor' ? <SupervisorDashboard /> : 
             <Dashboard />}
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="/meetings" element={
          <ProtectedRoute>
            <Meetings />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/:edit" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#0f172a] selection:bg-brand-blue selection:text-white">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
