import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, ChevronRight, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Incorrect credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-inter">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-blue/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="w-full max-w-5xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 py-12">
        {/* Branding Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 text-center lg:text-left space-y-8"
        >
          <div className="inline-flex p-5 bg-brand-blue/20 rounded-[2rem] shadow-2xl border border-white/10 mb-2 animate-float">
            <GraduationCap className="text-brand-blue w-16 h-16" />
          </div>
          <div>
            <h1 className="text-6xl lg:text-7xl font-black font-outfit text-white leading-tight tracking-tighter">
              Academic <br />
              <span className="text-brand-blue italic">Registry</span> <span className="text-white">Portal</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Welcome to the official NSBM Final Year Project Management System. Authenticate to manage your academic milestones and research projects.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
             </div>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                Trusted by <span className="text-white font-black">2000+</span> Students
             </p>
          </div>
        </motion.div>

        {/* Login Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="glass p-10 rounded-[40px] border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-blue"></div>
            
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white font-outfit mb-2">Secure Login</h2>
              <p className="text-slate-500 text-sm font-medium">Please enter your university credentials</p>
            </div>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3"
                >
                   <AlertCircle size={20} className="shrink-0" />
                   <span className="text-sm font-bold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block ml-1">E-Mail Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-brand-blue transition-colors">
                        <Mail size={20} />
                      </div>
                      <input 
                        type="email" 
                        required
                        placeholder="student@nsbm.ac.lk"
                        className="block w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-bold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3 ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Authorized Domains Only</span>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Password</label>
                      <button type="button" className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-white transition-colors">Reset Account</button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-brand-blue transition-colors">
                        <Lock size={20} />
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="block w-full pl-14 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-bold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                 <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-brand-blue cursor-pointer" />
                 <label htmlFor="remember" className="text-xs text-slate-500 font-bold cursor-pointer hover:text-slate-300 transition-colors">Keep me authenticated</label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-brand-blue/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4 group/btn"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <LogIn size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                    Secure Access
                    <ChevronRight size={22} className="ml-auto opacity-30 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">First time here?</p>
              <Link to="/register" className="inline-flex items-center gap-2 text-brand-green font-black text-lg hover:text-white transition-all group/link">
                <Sparkles size={20} className="group-hover/link:rotate-12 transition-transform" />
                Initialize Profile
              </Link>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
             &copy; 2026 NSBM GREEN UNIVERSITY
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
