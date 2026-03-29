import React, { useState } from 'react';
import { 
  Search, 
  Trophy, 
  Code2, 
  GraduationCap,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Showcase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      title: "Smart Campus Navigation System",
      student: "Amila Bandara",
      supervisor: "Dr. N. Fernando",
      description: "A mobile-first indoor navigation system for NSBM campus using BLE beacons and AR mapping technology.",
      demo: "#",
      github: "#",
      tags: ["Mobile", "AR", "Swift"],
      isFeatured: true
    },
    {
      title: "E-Learning Platform for Rural Schools",
      student: "Nimali Silva",
      supervisor: "Prof. R. Perera",
      description: "Offline-first web app providing interactive lessons to areas with low connectivity using localized edge computing.",
      demo: "#",
      github: "#",
      tags: ["React", "PWA", "Education"],
      isFeatured: false
    },
    {
      title: "AI Crop Health Monitoring",
      student: "Kasun Perera",
      supervisor: "Dr. S. K. Perera",
      description: "Detecting crop diseases using drone imagery and CNN-based deep learning models for precision agriculture.",
      demo: "#",
      github: "#",
      tags: ["AI", "Python", "IoT"],
      isFeatured: true
    }
  ];

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 px-6 pb-24 font-inter relative overflow-hidden">
      {/* Background Stylings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-brand-blue/10 to-transparent -z-10 opacity-50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto text-center mb-24">
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-3 bg-brand-blue/10 text-brand-blue px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-blue/20 shadow-xl shadow-brand-blue/5"
         >
           <Trophy size={14} />
           Academic Excellence 2026
         </motion.div>
         
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-6xl md:text-8xl font-black font-outfit text-white mb-8 tracking-tighter leading-none"
         >
           Project <span className="text-brand-blue italic">Showcase</span>
         </motion.h1>
         
         <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed"
         >
           Discover the frontier of innovation at NSBM. A curated gallery of the most impactful research from our Faculty of Computing.
         </motion.p>
         
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 max-w-2xl mx-auto relative group"
         >
            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue transition-colors">
               <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search by innovation or technology..."
              className="w-full bg-white/[0.03] border border-white/5 py-6 pl-16 pr-8 rounded-[2.5rem] text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/40 transition-all text-lg font-medium shadow-3xl group-hover:bg-white/[0.05]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, idx) => (
            <motion.div 
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass p-10 rounded-[3rem] border-white/5 hover:border-brand-blue/20 transition-all duration-500 group relative flex flex-col ${project.isFeatured ? 'ring-1 ring-brand-blue/30 bg-brand-blue/[0.02]' : ''}`}
            >
               {project.isFeatured && (
                 <div className="absolute -top-4 -right-4 bg-brand-blue text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/40 flex items-center gap-2">
                   <Sparkles size={12} /> Featured Innovation
                 </div>
               )}

               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:scale-110 transition-transform shadow-inner group-hover:bg-brand-blue/10">
                 <Code2 size={32} />
               </div>

               <h3 className="text-2xl font-black text-white mb-3 leading-none tracking-tight group-hover:text-brand-blue transition-colors font-outfit uppercase">
                 {project.title}
               </h3>
               
               <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                  <div className="p-1.5 bg-white/5 rounded-lg"><GraduationCap size={14} /></div>
                  {project.student}
               </div>
               
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 opacity-80 min-h-[4.5rem]">
                 {project.description}
               </p>

               <div className="flex flex-wrap gap-2 mb-10 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-white/5 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black border border-white/5 uppercase tracking-widest hover:bg-brand-blue/10 hover:text-brand-blue transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
               </div>

               <div className="flex gap-4">
                  <button className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/10 active:scale-95 transition-all">
                    <ExternalLink size={16} /> Live Module
                  </button>
                  <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 flex items-center justify-center active:scale-95 transition-all">
                    <Code2 size={20} />
                  </button>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-32 p-16 text-center glass rounded-[4rem] border-white/5 shadow-3xl relative overflow-hidden group"
      >
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] -z-10 group-hover:bg-brand-green/10 transition-all duration-1000"></div>
         
         <h2 className="text-5xl font-black text-white mb-6 font-outfit tracking-tighter uppercase italic leading-none">Ready to pioneer the future?</h2>
         <p className="text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed text-lg">Join the Next Generation of Tech Leaders at NSBM Faculty of Computing.</p>
         
         <button className="bg-brand-green hover:bg-brand-green/90 text-white px-14 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-brand-green/20 transition-all transform hover:scale-105 flex items-center gap-4 mx-auto group/btn">
           Academic Enrollment 2026
           <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
         </button>
      </motion.div>
    </div>
  );
};

export default Showcase;
