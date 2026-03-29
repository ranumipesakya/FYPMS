import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Clock, 
    Plus, 
    Trash2, 
    Save, 
    Calendar as CalendarIcon,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface AvailabilityRule {
    day: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
}

const AvailabilityManager: React.FC = () => {
    const [rules, setRules] = useState<AvailabilityRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/projects/availability/me'); // I'll add a 'me' route or use /availability/:id
            // Wait, I need a /availability/me route for supervisors. I'll add it.
            setRules(data);
        } catch (error) {
            console.error('Failed to fetch availability');
        } finally {
            setLoading(false);
        }
    };

    const addRule = () => {
        setRules([...rules, { day: 'monday', startTime: '09:00', endTime: '12:00', slotDuration: 30 }]);
    };

    const removeRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    const updateRule = (index: number, field: string, value: any) => {
        const newRules = [...rules];
        (newRules[index] as any)[field] = value;
        setRules(newRules);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('http://localhost:5001/api/projects/availability', { availability: rules });
            setMessage('Availability saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save availability');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="glass rounded-[2rem] border border-white/10 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Office Hours Availability</h3>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Set your recurring weekly schedule for student meetings</p>
                </div>
                <button 
                    onClick={addRule}
                    className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2 border border-brand-blue/20"
                >
                    <Plus size={14} /> Add Slot
                </button>
            </div>

            <div className="space-y-4 mb-8">
                {rules.map((rule, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                    >
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-2">Working Day</label>
                            <select 
                                value={rule.day}
                                onChange={(e) => updateRule(idx, 'day', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-[11px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-brand-blue/30 outline-none"
                            >
                                {DAYS.map(d => <option key={d} value={d} className="bg-[#020617]">{d}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-2">Start Time</label>
                            <input 
                                type="time"
                                value={rule.startTime}
                                onChange={(e) => updateRule(idx, 'startTime', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-[11px] font-bold outline-none"
                            />
                        </div>

                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-2">End Time</label>
                            <input 
                                type="time"
                                value={rule.endTime}
                                onChange={(e) => updateRule(idx, 'endTime', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-[11px] font-bold outline-none"
                            />
                        </div>

                        <div className="flex-1 min-w-[100px]">
                            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-2">Duration (min)</label>
                            <select 
                                value={rule.slotDuration}
                                onChange={(e) => updateRule(idx, 'slotDuration', parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-[11px] font-bold outline-none"
                            >
                                {[15, 30, 45, 60].map(v => <option key={v} value={v} className="bg-[#020617]">{v} min</option>)}
                            </select>
                        </div>

                        <button 
                            onClick={() => removeRule(idx)}
                            className="bg-red-500/10 text-red-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 mt-4 md:mt-0"
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}

                {rules.length === 0 && !loading && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                        <Clock className="mx-auto text-slate-600 mb-4" size={32} />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No availability rules defined yet</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    {message && (
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            <CheckCircle2 size={14} /> {message}
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-blue text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    <Save size={16} /> {saving ? 'Saving...' : 'Publish Schedule'}
                </button>
            </div>
        </div>
    );
};

export default AvailabilityManager;
