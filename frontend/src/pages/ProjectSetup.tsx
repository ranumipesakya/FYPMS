import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import {
  User as UserIcon,
  Hash,
  Briefcase,
  Users,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Supervisor = {
  _id: string;
  name: string;
};

const ProjectSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupervisorLoading, setIsSupervisorLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentNumber: '',
    projectTitle: '',
    description: '',
    supervisorId: ''
  });

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/auth/supervisors', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setSupervisors(data);
      } catch (error: any) {
        console.error('Error fetching supervisors:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to initialize academic registry');
      } finally {
        setIsSupervisorLoading(false);
      }
    };

    if (user?.token) {
      fetchSupervisors();
    }
  }, [user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        title: formData.projectTitle,
        description: formData.description,
        supervisorId: formData.supervisorId,
        studentNumber: formData.studentNumber
      };

      const { data } = await axios.post('http://localhost:5001/api/projects', payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      alert(data.message || 'Project initialized successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Project creation failed:', error);
      setErrorMessage(error.response?.data?.message || 'Academic profile initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center pt-28 pb-20 px-6 font-inter overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 bg-brand-blue/10 rounded-3xl mb-6 shadow-xl border border-brand-blue/20">
            <Sparkles className="text-brand-blue w-10 h-10 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black font-outfit text-white mb-6 tracking-tighter leading-tight">
            Initialize Your <span className="text-brand-blue italic">Academic Legacy</span>
          </h1>

          <p className="text-slate-400 font-medium max-w-xl mx-auto leading-relaxed text-lg">
            Configure your research profile and connect with the faculty leadership to begin your final year journey.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-14 rounded-[var(--radius-card)] border-white/5 shadow-3xl relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[100px] -z-10"></div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-5 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">
                Candidate Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  readOnly
                  className="block w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 font-bold cursor-not-allowed opacity-60"
                  value={formData.name}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">
                Registry Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                  <Hash size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., IT21234567"
                  className="block w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 transition-all font-bold hover:bg-white/10"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">
                Proposed Project Title
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                  <Briefcase size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., Designing Scalable Neural Architectures for FinTech"
                  className="block w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 transition-all font-bold hover:bg-white/10"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">
                Project Abstract
              </label>
              <div className="relative group">
                <textarea
                  required
                  placeholder="Provide a high-level summary of your research objectives..."
                  rows={4}
                  className="block w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 transition-all font-bold hover:bg-white/10 resize-none h-32"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">
                Nominated Academic Lead
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors z-20">
                  <Users size={18} />
                </div>

                <select
                  required
                  disabled={isSupervisorLoading}
                  className="block w-full pl-14 pr-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-brand-blue/50 transition-all font-bold appearance-none cursor-pointer relative z-10 hover:bg-white/10"
                  value={formData.supervisorId}
                  onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                >
                  <option value="" className="bg-[#0f172a] text-slate-500">
                    {isSupervisorLoading ? 'Registry Syncing...' : 'Select your supervisor...'}
                  </option>

                  {supervisors.map((supervisor) => (
                    <option
                      key={supervisor._id}
                      value={supervisor._id}
                      className="bg-[#0f172a] text-white py-2"
                    >
                      {supervisor.name}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-brand-blue transition-transform group-hover:translate-x-1">
                   <ChevronRight size={20} className="rotate-90 opacity-50" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-10">
              <button
                type="submit"
                disabled={isLoading || isSupervisorLoading}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-brand-blue/20 flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] disabled:opacity-50 group grow-glow"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Initialize Academic Registry
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <footer className="text-center mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
             Faculty of Computing Registry &copy; 2026
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectSetup;