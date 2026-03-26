import React, { useState } from 'react';
import { 
  Search, 
  Trophy, 
  Code2, 
  Globe, 
  GraduationCap 
} from 'lucide-react';

const Showcase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      title: "Smart Campus Navigation System",
      student: "Amila Bandara",
      supervisor: "Dr. N. Fernando",
      description: "A mobile-first indoor navigation system for NSBM campus using BLE beacons and AR.",
      demo: "https://campus-nav.demo",
      github: "https://github.com/amila/nsbm-nav",
      tags: ["Mobile", "AR", "Swift"],
      isFeatured: true
    },
    {
      title: "E-Learning Platform for Rural Schools",
      student: "Nimali Silva",
      supervisor: "Prof. R. Perera",
      description: "Offline-first web app providing interactive lessons to areas with low connectivity.",
      demo: "https://rural-learn.demo",
      github: "https://github.com/nimali/rural-learn",
      tags: ["React", "PWA", "Education"],
      isFeatured: false
    },
    {
      title: "AI Crop Health Monitoring",
      student: "Kasun Perera",
      supervisor: "Dr. S. K. Perera",
      description: "Detecting crop diseases using drone imagery and CNN-based deep learning models.",
      demo: "https://crop-ai.demo",
      github: "https://github.com/kasun/crop-monitor",
      tags: ["AI", "Python", "IoT"],
      isFeatured: true
    }
  ];

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pt-28 px-6 pb-20 font-inter">
      <div className="max-w-7xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-top duration-700">
         <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-brand-green/20">
           <Trophy size={14} />
           Student Achievements 2026
         </div>
         <h1 className="text-6xl font-extrabold font-outfit text-white mb-6 tracking-tight">Project <span className="text-brand-blue italic">Showcase</span></h1>
         <p className="max-w-2xl mx-auto text-lg text-slate-400 font-medium leading-relaxed">
           Discover the innovative final year projects developed by our talented students at the Faculty of Computing.
         </p>
         
         <div className="mt-12 max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-brand-blue">
               <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by project name or technology..."
              className="w-full bg-white/5 border border-white/10 py-5 pl-16 pr-8 rounded-3xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-lg font-medium shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((project, idx) => (
          <div key={idx} className={`glass-dark group relative p-8 rounded-[40px] border border-white/5 hover:border-brand-blue/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl ${project.isFeatured ? 'ring-2 ring-brand-blue/20' : ''}`}>
             
             {project.isFeatured && (
               <div className="absolute top-6 right-6 bg-brand-blue text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                 FEATURED
               </div>
             )}

             <div className="bg-brand-blue/20 p-4 rounded-3xl w-fit mb-6 group-hover:rotate-6 transition-transform">
               <Code2 className="text-brand-blue w-8 h-8" />
             </div>

             <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-brand-blue transition-colors">
               {project.title}
             </h3>
             <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">
                <GraduationCap size={16} />
                {project.student}
             </div>
             
             <p className="text-slate-400 text-sm leading-relaxed mb-8 opacity-80 min-h-[4rem]">
               {project.description}
             </p>

             <div className="flex flex-wrap gap-2 mb-10">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="bg-white/5 text-slate-400 px-3 py-1 rounded-lg text-xs font-bold border border-white/5 uppercase tracking-tighter hover:bg-white/10 transition-colors">
                    {tag}
                  </span>
                ))}
             </div>

             <div className="flex gap-4">
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white font-black py-4 rounded-2xl text-center flex items-center justify-center gap-2 shadow-xl hover:shadow-brand-blue/20 transition-all active:scale-95"
                >
                  <Globe size={18} />
                  Live Demo
                </a>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/10 transition-all active:scale-95"
                >
                  <Code2 size={18} />
                </a>
             </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-24 py-16 text-center glass rounded-[50px] border border-white/5 shadow-inner">
         <h2 className="text-3xl font-bold text-white mb-4 font-outfit">Ready to start your journey?</h2>
         <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto leading-relaxed">Join the next generation of innovators at NSBM Green University Faculty of Computing.</p>
         <button className="bg-brand-green hover:bg-brand-green/90 text-white px-12 py-5 rounded-[40px] font-black text-xl shadow-2xl hover:shadow-brand-green/20 transition-all transform hover:scale-110 flex items-center gap-3 mx-auto">
           Apply Now
           <ChevronRight size={24} />
         </button>
      </div>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default Showcase;
