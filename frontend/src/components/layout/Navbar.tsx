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
  ChevronDown,
  FileText,
  Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/projects', label: 'Projects', icon: <FolderKanban size={18} /> },
    { path: '/submissions', label: 'Submissions', icon: <FileText size={18} /> },
    { path: '/meetings', label: 'Meetings', icon: <Calendar size={18} /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={18} />, badge: true },
    { path: '/archive', label: 'Archive', icon: <Library size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl px-6 md:px-12 flex items-center justify-between">
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

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 mr-6 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all relative ${
                    location.pathname === link.path ? 'text-brand-blue bg-white shadow-xl shadow-black/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={location.pathname === link.path ? 'text-brand-blue' : 'text-slate-500 group-hover:text-white'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-blue rounded-full border-2 border-[#020617]" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
               <div className="relative">
                 <button 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className={`flex items-center gap-3 pl-3 pr-2 py-1.5 border rounded-[1.25rem] transition-all ${
                     isProfileOpen ? 'bg-brand-blue/10 border-brand-blue/30 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                   }`}
                 >
                   <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white shadow-lg overflow-hidden border border-white/20">
                     {user.avatar ? (
                         <img src={`http://localhost:5001${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                         <User size={16} />
                     )}
                   </div>
                   <div className="hidden sm:flex flex-col items-start mr-2">
                     <span className="text-[10px] font-black text-white uppercase tracking-wider leading-none text-left">{user.name.split(' ')[0]}</span>
                     <span className="text-[8px] text-brand-blue font-black uppercase tracking-widest mt-1 opacity-80">{user.role}</span>
                   </div>
                   <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {isProfileOpen && (
                     <>
                       <div 
                         className="fixed inset-0 z-40" 
                         onClick={() => setIsProfileOpen(false)}
                       />
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute top-full right-0 mt-3 w-80 bg-[#0F172A] rounded-[2.5rem] p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                       >
                         {/* Part 1: User Info Header */}
                         <div className="px-5 py-6 mb-4 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group/header">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/header:opacity-[0.05] transition-opacity">
                                <GraduationCap size={72} />
                            </div>
                            <div className="flex items-center gap-4 mb-5 relative z-10">
                               <div className="w-14 h-14 rounded-2xl bg-brand-blue/30 flex items-center justify-center text-brand-blue border border-brand-blue/30 overflow-hidden shadow-inner">
                                  {user.avatar ? (
                                      <img src={`http://localhost:5001${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <User size={30} />
                                  )}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-white text-[13px] font-black uppercase tracking-wider leading-none">{user.name}</span>
                                  <span className="text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] mt-3 block bg-brand-blue/10 w-fit px-3 py-1 rounded-full shadow-lg">{user.role}</span>
                               </div>
                            </div>
                            <div className="pt-4 border-t border-white/10 relative z-10">
                               <span className="text-slate-400 text-[10px] font-medium truncate block tracking-wider uppercase opacity-90">{user.email}</span>
                            </div>
                         </div>

                         {/* Part 2: Quick Navigation */}
                         <div className="space-y-1 mb-4">
                            <Link 
                               to="/profile" 
                               onClick={() => setIsProfileOpen(false)}
                               className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent ${
                                 location.pathname === '/profile' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                               }`}
                            >
                               <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/20 transition-all">
                                 <User size={14} className="opacity-50" />
                               </div>
                               View profile
                            </Link>

                            <Link 
                               to="/profile/edit" 
                               onClick={() => setIsProfileOpen(false)}
                               className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest group border border-transparent"
                            >
                               <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue/20 transition-all">
                                 <FileText size={14} className="opacity-50" />
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
          </div>
        ) : (
          <div className="flex items-center gap-4">
             <Link to="/login" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-2.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-brand-blue/20">
               Authenticate
             </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
