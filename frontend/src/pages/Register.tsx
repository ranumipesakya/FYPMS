import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  Sparkles,
  UserCircle 
} from 'lucide-react';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'supervisor' | 'admin',
    department: 'Computing'
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
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department
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
    <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center bg-[#0f172a] font-inter relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Branding */}
        <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left duration-700">
           <div className="inline-flex p-3 bg-brand-blue/20 rounded-2xl shadow-xl border border-white/5">
              <Sparkles className="text-brand-blue w-12 h-12" />
           </div>
           <h1 className="text-7xl font-black font-outfit text-white leading-tight tracking-tighter">
             Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-teal-400">Future</span> of University Research.
           </h1>
           <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
             Access exclusive tools for project management, AI-driven report analysis, and direct collaboration with top NSBM supervisors.
           </p>
           
           <div className="flex gap-4 pt-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-1 text-center">
                 <h4 className="text-white font-black text-2xl mb-1">2,000+</h4>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Students</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-1 text-center">
                 <h4 className="text-white font-black text-2xl mb-1">50+</h4>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Expert Supervisors</p>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass p-8 md:p-12 rounded-[60px] border border-white/10 shadow-3xl relative overflow-hidden animate-in fade-in slide-in-from-right duration-700">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-green"></div>
           
           <div className="mb-10 text-center">
              <h2 className="text-4xl font-black text-white font-outfit mb-3">Initialize Profile</h2>
              <p className="text-slate-500 font-bold text-sm tracking-wide">Enter your details to register as part of the faculty portal.</p>
           </div>

           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
                <ShieldCheck size={20} />
                <span className="text-sm font-bold">{error}</span>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Name */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">Full Name</label>
                    <div className="relative group">
                       <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                       <input 
                         type="text" required placeholder="John Doe"
                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2"
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* Role Selection */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">Portal Access Role</label>
                    <div className="relative group">
                       <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                       <select 
                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 appearance-none cursor-pointer"
                         value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}
                       >
                          <option value="student" className="bg-[#0f172a]">Student</option>
                          <option value="supervisor" className="bg-[#0f172a]">Supervisor</option>
                          <option value="admin" className="bg-[#0f172a]">Admin</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">University Email</label>
                 <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                    <input 
                      type="email" required placeholder="student@nsbm.ac.lk"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">Faculty / Department</label>
                 <div className="relative group">
                    <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                    <select 
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2 appearance-none cursor-pointer"
                      value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    >
                       <option value="Computing" className="bg-[#0f172a]">Faculty of Computing</option>
                       <option value="Business" className="bg-[#0f172a]">Faculty of Business</option>
                       <option value="Engineering" className="bg-[#0f172a]">Faculty of Engineering</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Password */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">Password</label>
                    <div className="relative group">
                       <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                       <input 
                         type="password" required placeholder="••••••••"
                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2"
                         value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* Confirm Password */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] ml-2">Confirm Key</label>
                    <div className="relative group">
                       <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue" />
                       <input 
                         type="password" required placeholder="••••••••"
                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none ring-brand-blue/50 focus:ring-2"
                         value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue py-5 rounded-2xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Create Portal Account <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="mt-8 text-center text-slate-500 text-sm font-bold">
              Already have an account? <Link to="/login" className="text-brand-blue hover:underline">Sign In</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
