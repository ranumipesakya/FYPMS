import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { 
  User as UserIcon, 
  Hash, 
  Briefcase, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  FileText,
  Target,
  Cpu,
  Upload,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  FolderKanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SupervisorOption = {
  _id?: string;
  name: string;
  email: string;
};

const SUPERVISORS = [
  { name: "Ms. Maithri Chandima", email: "maithri@lecturer.nsbm.ac.lk" },
  { name: "Ms. Pavithra Subhashini", email: "pavithra@lecturer.nsbm.ac.lk" },
  { name: "Dr. Isuru Koswatte", email: "isuru@lecturer.nsbm.ac.lk" },
  { name: "Dr. Damayanthi Dahanayake", email: "damayanthi@lecturer.nsbm.ac.lk" },
  { name: "Ms. Thisarani Wickramasinghe", email: "thisarani@lecturer.nsbm.ac.lk" },
  { name: "Mr. Chamil Gunarathna", email: "chamil@lecturer.nsbm.ac.lk" },
  { name: "Ms. Lakni Peiris", email: "lakni@lecturer.nsbm.ac.lk" },
  { name: "Ms. Githmi Charundi Perera", email: "githmi@lecturer.nsbm.ac.lk" },
  { name: "Ms. Sanuli Weerasinghe", email: "sanuli@lecturer.nsbm.ac.lk" },
  { name: "Ms. Dharani Rajasinghe", email: "dharani@lecturer.nsbm.ac.lk" },
  { name: "Ms. Chathurma Wijesinghe", email: "chathurma@lecturer.nsbm.ac.lk" },
  { name: "Ms. Ashini Wanasinghe", email: "ashini@lecturer.nsbm.ac.lk" },
  { name: "Ms. Tharushi Attanayake", email: "tharushi@lecturer.nsbm.ac.lk" },
  { name: "Ms. Sachini Tharaka", email: "sachini@lecturer.nsbm.ac.lk" },
  { name: "Ms. Hiruni Weerasinghe", email: "hiruni@lecturer.nsbm.ac.lk" },
  { name: "Mr. Hasantha Dissanayake", email: "hasantha@lecturer.nsbm.ac.lk" },
  { name: "Ms. Hirushi Dilpriya", email: "hirushi@lecturer.nsbm.ac.lk" },
  { name: "Ms. Kushani Perera", email: "kushani@lecturer.nsbm.ac.lk" },
  { name: "Ms. Demini Rajapaksha", email: "demini@lecturer.nsbm.ac.lk" },
  { name: "Ms. Sandyani De Silva", email: "sandyani@lecturer.nsbm.ac.lk" },
  { name: "Ms. Madhavi Madushani", email: "madhavi@lecturer.nsbm.ac.lk" },
  { name: "Ms. Dulanjali Wijesekara", email: "dulanjali@lecturer.nsbm.ac.lk" },
  { name: "Ms. Shehani Joseph", email: "shehani@lecturer.nsbm.ac.lk" }
];

const STAGES = [
  { id: 1, title: 'Profile Setup', icon: UserIcon },
  { id: 2, title: 'Project Proposal', icon: FileText },
  { id: 3, title: 'Management', icon: TrendingUp }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentNumber: '',
    supervisor: '',
    projectTitle: '',
    description: '',
    objectives: '',
    techStack: '',
  });

  const [project, setProject] = useState<any>(null);
  const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);

  useEffect(() => {
    fetchProject();
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    // We already have the list in SUPERVISORS, but we can also fetch from DB to see if others exist
    try {
      const { data } = await axios.get<SupervisorOption[]>('http://localhost:5001/api/auth/supervisors');
      // Merge registered supervisors with the list
      const registeredEmails = data.map((d: any) => d.email);
      const allSupervisors = [...SUPERVISORS.filter(s => !registeredEmails.includes(s.email)), ...data];
      setSupervisors(registeredEmails.length > 0 ? allSupervisors : SUPERVISORS);
    } catch (err) {
      setSupervisors(SUPERVISORS);
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/projects/student', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (data) {
        setProject(data);
        setCurrentStep(3);
        setFormData(prev => ({
          ...prev,
          projectTitle: data.title,
          description: data.description,
          supervisor: data.supervisorId?.name || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      setIsLoading(true);
      try {
        const selectedSupervisor = supervisors.find((s) => s.email === formData.supervisor || s._id === formData.supervisor);
        const payload = {
          title: formData.projectTitle,
          description: formData.description,
          studentNumber: formData.studentNumber,
          supervisorId: selectedSupervisor?._id,
          supervisorEmail: selectedSupervisor?.email || formData.supervisor
        };

        const { data } = await axios.post('http://localhost:5001/api/projects', {
          ...payload
        }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });

        const createdProject = data?.project || data;

        if (selectedFile && createdProject?._id) {
          const form = new FormData();
          form.append('projectId', createdProject._id);
          form.append('type', 'proposal');
          form.append('version', 'v1');
          form.append('file', selectedFile);

          await axios.post('http://localhost:5001/api/projects/submissions/upload', form, {
            headers: { Authorization: `Bearer ${user?.token}` }
          });
        }

        setProject(createdProject);
        setCurrentStep(3);
      } catch (err) {
        console.error('Error creating project:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- RENDERING HELPERS ---

  const renderStepper = () => (
    <div className="flex items-center justify-center mb-16 gap-4 md:gap-12">
      {STAGES.map((stage, idx) => (
        <React.Fragment key={stage.id}>
          <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => stage.id < currentStep && setCurrentStep(stage.id)}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${currentStep >= stage.id ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-slate-500'}`}>
              <stage.icon size={24} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= stage.id ? 'text-white' : 'text-slate-600'}`}>{stage.title}</span>
          </div>
          {idx < STAGES.length - 1 && (
            <div className={`h-[2px] w-8 md:w-20 transition-all duration-1000 ${currentStep > stage.id ? 'bg-brand-blue shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-white/5'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 space-y-4">
          <label className="text-sm font-extrabold text-white uppercase tracking-[0.2em] block ml-2 font-outfit">1. Choose Your Supervisor</label>
          <div className="relative group/input">
            <Users size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 z-20 group-focus-within/input:text-brand-blue" />
            <select 
              required
              className="block w-full pl-14 pr-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 font-bold appearance-none cursor-pointer relative z-10 text-lg"
              value={formData.supervisor}
              onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
            >
              <option value="" className="bg-[#0f172a]">Select Supervisor...</option>
              {supervisors.map((s, idx) => <option key={idx} value={s.email} className="bg-[#0f172a]">{s.name}</option>)}
            </select>
            <ChevronRight size={24} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-blue rotate-90" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em] block ml-2 font-outfit">2. Full Name</label>
          <div className="relative group/input">
            <UserIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em] block ml-2 font-outfit">3. Student Number</label>
          <div className="relative group/input">
            <Hash size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder=" 00000" className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold" value={formData.studentNumber} onChange={(e) => setFormData({...formData, studentNumber: e.target.value})} />
          </div>
        </div>
      </div>
      <button onClick={handleNext} disabled={!formData.supervisor || !formData.studentNumber} className="w-full bg-brand-blue py-6 rounded-[30px] font-black text-2xl shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
        {isLoading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continue to Proposal <ChevronRight size={28} /></>}
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-white uppercase tracking-[0.2em] flex items-center gap-2 ml-2 font-outfit"><Briefcase size={18} /> Project Title</label>
          <input type="text" placeholder="Enter high-level title" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold text-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={formData.projectTitle} onChange={(e) => setFormData({...formData, projectTitle: e.target.value})} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-extrabold text-white uppercase tracking-[0.2em] flex items-center gap-2 ml-2 font-outfit"><Target size={18} /> Brief Description & Objectives</label>
          <textarea rows={4} placeholder="What problem are you solving? List your main goals..." className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-medium focus:ring-2 focus:ring-brand-blue/50 outline-none resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
             <label className="text-sm font-extrabold text-white uppercase tracking-[0.2em] flex items-center gap-2 ml-2 font-outfit"><Cpu size={18} /> Tech Stack</label>
             <input type="text" placeholder="React, Node.js, AI, etc." className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
           </div>
           <div className="space-y-3">
             <label className="text-sm font-extrabold text-white uppercase tracking-[0.2em] flex items-center gap-2 ml-2 font-outfit"><Upload size={18} /> Proposal PDF (Optional)</label>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf" 
                className="hidden" 
             />
             <div 
                onClick={triggerFileInput}
                className={`w-full px-6 py-5 border-2 border-dashed rounded-3xl flex items-center justify-center gap-3 cursor-pointer transition-all ${selectedFile ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-brand-blue/5 border-white/10 text-slate-400 hover:bg-brand-blue/10'}`}
             >
                {selectedFile ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-bold truncate max-w-[200px]">{selectedFile.name}</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} /> 
                    <span className="text-sm font-bold">Select PDF File</span>
                  </>
                )}
             </div>
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={handleBack} className="px-8 py-6 bg-white/5 hover:bg-white/10 rounded-[30px] font-black text-xl transition-all"><ChevronLeft size={28} /></button>
        <button onClick={handleNext} disabled={!formData.projectTitle} className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 py-6 rounded-[30px] font-black text-2xl shadow-2xl flex items-center justify-center gap-4 hover:shadow-brand-blue/30 transition-all active:scale-[0.98]">
           {isLoading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit Project Proposal <Sparkles size={24} /></>}
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
      {/* Active Management View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[40px] border border-brand-green/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 blur-3xl -z-10 animate-pulse"></div>
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h2 className="text-3xl font-black text-white mb-2 font-outfit">{project?.title || formData.projectTitle}</h2>
                   <div className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest ${project?.status === 'approved' ? 'text-brand-green' : project?.status === 'rejected' ? 'text-red-500' : 'text-brand-blue'}`}>
                      {project?.status === 'approved' ? <CheckCircle2 size={14} /> : project?.status === 'rejected' ? <AlertCircle size={14} /> : <Sparkles size={14} />}
                      {project?.status === 'approved' ? 'Proposal Approved' : project?.status === 'rejected' ? 'Proposal Rejected' : 'Proposal Submitted - Under Review'}
                   </div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-3">
                   <div className="w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center text-brand-blue"><TrendingUp size={20} /></div>
                   <span className="text-2xl font-black text-white">5%</span>
                </div>
             </div>

             <div className="space-y-3 mb-10">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-500">
                   <span>Initial Milestone</span>
                   <span>Review Pending</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full p-1 border border-white/10">
                   <div className="h-full bg-brand-green rounded-full w-[5%] shadow-[0_0_15px_rgba(0,166,81,0.5)] transition-all duration-1000"></div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button className="bg-brand-blue p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-blue/20"><FolderKanban size={18} /> View Reports</button>
                <button className="bg-white/5 border border-white/10 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10"><MessageSquare size={18} /> Chat with {formData.supervisor.split(' ')[1]}</button>
             </div>
          </div>

          <div className="glass p-8 rounded-[40px] border border-white/5">
             <h3 className="text-xl font-black text-white mb-8 font-outfit underline decoration-brand-blue decoration-4 underline-offset-8">Milestones</h3>
             <div className="space-y-6">
                {[
                  { label: 'Project Initiation', date: 'Today', status: 'completed' },
                  { label: 'Supervisor Approval', date: 'Pending', status: 'pending' },
                  { label: 'Proposal Defense', date: 'Next Week', status: 'pending' }
                ].map((m, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${m.status === 'completed' ? 'border-brand-green/20 bg-brand-green/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
                     <div className={m.status === 'completed' ? 'text-brand-green' : 'text-slate-600'}>
                        {m.status === 'completed' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold text-white mb-1">{m.label}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.date}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[40px] border border-white/5 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-brand-blue to-teal-400 rounded-3xl shadow-2xl flex items-center justify-center text-white mb-6 rotate-3">
                 <Users size={48} />
              </div>
              <h3 className="text-xl font-black text-white mb-1">{project?.supervisorId?.name || formData.supervisor}</h3>
              <p className="text-xs font-black text-brand-blue uppercase tracking-widest mb-6">Assigned Mentor</p>
              <div className="h-px w-full bg-white/10 mb-6"></div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                {project?.feedback || "Ready to review your proposal details. Please check the feedback once I approve the initial draft."}
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="pt-32 px-6 pb-20 max-w-6xl mx-auto min-h-screen text-slate-100 font-inter relative overflow-x-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full -z-10"></div>
      
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-5xl md:text-7xl font-black font-outfit text-white mb-6 tracking-tighter shadow-sm">
          FYP <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green italic">Navigation</span>
        </h1>
        <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
          {currentStep === 1 ? "Start by identifying yourself and your mentor." : 
           currentStep === 2 ? "Define the scope and technical vision of your research." : 
           "Monitor your progress and respond to feedback."}
        </p>
      </div>

      {renderStepper()}

      <div className="glass p-10 md:p-14 rounded-[70px] border border-white/5 shadow-3xl relative overflow-hidden min-h-[500px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue animate-pulse opacity-50"></div>
        
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </AnimatePresence>

        <p className="text-center mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
           Project Matrix &bull; V2.0 &bull; Faculty of Computing
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
