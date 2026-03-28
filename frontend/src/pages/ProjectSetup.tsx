import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import {
  User as UserIcon,
  Hash,
  Briefcase,
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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
        const response = await fetch('http://localhost:5001/api/auth/supervisors', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setSupervisors(data);
        } else {
          setErrorMessage(data.message || 'Failed to load supervisors');
        }
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        setErrorMessage('Failed to load supervisors');
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

      console.log("Sending project data:", payload);

      const response = await fetch('http://localhost:5001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Project created successfully');
        navigate('/dashboard');
      } else {
        console.error('Failed to create project:', data.message);
        setErrorMessage(data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong while creating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center pt-28 pb-20 px-6 font-inter">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-blue/20 to-transparent"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex p-3 bg-brand-green/20 rounded-2xl mb-4 border border-brand-green/20 shadow-xl">
            <Sparkles className="text-brand-green w-8 h-8" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-white mb-4 tracking-tight">
            Initialize Your <span className="text-brand-blue italic">Final Year Journey</span>
          </h1>

          <p className="text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            Provide your details to set up your project profile and connect with your chosen supervisor.
          </p>
        </div>

        <div className="glass p-8 md:p-12 rounded-[50px] border border-white/5 shadow-2zl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[100px] -z-10"></div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                Student Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  readOnly
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 font-bold cursor-not-allowed"
                  value={formData.name}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                Student Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                  <Hash size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., IT12345678"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-bold"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                Project Title
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
                  <Briefcase size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g., Revolutionizing E-Learning with AR and AI"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-bold"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                Project Description
              </label>
              <div className="relative group">
                <textarea
                  required
                  placeholder="Describe your project proposal..."
                  rows={4}
                  className="block w-full pl-4 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all group-hover:bg-white/10 font-bold resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                Assigned Supervisor
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors z-20">
                  <Users size={18} />
                </div>

                <select
                  required
                  disabled={isSupervisorLoading}
                  className="block w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all hover:bg-white/10 font-bold appearance-none cursor-pointer relative z-10"
                  value={formData.supervisorId}
                  onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                >
                  <option value="" className="bg-[#0f172a] text-slate-500">
                    {isSupervisorLoading ? 'Loading supervisors...' : 'Select your supervisor...'}
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

                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-brand-blue transition-transform group-hover:translate-x-1">
                  <ChevronRight size={20} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={isLoading || isSupervisorLoading}
                className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Initialize Project Profile
                    <Sparkles size={22} className="ml-2 animate-pulse" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            &copy; NSBM Green University - Faculty of Computing 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;