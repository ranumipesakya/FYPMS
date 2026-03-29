import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import { 
    FileUp, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    Download, 
    Star,
    Send,
    FileText,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Submission {
    _id: string;
    type: string;
    version: string;
    fileUrl: string;
    originalFilename: string;
    reviewStatus: string;
    grade: number;
    feedback: string;
    createdAt: string;
    projectId: { _id: string; title: string };
    userId: { _id: string; name: string; email: string };
}

interface Project {
    _id: string;
    title: string;
}

const Submissions: React.FC = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [myProject, setMyProject] = useState<Project | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Form state for students
    const [formData, setFormData] = useState({
        type: 'proposal',
        version: 'v1'
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Feedback state for supervisors
    const [feedbackForm, setFeedbackForm] = useState({
        grade: 0,
        feedback: '',
        status: 'approved'
    });
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);

    useEffect(() => {
        fetchSubmissions();
        if (user?.role === 'student') {
            fetchMyProject();
        }
    }, [user]);

    const fetchSubmissions = async () => {
        try {
            const endpoint = user?.role === 'supervisor' 
                ? 'http://localhost:5001/api/projects/submissions/supervisor' 
                : 'http://localhost:5001/api/projects/submissions/student';
            
            const { data } = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            setSubmissions(data);
        } catch (error) {
            console.error('Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyProject = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/projects/student', {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (data) setMyProject(data);
        } catch (error) {
            console.error('Failed to fetch project');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !myProject) return;

        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('projectId', myProject._id);
        uploadData.append('type', formData.type);
        uploadData.append('version', formData.version);

        setUploading(true);
        try {
            await axios.post('http://localhost:5001/api/projects/submissions/upload', uploadData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user?.token}` 
                }
            });
            setMessage({ type: 'success', text: 'Document submitted successfully!' });
            setSelectedFile(null);
            fetchSubmissions();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleGrade = async (submissionId: string) => {
        try {
            await axios.put(`http://localhost:5001/api/projects/submissions/${submissionId}/review`, {
                reviewStatus: feedbackForm.status,
                feedback: feedbackForm.feedback
            }, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            setMessage({ type: 'success', text: 'Feedback submitted!' });
            setActiveSubmissionId(null);
            fetchSubmissions();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submit feedback' });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="text-brand-green" size={16} />;
            case 'rejected': return <AlertCircle className="text-red-500" size={16} />;
            default: return <Clock className="text-amber-500" size={16} />;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-[#0A0C10]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white font-outfit tracking-tight uppercase">
                            Milestone <span className="text-brand-blue">Submissions</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                           Track and manage academic project deliverables
                        </p>
                    </div>
                </div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                            message.type === 'success' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Submission Form (Only for Students) */}
                    {user?.role === 'student' && (
                        <div className="lg:col-span-1">
                            <div className="glass rounded-[2.5rem] p-8 border border-white/5 sticky top-32">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                        <FileUp size={20} />
                                    </div>
                                    <h3 className="text-white font-black uppercase tracking-widest text-[11px]">New Submission</h3>
                                </div>

                                {!myProject ? (
                                    <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
                                        <AlertCircle className="mx-auto text-slate-500 mb-3" size={24} />
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose">
                                            You must have an active project to make submissions.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUpload} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Submission Type</label>
                                            <select 
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all"
                                            >
                                                <option value="proposal" className="bg-slate-900">Research Proposal</option>
                                                <option value="pid" className="bg-slate-900">PID Document</option>
                                                <option value="interim_report" className="bg-slate-900">Interim Report</option>
                                                <option value="research_abstract" className="bg-slate-900">Research Abstract</option>
                                                <option value="poster" className="bg-slate-900">Project Poster</option>
                                                <option value="final_report" className="bg-slate-900">Final Dissertation</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Version</label>
                                            <div className="flex gap-2">
                                                {['v1', 'v2', 'final'].map(v => (
                                                    <button 
                                                        key={v}
                                                        type="button"
                                                        onClick={() => setFormData({...formData, version: v})}
                                                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                            formData.version === v ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-white/5 border-white/10 text-slate-500'
                                                        }`}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative group/upload">
                                                <input 
                                                    type="file" 
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept=".pdf,.doc,.docx"
                                                />
                                                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                                                    selectedFile ? 'border-brand-green/30 bg-brand-green/5' : 'border-white/10 group-hover/upload:border-brand-blue/30 group-hover/upload:bg-white/5'
                                                }`}>
                                                    <FileText className={`mx-auto mb-4 ${selectedFile ? 'text-brand-green' : 'text-slate-600'}`} size={32} />
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
                                                        {selectedFile ? selectedFile.name : 'Choose File'}
                                                    </p>
                                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">PDF (Max 10MB)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={uploading || !selectedFile}
                                            className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 transition-all flex items-center justify-center gap-3"
                                        >
                                            {uploading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <Send size={14} /> Finalize Submission
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submissions List */}
                    <div className={user?.role === 'student' ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="space-y-6">
                            {loading ? (
                                [1,2,3].map(i => <div key={i} className="h-32 glass rounded-3xl animate-pulse" />)
                            ) : submissions.length === 0 ? (
                                <div className="glass rounded-[2.5rem] p-16 text-center border border-white/5">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <History className="text-slate-600" size={32} />
                                    </div>
                                    <h3 className="text-white text-xl font-black uppercase tracking-tight mb-2">No History</h3>
                                    <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">There are no documented submissions for your current academic project cycles.</p>
                                </div>
                            ) : (
                                submissions.map((sub) => (
                                    <motion.div 
                                        key={sub._id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="glass rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all overflow-hidden"
                                    >
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-white font-black text-sm uppercase tracking-tight">{sub.type.replace('_', ' ')}</h4>
                                                            <span className="bg-brand-blue/10 text-brand-blue text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{sub.version}</span>
                                                        </div>
                                                        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                            {sub.originalFilename} • {new Date(sub.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                                        sub.reviewStatus === 'approved' ? 'bg-brand-green/5 border-brand-green/20' : 
                                                        sub.reviewStatus === 'rejected' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
                                                    }`}>
                                                        {getStatusIcon(sub.reviewStatus)}
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                            sub.reviewStatus === 'approved' ? 'text-brand-green' : 
                                                            sub.reviewStatus === 'rejected' ? 'text-red-400' : 'text-amber-500'
                                                        }`}>
                                                            {sub.reviewStatus}
                                                        </span>
                                                    </div>
                                                    
                                                    <a 
                                                        href={`http://localhost:5001${sub.fileUrl}`} 
                                                        download 
                                                        className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            </div>

                                            {(sub.feedback || sub.grade > 0) && (
                                                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8">
                                                    <div className="md:col-span-1">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 ml-1">Awarded Grade</label>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-3xl font-black text-white font-outfit">{sub.grade}</div>
                                                            <div className="w-px h-10 bg-white/10"></div>
                                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">/ 100</div>
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 ml-1">Supervisor Feedback</label>
                                                        <div className="bg-white/5 rounded-2xl p-6 text-slate-400 text-xs font-medium leading-relaxed italic border border-white/5">
                                                           " {sub.feedback} "
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {user?.role === 'supervisor' && !activeSubmissionId && (
                                                <button 
                                                    onClick={() => {
                                                        setActiveSubmissionId(sub._id);
                                                        setFeedbackForm({ grade: sub.grade, feedback: sub.feedback, status: sub.reviewStatus });
                                                    }}
                                                    className="mt-8 w-full py-4 bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                                                >
                                                    <Star size={14} /> Review & Grade Milestone
                                                </button>
                                            )}

                                            <AnimatePresence>
                                                {activeSubmissionId === sub._id && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-8 pt-8 border-t border-white/5"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Grade Points</label>
                                                                <input 
                                                                    type="number"
                                                                    max={100}
                                                                    min={0}
                                                                    value={feedbackForm.grade}
                                                                    onChange={(e) => setFeedbackForm({...feedbackForm, grade: parseInt(e.target.value)})}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/50 outline-none transition-all"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Decision</label>
                                                                <div className="flex gap-2">
                                                                    {['pending', 'approved', 'rejected'].map(s => (
                                                                        <button 
                                                                            key={s}
                                                                            type="button"
                                                                            onClick={() => setFeedbackForm({...feedbackForm, status: s})}
                                                                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                                                feedbackForm.status === s ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-white/5 border-white/10 text-slate-500'
                                                                            }`}
                                                                        >
                                                                            {s}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2 mb-6">
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Official Feedback</label>
                                                            <textarea 
                                                                value={feedbackForm.feedback}
                                                                onChange={(e) => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                                                                placeholder="Provide detailed academic feedback..."
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-xs font-medium focus:ring-2 focus:ring-brand-blue/50 outline-none transition-all min-h-[120px] resize-none"
                                                            />
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button 
                                                                onClick={() => setActiveSubmissionId(null)}
                                                                className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                                                            >
                                                                Discard Changes
                                                            </button>
                                                            <button 
                                                                onClick={() => handleGrade(sub._id)}
                                                                className="flex-[2] py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <CheckCircle size={14} /> Commit Grade & Feedback
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Submissions;
