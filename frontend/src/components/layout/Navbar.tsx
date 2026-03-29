import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Calendar, 
  FolderKanban,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/projects', label: 'Projects', icon: <FolderKanban size={18} /> },
    { path: '/meetings', label: 'Meetings', icon: <Calendar size={18} /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={18} />, badge: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass border-b border-white/5 shadow-2xl px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-4 group">
        <div className="bg-brand-blue p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-brand-blue/20">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black font-outfit text-white tracking-tighter leading-none">
            NSBM <span className="text-brand-blue">FYPMS</span>
          </span>
          <span className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-black mt-1">Registry Portal</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {user ? (
          <>
            <div className="flex items-center gap-2 mr-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all group relative ${
                    location.pathname === link.path ? 'text-brand-blue bg-brand-blue/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green absolute top-1 right-1"></span>
                  )}
                  {location.pathname === link.path && (
                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-blue rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            <div className="w-px h-6 bg-white/10 mx-2"></div>

            <div className="flex items-center gap-4 pl-4">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{user.name}</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{user.role}</span>
              </div>
              <div className="relative group/user">
                <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <User size={18} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 glass rounded-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all border-white/10 shadow-3xl">
                   <Link 
                      to="/profile"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest border-b border-white/5 mb-1"
                   >
                      <User size={14} />
                      View Profile
                   </Link>
                   <Link 
                      to="/profile/edit"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest border-b border-white/5 mb-2"
                   >
                      <User size={14} className="opacity-50" />
                      Edit Profile
                   </Link>
                   <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
                   >
                      <LogOut size={14} />
                      Logout Session
                   </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-brand-blue/20">
            Authenticate
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
