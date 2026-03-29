import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import {
  Users,
  CheckCircle2,
  MessageSquare,
  XCircle,
  FileText,
  Loader2,
  Briefcase,
  AlertCircle,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  ExternalLink,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type SubmissionItem = {
  _id: string;
  fileUrl: string;
  originalFilename: string;
  type: string;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt?: string;
  projectId?: { _id: string; title?: string } | string;
};

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [submissionFeedback, setSubmissionFeedback] = useState<{ [key: string]: string }>({});
  const [uploadsByProject, setUploadsByProject] = useState<Record<string, SubmissionItem[]>>({});
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');

  useEffect(() => {
    Promise.all([fetchProjects(), fetchUploads()]).finally(() => setIsLoading(false));
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/projects/assigned', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUploads = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/projects/submissions/supervisor', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      const grouped: Record<string, SubmissionItem[]> = {};
      (data as SubmissionItem[]).forEach((item) => {
        const projectId = typeof item.projectId === 'string' ? item.projectId : item.projectId?._id;
        if (!projectId) return;
        if (!grouped[projectId]) grouped[projectId] = [];
        grouped[projectId].push(item);
      });
      setUploadsByProject(grouped);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    }
  };

  const updateStatus = async (projectId: string, status: 'approved' | 'rejected') => {
    try {
      const { data } = await axios.put(`http://localhost:5001/api/projects/${projectId}/status`, {
        status,
        feedback: feedback[projectId] || ''
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      setProjects((prev) => prev.map((p) => (p._id === projectId ? data : p)));
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const reviewSubmission = async (submissionId: string, reviewStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await axios.put(`http://localhost:5001/api/projects/submissions/${submissionId}/review`, {
        reviewStatus,
        feedback: submissionFeedback[submissionId] || ''
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      await fetchUploads();
    } catch (err) {
      console.error('Error reviewing submission:', err);
    }
  };

  const handleOpenOfficeHours = async () => {
    const date = window.prompt('Office hours date (YYYY-MM-DD):');
    if (!date) return;

    setIsScheduling(true);
    setScheduleMessage('');

    try {
      const { data } = await axios.post('http://localhost:5001/api/projects/office-hours/open', { date }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setScheduleMessage(`Scheduled ${data.created}/${data.totalStudents} slots.`);
    } catch (err: any) {
      setScheduleMessage(err?.response?.data?.message || 'Failed to open office hours.');
    } finally {
      setIsScheduling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-brand-blue bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-blue animate-pulse" size={24} />
        </div>
        <div className="text-center">
          <span className="text-xl font-black font-outfit uppercase tracking-tighter text-white">Registry Syncing</span>
          <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Faculty Management System v4.0</p>
        </div>
      </div>
    );
  }

  const pendingProjects = projects.filter((p) => p.status === 'pending').length;

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <header className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/20 rounded-xl text-brand-blue">
               <Briefcase size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Supervisor Portal</span>
          </div>
          <h1 className="text-5xl font-black font-outfit text-white tracking-tighter leading-none">
            Supervisor <span className="text-brand-blue italic">Dashboard</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg flex items-center gap-2">
            Academic Lead: <span className="text-white font-bold">{user?.name}</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            Faculty of Computing
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 glass p-6 rounded-[var(--radius-card)]"
        >
          <div className="text-center px-6">
            <span className="block text-3xl font-black text-white">{projects.length}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidates</span>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center px-6">
            <span className="block text-3xl font-black text-brand-blue">{pendingProjects}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending</span>
          </div>
          <button 
            onClick={handleOpenOfficeHours}
            disabled={isScheduling}
            className="ml-4 bg-brand-blue hover:bg-brand-blue/90 text-white p-4 rounded-2xl transition-all shadow-xl shadow-brand-blue/20 disabled:opacity-50"
          >
            {isScheduling ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
          </button>
        </motion.div>
      </header>

      {scheduleMessage && (
        <motion.div 
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           className="mb-8 p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl text-brand-blue text-sm font-bold flex items-center gap-3"
        >
           <AlertCircle size={18} />
           {scheduleMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.div 
              key={project._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-8 rounded-[var(--radius-card)] border-white/5 hover:border-brand-blue/30 transition-all group group relative"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shadow-inner">
                  <Users size={28} />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                  project.status === 'approved' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 
                  project.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                }`}>
                  {project.status}
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-brand-blue transition-colors">
                    {project.title || 'Untitled Research'}
                  </h4>
                  <p className="text-slate-400 text-xs font-medium flex items-center gap-2">
                    <GraduationCap size={14} className="text-slate-600" />
                    {project.studentId?.name || 'Anonymous Student'}
                  </p>
                </div>

                <div className="flex gap-4">
                  {project.githubLink && (
                    <a 
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-[#6366f1]"
                    >
                      <Code size={14} /> Repository
                    </a>
                  )}
                  {project.demoLink && (
                    <a 
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-[#10b981]"
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>

                {project.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-lg text-[8px] font-black text-brand-blue uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="bg-white/5 rounded-3xl p-6 space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <ClipboardCheck size={14} />
                    Active Milestone Submissions
                  </h5>
                  
                  <div className="space-y-3">
                    {(uploadsByProject[project._id] || []).length === 0 ? (
                      <p className="text-slate-600 text-[10px] italic py-2">No documents submitted yet.</p>
                    ) : (
                      (uploadsByProject[project._id] || []).map((file) => (
                        <div key={file._id} className="glass p-4 rounded-2xl border-white/5">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-white uppercase">{file.type.replace(/_/g, ' ')}</span>
                              <span className={`text-[9px] font-black uppercase ${
                                file.reviewStatus === 'approved' ? 'text-brand-green' : 
                                file.reviewStatus === 'rejected' ? 'text-red-400' : 'text-slate-500'
                              }`}>
                                {file.reviewStatus || 'pending'}
                              </span>
                           </div>
                           <textarea
                            placeholder="Add evaluation remarks..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white mb-3 focus:border-brand-blue transition-all outline-none resize-none h-16"
                            value={submissionFeedback[file._id] ?? file.feedback ?? ''}
                            onChange={(e) => setSubmissionFeedback((prev) => ({ ...prev, [file._id]: e.target.value }))}
                           />
                           <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => reviewSubmission(file._id, 'approved')} className="bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all">Approve</button>
                              <button onClick={() => reviewSubmission(file._id, 'rejected')} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all">Reject</button>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                {project.status === 'pending' ? (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Supervisor feedback for initial proposal..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium text-white outline-none focus:ring-1 focus:ring-brand-blue"
                      value={feedback[project._id] || ''}
                      onChange={(e) => setFeedback({ ...feedback, [project._id]: e.target.value })}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => updateStatus(project._id, 'approved')}
                        className="flex-1 bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-white font-black py-4 rounded-3xl border border-brand-green/20 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(project._id, 'rejected')}
                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white font-black py-4 rounded-3xl border border-red-500/20 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-3xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                      <FileText size={16} className="text-brand-blue" /> Case Details
                    </button>
                    <Link to="/chat" className="w-14 h-14 bg-brand-blue/10 hover:bg-brand-blue text-white rounded-2xl transition-all flex items-center justify-center shadow-xl group/btn">
                      <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
