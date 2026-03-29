import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Sparkles,
  Loader2,
  ChevronRight,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5001/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      });
      
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center bg-[#020617] font-inter relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-green/5 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block space-y-10"
        >
           <div className="inline-flex p-5 bg-brand-blue/20 rounded-[2rem] shadow-2xl border border-white/10 animate-float">
              <GraduationCap className="text-brand-blue w-16 h-16" />
           </div>
           <div>
              <h1 className="text-7xl font-black font-outfit text-white leading-[1.1] tracking-tighter">
                Initialize Your <br />
                <span className="text-brand-blue italic">Academic</span> <br />
                Journey.
              </h1>
              <p className="mt-8 text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
                Connect with world-class mentors, manage your research milestones, and accelerate your final year projects through our integrated portal.
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="glass p-8 rounded-[var(--radius-card)] border-white/5 group hover:border-brand-blue/30 transition-all">
                 <h4 className="text-white font-black text-3xl mb-1 tracking-tighter">2,000+</h4>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Students</p>
              </div>
              <div className="glass p-8 rounded-[var(--radius-card)] border-white/5 group hover:border-brand-green/30 transition-all">
                 <h4 className="text-white font-black text-3xl mb-1 tracking-tighter">50+</h4>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Faculty Mentors</p>
              </div>
           </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-14 rounded-[3rem] border-white/10 shadow-3xl relative overflow-hidden group"
        >
           <div className="absolute top-0 left-0 w-2 h-full bg-brand-green"></div>
           
           <div className="mb-12">
              <h2 className="text-4xl font-black text-white font-outfit mb-3 tracking-tight">Institutional Enrollment</h2>
              <p className="text-slate-500 font-bold text-sm">Create your secure identity for the NSBM FYPMS portal.</p>
           </div>

           <AnimatePresence mode="wait">
             {error && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3"
               >
                  <ShieldAlert size={20} className="shrink-0" />
                  <span className="text-sm font-bold">{error}</span>
               </motion.div>
             )}
           </AnimatePresence>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                 {/* Name */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Display Name</label>
                    <div className="relative group">
                       <UserIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" />
                       <input 
                         type="text" required placeholder="Full Name"
                         className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 focus:border-brand-blue transition-all"
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* Email */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">University Identity</label>
                      <Sparkles size={14} className="text-brand-blue animate-pulse" />
                    </div>
                    <div className="relative group">
                       <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" />
                       <input 
                         type="email" required 
                         placeholder="student@nsbm.ac.lk"
                         className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 focus:border-brand-blue transition-all"
                         value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Password */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Authentication Key</label>
                    <div className="relative group">
                       <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" />
                       <input 
                         type="password" required minLength={8} placeholder="8+ chars"
                         className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 focus:border-brand-blue transition-all"
                         value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* Confirm Password */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Verify Key</label>
                    <div className="relative group">
                       <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" />
                       <input 
                         type="password" required minLength={8} placeholder="••••••••"
                         className="w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 focus:border-brand-blue transition-all"
                         value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={isLoading}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-brand-blue/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 group/btn"
              >
                {isLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <>
                    Establish Portal Account 
                    <ChevronRight size={22} className="ml-auto opacity-30 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </>
                )}
              </motion.button>
           </form>

           <div className="mt-12 text-center pt-8 border-t border-white/5">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-loose">
                 Already a registered member? <br />
                 <Link to="/login" className="text-brand-green font-black text-lg hover:underline underline-offset-8 transition-all">Sign In Session</Link>
              </p>
           </div>
        </motion.div>
      </div>
      
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-700 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 whitespace-nowrap">
         Faculty of Computing | NSBM Green University
      </p>
    </div>
  );
};

export default Register;
