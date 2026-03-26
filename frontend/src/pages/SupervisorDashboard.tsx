import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import { 
  Users, 
  CheckCircle2, 
  MessageSquare,
  XCircle,
  FileText,
  Loader2
} from 'lucide-react';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/projects/assigned', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (projectId: string, status: 'approved' | 'rejected') => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/projects/${projectId}/status`, {
        status,
        feedback: feedback[projectId] || ''
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setProjects(prev => prev.map(p => p._id === projectId ? data : p));
      // Clear feedback for this project
      setFeedback(prev => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-3 text-brand-blue">
         <Loader2 className="animate-spin" size={32} />
         <span className="text-xl font-black font-outfit uppercase tracking-tighter">Syncing Academic Registry...</span>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 animate-in fade-in slide-in-from-top duration-700">
        <div>
          <h1 className="text-5xl font-black font-outfit text-white mb-2 tracking-tighter cursor-default">
            Academic <span className="text-brand-blue italic">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Supervisor: <span className="text-white font-bold">{user?.name}</span> • Faculty of Computing</p>
        </div>
        <div className="bg-brand-blue/10 border border-brand-blue/20 px-8 py-4 rounded-[30px] flex items-center gap-6 glass shadow-2xl">
           <div className="text-center border-r border-white/10 pr-6">
              <span className="block text-2xl font-black text-white">{projects.length}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Students</span>
           </div>
           <div className="text-center">
              <span className="block text-2xl font-black text-brand-green">
                {projects.filter(p => p.status === 'pending').length}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <div key={project._id} className="glass p-8 rounded-[50px] border border-white/5 hover:border-brand-blue/30 transition-all group relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-all -z-10"></div>
             
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                   <Users size={24} />
                </div>
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${project.status === 'approved' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : project.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'}`}>
                   {project.status}
                </div>
             </div>

             <h3 className="text-2xl font-black text-white mb-1 leading-tight font-outfit">{project.studentId?.name || "Anonymous Student"}</h3>
             <p className="text-slate-500 text-xs font-bold mb-4 uppercase tracking-[0.2em]">{project.studentId?.studentNumber || "N/A"}</p>
             
             <div className="bg-white/5 p-4 rounded-3xl mb-6">
                <p className="text-brand-blue text-sm font-black truncate mb-1">{project.title}</p>
                <p className="text-slate-400 text-xs font-medium line-clamp-2">{project.description}</p>
             </div>

             <div className="mt-auto space-y-6">
                {project.status === 'pending' && (
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Add feedback for approval/rejection..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium text-white outline-none focus:ring-1 focus:ring-brand-blue"
                      value={feedback[project._id] || ''}
                      onChange={(e) => setFeedback({...feedback, [project._id]: e.target.value})}
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => updateStatus(project._id, 'approved')}
                        className="flex-1 bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white font-black py-4 rounded-3xl border border-brand-green/20 transition-all flex items-center justify-center gap-2 text-xs uppercase"
                      >
                         <CheckCircle2 size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(project._id, 'rejected')}
                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white font-black py-4 rounded-3xl border border-red-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase"
                      >
                         <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                )}
                
                {project.status !== 'pending' && (
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-3xl border border-white/10 transition-all flex items-center justify-center gap-2 text-sm">
                       <FileText size={18} /> View Proposal
                    </button>
                    <button className="w-14 h-14 bg-brand-blue/10 hover:bg-brand-blue text-white rounded-3xl transition-all flex items-center justify-center shadow-xl">
                       <MessageSquare size={20} />
                    </button>
                  </div>
                )}
             </div>
          </div>
        ))}

        {/* Action Card */}
        <div className="glass p-8 rounded-[50px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-brand-blue/40 transition-all min-h-[300px]">
           <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={32} />
           </div>
           <h4 className="text-lg font-bold text-white font-outfit">Open Office Hours</h4>
           <p className="text-slate-500 text-sm mt-1 max-w-[150px] mx-auto">Click to schedule slot for all students</p>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
