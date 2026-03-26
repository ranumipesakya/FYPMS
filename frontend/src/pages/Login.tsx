import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, ChevronRight, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a] font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
      
      <div className="w-full max-w-lg px-6 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-brand-blue/20 rounded-3xl mb-6 shadow-2xl border border-white/5 group hover:rotate-12 transition-transform duration-500">
            <GraduationCap className="text-brand-blue w-12 h-12" />
          </div>
          <h1 className="text-5xl font-extrabold font-outfit text-white mb-2 tracking-tight">University <span className="text-brand-green">FYPMS</span></h1>
          <p className="text-slate-400 font-medium">Final Year Project Management System</p>
        </div>

        <div className="glass p-10 rounded-[40px] border border-white/10 shadow-2xl relative">
          <div className="absolute -top-10 left-12 bg-brand-blue text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border border-white/10">
            Secure Access
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
               <AlertCircle size={20} />
               <span className="text-sm font-bold">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">E-Mail Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      required
                      placeholder="student@nsbm.ac.lk"
                      className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-bold ml-1 uppercase">
                    <Check size={10} className="text-brand-green" />
                    University Email Required
                   </p>
               </div>

               <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
               <label className="flex items-center gap-2 text-slate-400 font-bold cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-brand-blue transition-all" />
                  Remember me
               </label>
               <a href="#" className="text-brand-blue font-black hover:text-white transition-colors uppercase tracking-widest">Forgot Access?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white py-4 rounded-2xl font-black text-lg shadow-2xl shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
                  Authenticate
                  <ChevronRight size={22} className="ml-auto opacity-50" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/10">
            <p className="text-slate-400 text-sm font-medium">New student to the portal?</p>
            <Link to="/register" className="inline-block mt-3 text-brand-green font-bold text-lg hover:underline underline-offset-8 transition-all">
              Initialize Enrollment Profile
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-12 text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">
           &copy; 2026 National School of Business Management (NSBM)
        </p>
      </div>
    </div>
  );
};

export default Login;
