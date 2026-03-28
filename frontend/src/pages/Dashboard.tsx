import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { CheckCircle2, AlertCircle, Sparkles, FileText, Upload, Users } from 'lucide-react';

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
      : '';

  const statusIcon =
    project?.status === 'approved' ? <CheckCircle2 size={16} /> : project?.status === 'rejected' ? <AlertCircle size={16} /> : <Sparkles size={16} />;

  const cards = [
    { label: 'Proposal', type: 'proposal' },
    { label: 'Project Initiation Document (PID)', type: 'pid' },
    { label: 'Interim Report', type: 'interim_report' },
    { label: 'Research Abstract', type: 'research_abstract' },
    { label: 'Final Report', type: 'final_report' },
    { label: 'Poster', type: 'poster' }
  ];

  const leftCards = cards.slice(0, 3);
  const rightCards = cards.slice(3, 6);

  const renderCard = (card: { label: string; type: string }) => {
    const file = submissions.find((s) => s.type === card.type);
    const isUploaded = Boolean(file);
    const supervisorStatus =
      project?.status === 'approved'
        ? 'Approved'
        : project?.status === 'rejected'
        ? 'Rejected'
        : 'Pending Review';

    const statusClass =
      project?.status === 'approved'
        ? 'bg-brand-green/20 text-brand-green border border-brand-green/20'
        : project?.status === 'rejected'
        ? 'bg-red-500/20 text-red-400 border border-red-500/20'
        : 'bg-white/10 text-slate-300 border border-white/15';

    return (
      <div key={card.type} className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-white font-black mb-2">{card.label}</p>
        <p className="text-slate-400 text-xs mb-4 truncate">{file?.originalFilename || 'No file uploaded'}</p>
        <div className="grid grid-cols-2 gap-3">
          {isUploaded ? (
            <button onClick={() => openReport(card.type)} className="bg-brand-blue p-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              <FileText size={16} /> View
            </button>
          ) : (
            <button onClick={() => openUploadDialog(card.type)} className="bg-brand-blue p-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              <Upload size={16} /> Upload
            </button>
          )}
          <button disabled className={`p-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 ${statusClass}`}>
            {supervisorStatus}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <input ref={uploadRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="glass p-8 rounded-[40px] border border-white/10">
            <h1 className="text-3xl font-black text-white mb-3 font-outfit">Dashboard</h1>
            {isLoading ? (
              <p className="text-slate-400">Loading project...</p>
            ) : project ? (
              <>
                <h2 className="text-2xl font-black text-white mb-2">{project.title}</h2>
                <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                {statusLabel && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                    {statusIcon} {statusLabel}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400">No project created yet. Create your project from setup first.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[40px] border border-white/10 text-center">
            <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-brand-blue">
              <Users size={28} />
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Supervisor Name</p>
            <p className="text-xl font-black text-white">{project?.supervisorId?.name || 'Not Assigned'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass p-8 rounded-[40px] border border-white/10">
          <h3 className="text-xl font-black text-white mb-6 font-outfit">Project Cards</h3>
          <div className="grid grid-cols-1 gap-5">
            {leftCards.map(renderCard)}
          </div>
        </div>

        <div className="glass p-8 rounded-[40px] border border-white/10">
          <h3 className="text-xl font-black text-white mb-6 font-outfit">Project Cards</h3>
          <div className="grid grid-cols-1 gap-5">
            {rightCards.map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
