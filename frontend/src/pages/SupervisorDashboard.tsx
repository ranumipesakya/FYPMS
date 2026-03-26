import React from 'react';
import { useAuth } from '../store/AuthContext';
import { 
  Users, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const assignedStudents = [
    { name: "John Doe", id: "IT12345678", project: "AI Research Summarizer", status: "Reviewing", progress: 20 },
    { name: "Jane Smith", id: "IT87654321", project: "Smart Campus Nav", status: "Approved", progress: 65 },
    { name: "Amali Perera", id: "IT11223344", project: "ML Crop Monitor", status: "Proposal", progress: 5 }
  ];

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 animate-in fade-in slide-in-from-top duration-700">
        <div>
          <h1 className="text-5xl font-black font-outfit text-white mb-2 tracking-tighter">Academic <span className="text-brand-blue italic">Overview</span></h1>
          <p className="text-slate-400 font-medium text-lg">Supervisor: <span className="text-white font-bold">{user?.name}</span> • Faculty of Computing</p>
        </div>
        <div className="bg-brand-blue/10 border border-brand-blue/20 px-8 py-4 rounded-[30px] flex items-center gap-6 glass shadow-2xl">
           <div className="text-center border-r border-white/10 pr-6">
              <span className="block text-2xl font-black text-white">12</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Students</span>
           </div>
           <div className="text-center">
              <span className="block text-2xl font-black text-brand-green">4</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assignedStudents.map((student, idx) => (
          <div key={idx} className="glass p-8 rounded-[50px] border border-white/5 hover:border-brand-blue/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-all"></div>
             
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                   <Users size={24} />
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {student.id}
                </div>
             </div>

             <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
             <p className="text-brand-blue text-sm font-bold truncate mb-6">{student.project}</p>

             <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                   <span>Progress</span>
                   <span className="text-white">{student.progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-brand-blue to-teal-400 transition-all duration-1000" 
                     style={{ width: `${student.progress}%` }}
                   ></div>
                </div>
             </div>

             <div className="flex gap-4">
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-3xl border border-white/10 transition-all flex items-center justify-center gap-2">
                   Review
                </button>
                <button className="w-14 h-14 bg-brand-blue/10 hover:bg-brand-blue text-white rounded-3xl transition-all flex items-center justify-center shadow-xl">
                   <MessageSquare size={20} />
                </button>
             </div>
          </div>
        ))}

        {/* Action Card */}
        <div className="glass p-8 rounded-[50px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-brand-blue/40 transition-all">
           <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={32} />
           </div>
           <h4 className="text-lg font-bold text-white">Request Meeting</h4>
           <p className="text-slate-500 text-sm mt-1">Select a student and slot</p>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
