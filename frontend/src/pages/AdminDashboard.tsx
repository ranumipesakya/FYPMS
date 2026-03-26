import React from 'react';
import { useAuth } from '../store/AuthContext';
import { 
  Users, 
  Settings, 
  ShieldAlert, 
  Activity, 
  Search, 
  ChevronRight,
  Database,
  Briefcase
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const systemStats = [
    { label: "Total Students", count: "1,245", trend: "+12%", color: "text-brand-blue" },
    { label: "Total Supervisors", count: "86", trend: "+2", color: "text-teal-400" },
    { label: "Active Projects", count: "842", trend: "75%", color: "text-brand-green" },
    { label: "System Health", count: "99.9%", trend: "100%", color: "text-blue-500" }
  ];

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 animate-in fade-in slide-in-from-top duration-700">
        <div>
          <h1 className="text-5xl font-black font-outfit text-white mb-2 tracking-tighter">System <span className="text-brand-green italic">Administration</span></h1>
          <p className="text-slate-400 font-medium">Administrator: <span className="text-white font-bold">{user?.name}</span> • Faculty Portal Control</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-2 shadow-2xl transition-all active:scale-95">
              <ShieldAlert size={20} />
              Manage Access
           </button>
           <button className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-3xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-95">
              <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
         {systemStats.map((stat, i) => (
           <div key={i} className="glass p-8 rounded-[40px] border border-white/5 hover:border-brand-blue/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-all"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color} font-outfit tracking-tighter`}>{stat.count}</h3>
              <p className="text-slate-600 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase">
                 <Activity size={10} />
                 Growth: {stat.trend}
              </p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* User Management Section */}
         <section className="glass p-10 rounded-[60px] border border-white/5 shadow-3xl">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-white font-outfit flex items-center gap-4">
                  <span className="p-3 bg-brand-blue/20 rounded-2xl text-brand-blue"><Users size={24} /></span>
                  User Directory
               </h3>
               <Search className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>
            
            <div className="space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:border-brand-blue/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-white group-hover:bg-brand-blue transition-colors italic">S</div>
                       <div>
                          <p className="font-bold text-white">Student User {i}</p>
                          <p className="text-xs text-slate-500 font-medium">student{i}@nsbm.ac.lk</p>
                       </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-600 group-hover:text-brand-blue transition-all" />
                 </div>
               ))}
               <button className="w-full py-4 text-brand-blue font-black text-sm uppercase tracking-widest hover:underline">View All Records</button>
            </div>
         </section>

         {/* Project Overview Section */}
         <section className="glass p-10 rounded-[60px] border border-white/5 shadow-3xl">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-white font-outfit flex items-center gap-4">
                  <span className="p-3 bg-teal-400/20 rounded-2xl text-teal-400"><Database size={24} /></span>
                  System Registry
               </h3>
               <Briefcase className="text-slate-500" />
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer">
                   <h5 className="font-bold text-white mb-1">Final Year Project Allotment</h5>
                   <p className="text-xs text-slate-400">Database synchronization with LMS complete. All supervisors assigned.</p>
                   <div className="mt-4 flex items-center gap-2">
                       <div className="h-1 bg-brand-blue flex-1 rounded-full"></div>
                       <span className="text-[10px] font-black text-brand-blue uppercase">95% synced</span>
                   </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer">
                   <h5 className="font-bold text-white mb-1">Audit Logs</h5>
                   <p className="text-xs text-slate-400">System backup complete. Last audit 2 hours ago by SystemAdmin.</p>
                </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
