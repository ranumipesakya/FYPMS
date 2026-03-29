import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Upload,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectTechnicals from '../components/project/ProjectTechnicals';

type SubmissionItem = {
  _id: string;
  fileUrl: string;
  originalFilename: string;
  type: string;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadType, setUploadType] = useState('proposal');
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchProject(), fetchSubmissions()]);
      setIsLoading(false);
    };
    load();
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
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await axios.get<SubmissionItem[]>('http://localhost:5001/api/projects/submissions/student', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    }
  };

  const openReport = (type: string) => {
    const file = submissions.find((s) => s.type === type);
    if (!file?.fileUrl) {
      window.alert('No uploaded PDF found.');
      return;
    }
    const href = file.fileUrl.startsWith('http') ? file.fileUrl : `http://localhost:5001${file.fileUrl}`;
    window.open(href, '_blank');
  };

  const openUploadDialog = (type: string) => {
    setUploadType(type);
    uploadRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !project?._id) {
      return;
    }

    const form = new FormData();
    form.append('projectId', project._id);
    form.append('type', uploadType);
    form.append('version', 'v1');
    form.append('file', e.target.files[0]);

    try {
      await axios.post('http://localhost:5001/api/projects/submissions/upload', form, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      await fetchSubmissions();
      window.alert('PDF uploaded successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      window.alert('Upload failed.');
    } finally {
      e.target.value = '';
    }
  };

  const statusLabel =
    project?.status === 'approved'
      ? 'Approved'
      : project?.status === 'rejected'
        ? 'Rejected'
        : 'Pending';

  const statusIcon =
    project?.status === 'approved' ? (
      <CheckCircle2 size={16} className="text-brand-green" />
    ) : project?.status === 'rejected' ? (
      <AlertCircle size={16} className="text-red-400" />
    ) : (
      <Clock size={16} className="text-brand-blue" />
    );

  const cards = [
    { label: 'Proposal', type: 'proposal', icon: <FileText size={20} /> },
    { label: 'Project Initiation Document', type: 'pid', icon: <Layout size={20} /> },
    { label: 'Interim Report', type: 'interim_report', icon: <TrendingUp size={20} /> },
    { label: 'Research Abstract', type: 'research_abstract', icon: <Sparkles size={20} /> },
    { label: 'Final Report', type: 'final_report', icon: <CheckCircle2 size={20} /> },
    { label: 'Poster', type: 'poster', icon: <Layout size={20} /> }
  ];

  const renderCard = (card: { label: string; type: string; icon: React.ReactNode }, index: number) => {
    const file = submissions.find((s) => s.type === card.type);
    const isUploaded = Boolean(file);
    const supervisorStatus =
      project?.status === 'approved'
        ? 'Approved'
        : project?.status === 'rejected'
          ? 'Rejected'
          : 'Reviewing';

    const statusClass =
      project?.status === 'approved'
        ? 'text-brand-green'
        : project?.status === 'rejected'
          ? 'text-red-400'
          : 'text-slate-400';

    return (
      <motion.div
        key={card.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className="glass group hover:border-brand-blue/40 transition-all duration-300 p-6 rounded-[var(--radius-card)]"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-300 shadow-inner">
            {card.icon}
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${statusClass}`}>
            {isUploaded ? supervisorStatus : 'Awaiting'}
          </div>
        </div>

        <h4 className="text-white font-bold text-lg mb-1 leading-tight">{card.label}</h4>
        <p className="text-slate-500 text-xs mb-6 truncate max-w-[200px]">
          {file?.originalFilename || 'Document not submitted'}
        </p>

        <div className="space-y-3">
          {isUploaded ? (
            <button
              onClick={() => openReport(card.type)}
              className="w-full bg-brand-blue/10 hover:bg-brand-blue text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
            >
              <FileText size={16} className="group-hover/btn:scale-110 transition-transform" />
              View Document
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </button>
          ) : (
            <button
              onClick={() => openUploadDialog(card.type)}
              className="w-full bg-white/5 hover:bg-brand-blue text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5 group/btn"
            >
              <Upload size={16} className="group-hover/btn:scale-110 transition-transform" />
              Submit PDF
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const progress = Math.round((submissions.length / cards.length) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-blue">
        <div className="w-12 h-12 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
      <input ref={uploadRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />

      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest border border-brand-blue/30">
              Academic Session 2026/27
            </div>
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black text-white font-outfit tracking-tighter mb-2">
            Project <span className="text-brand-blue italic">Dashboard</span>
          </h1>
          {project && <p className="text-slate-400 text-lg font-medium max-w-2xl">{project.title}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 rounded-[var(--radius-card)] min-w-[300px] border-l-4 border-l-brand-blue"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Submission Progress</span>
            <span className="text-xl font-black text-white">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-brand-blue rounded-full shadow-[0_0_15px_rgba(0,51,102,0.5)]"
            />
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white font-outfit flex items-center gap-3">
                <Layout className="text-brand-blue" size={24} />
                Academic Milestones
              </h3>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                {submissions.length} of {cards.length} Uploaded
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card, idx) => renderCard(card, idx))}
            </div>
          </section>

          {/* New Repository Component */}
          <section className="pt-8 pb-12">
            <ProjectTechnicals project={project} user={user} onUpdate={fetchProject} />
          </section>
        </div>

        <aside className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[var(--radius-card)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-blue/20 transition-all"></div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl mb-6 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h4 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Project Mentor</h4>
            <p className="text-2xl font-black text-white mb-1">{project?.supervisorId?.name || 'Not Designated'}</p>
            <p className="text-sm text-brand-blue font-bold">Faculty of Computing</p>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Project Status</span>
                <div className="flex items-center gap-2">
                  {statusIcon}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${project?.status === 'approved' ? 'text-brand-green' : project?.status === 'rejected' ? 'text-red-400' : 'text-brand-blue'}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[var(--radius-card)] bg-brand-blue/5 border-dashed border-brand-blue/20"
          >
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-blue" />
              Quick Tip
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ensure all submissions are in <b>PDF format</b> and follow the university guidelines for proper naming conventions.
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
