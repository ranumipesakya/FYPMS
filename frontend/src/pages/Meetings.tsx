import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { Users, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type SubmissionItem = {
  _id: string;
  type: string;
  originalFilename: string;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  feedback?: string;
};

const Meetings: React.FC = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, submissionsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/projects/student', {
            headers: { Authorization: `Bearer ${user?.token}` }
          }),
          axios.get<SubmissionItem[]>('http://localhost:5001/api/projects/submissions/student', {
            headers: { Authorization: `Bearer ${user?.token}` }
          })
        ]);

        setProject(projectRes.data || null);
        setSubmissions(submissionsRes.data || []);
      } catch (err) {
        console.error('Error loading meeting data:', err);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const cards = [
    { label: 'Proposal', type: 'proposal' },
    { label: 'Project Initiation Document (PID)', type: 'pid' },
    { label: 'Interim Report', type: 'interim_report' },
    { label: 'Research Abstract', type: 'research_abstract' },
    { label: 'Final Report', type: 'final_report' },
    { label: 'Poster', type: 'poster' }
  ];

  return (
    <div className="pt-32 px-6 pb-20 max-w-6xl mx-auto min-h-screen text-slate-100 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[40px] border border-white/10">
          <h1 className="text-3xl font-black text-white mb-4 font-outfit">Meetings</h1>
          <p className="text-slate-400 text-sm mb-8">Supervisor comments by submission card.</p>

          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cards.map((card) => {
                const item = submissions.find((s) => s.type === card.type);
                const status = item?.reviewStatus || 'pending';
                const statusClass =
                  status === 'approved'
                    ? 'text-brand-green'
                    : status === 'rejected'
                    ? 'text-red-400'
                    : 'text-slate-400';

                return (
                  <div key={card.type} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-white font-black mb-2">{card.label}</h3>
                    <p className={`text-xs font-black uppercase mb-3 ${statusClass}`}>{status}</p>
                    <p className="text-slate-300 text-sm">{item?.feedback || 'No supervisor comment yet.'}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[40px] border border-white/10 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shadow-inner group-hover:scale-110 transition-transform">
                   <Users size={24} />
                 </div>
                 <div>
                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] leading-none mb-1">Assigned Mentor</p>
                    <p className="text-lg font-black text-white font-outfit tracking-tight">{project?.supervisorId?.name || 'Academic Mentor'}</p>
                 </div>
              </div>
              
              <div className="h-64 bg-white/5 rounded-3xl p-4 overflow-y-auto mb-4 space-y-3 custom-scrollbar border border-white/5">
                 {/* Mini chat history */}
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center py-4 border-b border-white/5 mb-4">Conversation History</div>
                 <div className="bg-brand-blue/10 p-3 rounded-2xl rounded-tl-none text-[11px] text-slate-300 max-w-[90%]">Hello! How is your research proposal coming along?</div>
                 <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none text-[11px] text-white self-end ml-auto max-w-[90%] border border-white/5">I've just uploaded the draft. Please take a look!</div>
              </div>

              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Message mentor..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[11px] text-white outline-none focus:border-brand-blue/40 transition-all font-medium"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all">
                    <MessageSquare size={16} />
                 </button>
              </div>

              <Link 
                to="/chat" 
                className="w-full mt-4 text-[9px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2"
              >
                Expand Messaging Portal <ChevronRight size={12} />
              </Link>
           </div>

           <div className="glass p-8 rounded-[40px] border border-white/5 bg-brand-blue/5 border-dashed">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest leading-none">
                 <Sparkles size={16} className="text-brand-blue" />
                 Academic Support
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                 Use the unified chat to coordinate milestone reviews and manage regular check-ins with your assigned academic mentor.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
