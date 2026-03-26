import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { GraduationCap, LayoutDashboard, LogOut, MessageSquare, Calendar, FolderKanban } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center h-20">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-brand-blue p-2 rounded-xl">
          <GraduationCap className="text-white w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-outfit text-white tracking-tight">NSBM <span className="text-brand-green">FYPMS</span></span>
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">Project Management Portal</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {user ? (
          <>
            <Link to="/dashboard" className="text-white/70 hover:text-white flex items-center gap-2 transition-all group font-medium">
              <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
              Dashboard
            </Link>
            <Link to="/projects" className="text-white/70 hover:text-white flex items-center gap-2 transition-all group font-medium">
              <FolderKanban size={18} className="group-hover:scale-110 transition-transform" />
              Projects
            </Link>
            <Link to="/meetings" className="text-white/70 hover:text-white flex items-center gap-2 transition-all group font-medium">
              <Calendar size={18} className="group-hover:scale-110 transition-transform" />
              Meetings
            </Link>
            <Link to="/chat" className="text-white/70 hover:text-white flex items-center gap-2 transition-all group font-medium relative">
              <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
              Chat
              <span className="absolute -top-1 -right-2 bg-brand-green w-2 h-2 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="ml-4 bg-white/5 hover:bg-white/10 text-white/90 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-blue/20">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
