import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { 
  FolderKanban, 
  Terminal, 
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectTechnicals from '../components/project/ProjectTechnicals';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [user?.token]);

  const fetchProject = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/projects/student', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProject(data || null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-blue bg-[#020617]">
        <div className="w-12 h-12 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-10"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand-blue/20 rounded-2xl text-brand-blue">
                <FolderKanban size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Project Management Console</span>
            </div>
            <h1 className="text-5xl font-black text-white font-outfit tracking-tighter leading-none mb-4">
              Academic <span className="text-brand-blue italic">Registry</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
              Consolidated view of your final year research and development infrastructure.
            </p>
          </div>

          <div className="glass p-8 rounded-[2rem] min-w-[320px] border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment Status</span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                project?.status === 'approved' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 
                project?.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
              }`}>
                {project?.status || 'No Project'}
              </span>
            </div>
            <div className="flex items-center gap-4 py-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-blue">
                    <Calendar size={18} />
                </div>
                <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tighter italic">Batch 2026/27</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Final Year Thesis</p>
                </div>
            </div>
          </div>
        </motion.div>
      </header>

      {!project ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-20 rounded-[3rem] text-center border-white/5 flex flex-col items-center max-w-3xl mx-auto"
        >
           <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-600 mb-8 shadow-inner">
              <Layers size={48} />
           </div>
           <h2 className="text-3xl font-black text-white mb-4 italic">No Active Project Discovered</h2>
           <p className="text-slate-500 text-sm mb-10 max-w-md">Your academic project profile has not been initialized. Please complete the project setup process to access technical resources.</p>
           <button 
             onClick={() => window.location.href = '/project-setup'}
             className="bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-blue/20 transition-all active:scale-95"
           >
              Initialize Project Setup
           </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-brand-blue/20 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-blue/10 transition-all"></div>
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-brand-blue group-hover:rotate-6 transition-transform shadow-inner">
                        <GraduationCap size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white leading-tight">{project.title}</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Academic Research Manuscript</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Assigned Discipline</span>
                        <p className="text-white font-bold">{project.category || 'Computing & Technology'}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Thesis Type</span>
                        <p className="text-white font-bold">{project.type || 'Standard Honors Research'}</p>
                    </div>
                </div>
            </section>

            <section className="glass p-10 rounded-[3rem] border-white/5">
                <ProjectTechnicals project={project} user={user} onUpdate={fetchProject} />
            </section>
          </div>

          <aside className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group bg-[#0f172a]/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-blue/20 transition-all"></div>
              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-3xl mb-8 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shadow-inner">
                <Briefcase size={32} />
              </div>
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Academic Supervisor</h4>
              <p className="text-2xl font-black text-white mb-2">{project.supervisorId?.name || 'Pending Designation'}</p>
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Mentorship</span>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button 
                  onClick={() => window.location.href = '/chat'}
                  className="w-full bg-white/5 hover:bg-brand-blue text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-3 group/btn hover:shadow-2xl hover:shadow-brand-blue/30"
                >
                   Secure Channel
                   <Terminal size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 bg-brand-blue/5 border-dashed border-brand-blue/20"
            >
               <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={20} className="text-brand-blue" />
                  <h4 className="text-white font-black text-xs uppercase tracking-widest mt-1">Faculty Protocol</h4>
               </div>
               <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Repository links must be public or shared with your supervisor. Ensure your README contains standard intellectual property statements as per university guidelines.
               </p>
            </motion.div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Projects;
