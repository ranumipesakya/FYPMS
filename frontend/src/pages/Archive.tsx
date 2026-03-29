import { 
    Search, 
    Filter, 
    Download, 
    Code, 
    Globe, 
    User,
    Library
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ArchiveItem {
    _id: string;
    type: string;
    fileUrl: string;
    originalFilename: string;
    createdAt: string;
    userId: { 
        _id: string; 
        name: string; 
        degree: string; 
        faculty: string; 
        avatar?: string;
        universityBatch: string;
    };
    projectId: { 
        _id: string; 
        title: string; 
        tags: string[]; 
        description: string;
        githubLink?: string;
        demoLink?: string;
    };
}

const Archive: React.FC = () => {
    const [items, setItems] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        fetchArchive();
    }, []);

    const fetchArchive = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/projects/archive');
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch archive');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.projectId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.projectId.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesType = selectedType === 'all' || item.type === selectedType;
        
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                <Library size={24} />
                            </div>
                            <span className="text-brand-blue text-[10px] font-black uppercase tracking-[0.3em] font-outfit">Open Intelligence Repository</span>
                        </div>
                        <h1 className="text-5xl font-black text-white font-outfit tracking-tighter leading-none mb-6">
                            PROJECT <span className="text-brand-blue">GALLERY /</span> ARCHIVE
                        </h1>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Explore the finest research contributions and project outcomes from the NSBM Final Year Project community. 
                            From technical architectures to academic dissertations.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by title, author, or tech stack..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <select 
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/50 outline-none transition-all appearance-none pr-12"
                            >
                                <option value="all" className="bg-[#020617]">All Milestone</option>
                                <option value="research_abstract" className="bg-[#020617]">Abstracts</option>
                                <option value="poster" className="bg-[#020617]">Posters</option>
                                <option value="final_report" className="bg-[#020617]">Dissertations</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-[400px] glass rounded-[2.5rem] animate-pulse" />)}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="glass rounded-[3rem] p-24 text-center border border-white/5">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <Search className="text-slate-600" size={40} />
                        </div>
                        <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-4 tracking-tighter">Repository Empty</h3>
                        <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                            No projects matched your current filtering criteria. Please adjust your search or selection.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, idx) => (
                            <motion.div 
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass rounded-[2.5rem] border border-white/5 hover:border-brand-blue/30 transition-all group overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-brand-blue/10"
                            >
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-brand-blue/20 capitalize">
                                            {item.type.replace('_', ' ')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.projectId.githubLink && (
                                                <a href={item.projectId.githubLink} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                                                    <Code size={18} />
                                                </a>
                                            )}
                                            {item.projectId.demoLink && (
                                                <a href={item.projectId.demoLink} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                                                    <Globe size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-brand-blue transition-colors line-clamp-2 leading-tight">
                                        {item.projectId.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {item.projectId.tags.map(tag => (
                                            <span key={tag} className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-3 mb-8">
                                        {item.projectId.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-brand-blue/30 transition-all">
                                                {item.userId.avatar ? (
                                                    <img src={`http://localhost:5001${item.userId.avatar}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={18} className="text-slate-500" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.userId.name}</span>
                                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{item.userId.universityBatch} • {item.userId.degree}</span>
                                            </div>
                                        </div>

                                        <a 
                                            href={`http://localhost:5001${item.fileUrl}`}
                                            download
                                            className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-lg shadow-brand-blue/10"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;
