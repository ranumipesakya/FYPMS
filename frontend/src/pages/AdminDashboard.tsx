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
  Briefcase,
  TrendingUp,
  Layout,
  Server,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const systemStats = [
    { label: "Candidate Census", count: "1,245", trend: "+12%", color: "text-brand-blue", icon: <Users size={20} /> },
    { label: "Faculty Supervisors", count: "86", trend: "+2", color: "text-brand-green", icon: <Briefcase size={20} /> },
    { label: "Active Research", count: "842", trend: "75%", color: "text-brand-blue", icon: <Layout size={20} /> },
    { label: "Uptime Registry", count: "99.9%", trend: "100%", color: "text-brand-green", icon: <Activity size={20} /> }
  ];

  return (
    <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen text-slate-100 font-inter">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest border border-brand-blue/30">
               System Privileges Level 4
            </div>
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black font-outfit text-white tracking-tighter leading-none">
            System <span className="text-brand-blue italic">Administration</span>
          </h1>
          <p className="mt-3 text-slate-400 font-medium text-lg">
             Lead Administrator: <span className="text-white font-bold">{user?.name}</span>
             <span className="mx-2 opacity-30">|</span>
             Accessing <span className="text-brand-blue font-bold">Faculty Infrastructure</span>
          </p>
        </motion.div>

        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-brand-blue/20 transition-all"
           >
              <Fingerprint size={18} />
              Identity Access
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-[1.5rem] flex items-center justify-center transition-all hover:bg-white/10"
           >
              <Settings size={20} />
           </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
         {systemStats.map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass p-8 rounded-[var(--radius-card)] border-white/5 hover:border-brand-blue/20 transition-all group overflow-hidden relative"
           >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-all"></div>
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-white/5 rounded-2xl text-brand-blue group-hover:scale-110 transition-transform">
                    {stat.icon}
                 </div>
                 <span className="text-[10px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                    {stat.trend}
                 </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color} font-outfit tracking-tighter`}>{stat.count}</h3>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* User Management Section */}
         <motion.section 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="glass p-10 rounded-[var(--radius-card)] border-white/5 shadow-3xl"
         >
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-white font-outfit flex items-center gap-4">
                  <span className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue"><Server size={24} /></span>
                  Control Registry
               </h3>
               <div className="relative group">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search accounts..." 
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white outline-none focus:border-brand-blue transition-all" 
                  />
               </div>
            </div>
            
            <div className="space-y-4">
               {[1, 2, 3, 4].map(i => (
                 <motion.div 
                   key={i} 
                   whileHover={{ x: 5 }}
                   className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] flex items-center justify-between hover:border-brand-blue/30 transition-all cursor-pointer group"
                 >
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-inner uppercase tracking-tighter">
                          UR
                       </div>
                       <div>
                          <p className="font-extrabold text-white text-sm">System Endpoint User {i}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">student{i}@nsbm.ac.lk</p>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-brand-blue transition-colors">
                       <ChevronRight size={18} />
                    </div>
                 </motion.div>
               ))}
               <button className="w-full py-6 text-brand-blue font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors border-t border-white/5 mt-4">
                  View Full Candidate Roster
               </button>
            </div>
         </motion.section>

         {/* Project Overview Section */}
         <motion.section 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="glass p-10 rounded-[var(--radius-card)] border-white/5 shadow-3xl flex flex-col"
         >
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-white font-outfit flex items-center gap-4">
                  <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green"><Database size={24} /></span>
                  Academic Records
               </h3>
               <TrendingUp className="text-brand-green" size={20} />
            </div>

            <div className="space-y-6 flex-1">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-4">
                      <h5 className="font-black text-white text-lg">Final Year Milestone Sync</h5>
                      <span className="text-[10px] font-black text-brand-green uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:bg-brand-green group-hover:text-white transition-colors">Operational</span>
                   </div>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed">Centralized database synchronization with academicregistry.nsbm.ac.lk complete. No conflicts detected.</p>
                   <div className="mt-6 flex items-center gap-4">
                       <div className="h-2 bg-white/5 flex-1 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '95%' }}
                             className="h-full bg-brand-blue rounded-full"
                          />
                       </div>
                       <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">95% complete</span>
                   </div>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group">
                   <div className="absolute top-4 right-4 text-brand-blue/30 group-hover:text-brand-blue transition-colors">
                      <ShieldAlert size={40} />
                   </div>
                   <h5 className="font-black text-white text-lg mb-2">Security Audit Logs</h5>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[280px]">Automated penetration test successful. Last integrity check performed 2 hours ago by Primary Control.</p>
                   <div className="mt-6 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-green"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-black mt-1">Status: Hardened</span>
                   </div>
                </div>
            </div>
         </motion.section>
      </div>
    </div>
  );
};

export default AdminDashboard;
