import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { Users, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const Meetings: React.FC = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/projects/student', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setProject(data || null);
      } catch (err) {
        console.error('Error loading meeting data:', err);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const statusLabel =
    project?.status === 'approved'
      ? 'Approved'
      : project?.status === 'rejected'
      ? 'Rejected'
      : 'Pending';

  const statusIcon =
    project?.status === 'approved' ? <CheckCircle2 size={16} /> : project?.status === 'rejected' ? <AlertCircle size={16} /> : <Sparkles size={16} />;

  return (
    <div className="pt-32 px-6 pb-20 max-w-6xl mx-auto min-h-screen text-slate-100 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[40px] border border-white/10">
          <h1 className="text-3xl font-black text-white mb-4 font-outfit">Meetings</h1>
          <p className="text-slate-400 text-sm mb-8">Supervisor related details are shown here.</p>

          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-white font-black mb-3">Supervisor Feedback</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-brand-blue/10 border border-brand-blue/20 text-brand-blue mb-4">
                {statusIcon} {statusLabel}
              </div>
              <p className="text-slate-300 text-sm">{project?.feedback || 'No supervisor feedback yet.'}</p>
            </div>
          )}
        </div>

        <div className="glass p-8 rounded-[40px] border border-white/10 text-center">
          <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-brand-blue">
            <Users size={28} />
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Supervisor</p>
          <p className="text-xl font-black text-white mb-5">{project?.supervisorId?.name || 'Not Assigned'}</p>
          <button className="w-full bg-brand-blue p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <MessageSquare size={18} /> Chat with Supervisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
