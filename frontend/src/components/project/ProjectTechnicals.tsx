import React, { useState } from 'react';
import axios from 'axios';
import { 
  Code, 
  ExternalLink, 
  Tag, 
  Save, 
  X,
  GitBranch,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectTechnicalsProps {
  project: any;
  user: any;
  onUpdate: () => void;
}

const ProjectTechnicals: React.FC<ProjectTechnicalsProps> = ({ project, user, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ 
    githubLink: project?.githubLink || '', 
    tags: project?.tags?.join(', ') || '' 
  });

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = editData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
      await axios.put('http://localhost:5001/api/projects/student/details', 
        { ...editData, tags: tagsArray },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      onUpdate();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black text-white font-outfit flex items-center gap-3">
          <Terminal className="text-brand-blue" size={24} />
          Repository & Infrastructure
        </h3>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-white transition-colors px-4 py-2 bg-brand-blue/5 rounded-xl border border-brand-blue/10 hover:border-brand-blue/30"
        >
          Manage Technicals
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         <motion.div 
           whileHover={{ y: -5 }}
           className="glass p-8 rounded-[2rem] flex flex-col justify-between group hover:border-brand-blue/30 transition-all border-white/5 bg-white/[0.01]"
         >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-brand-blue/10 transition-all shadow-inner">
                  <Code size={28} />
               </div>
               <div>
                  <h4 className="text-white font-bold text-lg">Source Ecosystem</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Version Control History</p>
               </div>
            </div>
            {project?.githubLink ? (
               <div className="space-y-4">
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:text-white text-sm font-medium flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group/link truncate"
                  >
                     <GitBranch size={16} className="text-slate-500 group-hover/link:text-brand-blue transition-colors" />
                     {project.githubLink.replace('https://github.com/', '')}
                     <ExternalLink size={14} className="ml-auto opacity-30" />
                  </a>
               </div>
            ) : (
               <button onClick={() => setIsEditModalOpen(true)} className="w-full py-4 text-slate-600 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-2xl hover:border-brand-blue/30 hover:text-brand-blue transition-all">
                  Initialize Repository Link
               </button>
            )}
         </motion.div>
      </div>

      {project?.tags?.length > 0 && (
         <div className="mt-8 flex flex-wrap gap-3">
            <div className="w-full flex items-center gap-3 mb-2 px-2">
               <Tag size={12} className="text-slate-500" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stack Architecture</span>
            </div>
            {project.tags.map((tag: string, i: number) => (
               <span key={i} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:border-brand-blue/30 transition-all cursor-default">
                  {tag}
               </span>
            ))}
         </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass bg-[#020617] p-10 rounded-[2.5rem] border-white/10 shadow-3xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white font-outfit tracking-tight">Project Technicals</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure Repository Infrastructure</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateDetails} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GitHub Link</label>
                  <div className="relative">
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="url" 
                      value={editData.githubLink}
                      onChange={e => setEditData({...editData, githubLink: e.target.value})}
                      placeholder="https://github.com/user/repo"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-blue/30 transition-all"
                    />
                  </div>
                </div>



                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Technologies (Comma separated)</label>
                   <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      value={editData.tags}
                      onChange={e => setEditData({...editData, tags: e.target.value})}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-blue/30 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectTechnicals;
