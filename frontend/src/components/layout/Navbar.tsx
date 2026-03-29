import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Calendar, 
  FolderKanban,
  User,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
              <div className="flex flex-col items-end opacity-60">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{user.name}</span>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{user.role}</span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 pl-3 pr-2 py-1.5 border rounded-2xl transition-all ${
                    isProfileOpen ? 'bg-brand-blue/10 border-brand-blue/50 text-white shadow-lg shadow-brand-blue/10' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <User size={16} />
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-3 w-72 glass rounded-[2.5rem] p-4 border-white/10 shadow-3xl z-50 overflow-hidden"
                      >
                         {/* Part 1: User Info Header */}
                         <div className="px-5 py-5 mb-3 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group/header">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/header:opacity-10 transition-opacity">
                                <GraduationCap size={64} />
                            </div>
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                               <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                                  <User size={24} />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-white text-xs font-black uppercase tracking-wider leading-none">{user.name}</span>
                                  <span className="text-brand-blue text-[9px] font-black uppercase tracking-[0.2em] mt-2 block bg-brand-blue/10 w-fit px-2 py-0.5 rounded-full">{user.role}</span>
                               </div>
                            </div>
                            <div className="pt-3 border-t border-white/5 relative z-10">
                               <span className="text-slate-400 text-[9px] font-bold truncate block tracking-wider uppercase opacity-80">{user.email}</span>
                            </div>
                         </div>

                         {/* Part 2: Quick Actions */}
                         <div className="space-y-1 mb-3">
                           <Link 
                              to="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent hover:border-white/5"
                           >
                              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/20 group-hover:text-brand-blue transition-all">
                                <User size={14} />
                              </div>
                              View Profile
                           </Link>
                           <Link 
                              to="/profile/edit"
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent hover:border-white/5"
                           >
                              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/20 group-hover:text-brand-blue transition-all">
                                <User size={14} className="opacity-50" />
                              </div>
                              Edit Profile
                           </Link>
                         </div>

                         {/* Part 3: Session Management */}
                         <div className="pt-2 border-t border-white/5">
                           <button 
                              onClick={() => {
                                setIsProfileOpen(false);
                                handleLogout();
                              }}
                              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent hover:border-red-500/10"
                           >
                              <div className="w-8 h-8 rounded-xl bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                <LogOut size={14} />
                              </div>
                              Logout Session
                           </button>
                         </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
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
