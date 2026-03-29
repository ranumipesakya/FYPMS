import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar as CalendarIcon, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleMeetingProps {
    supervisorId: string;
    supervisorName: string;
}

const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ supervisorId, supervisorName }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (supervisorId) {
            fetchSlots();
        }
    }, [selectedDate, supervisorId]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5001/api/projects/availability/slots?supervisorId=${supervisorId}&date=${selectedDate}`);
            setSlots(data);
        } catch (error) {
            console.error('Failed to fetch slots');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (time: string) => {
        setBooking(true);
        try {
            // I'll need a route to book a specific slot. I'll add 'createMeeting' or similar.
            // For now, I'll use a new POST /api/projects/meetings/book
            await axios.post('http://localhost:5001/api/projects/meetings/book', {
                supervisorId,
                date: selectedDate,
                time,
                agenda: 'Student Booked Session'
            });
            setMessage(`Meeting confirmed for ${selectedDate} at ${time}`);
            fetchSlots();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-brand-blue/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <CalendarIcon size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase tracking-tight text-sm">Schedule Session</h4>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">With {supervisorName}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Select Consultation Date</label>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-[11px] font-black uppercase focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Available Time Slots</label>
                        <div className="grid grid-cols-3 gap-2">
                            {loading ? (
                                [1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
                            ) : slots.length === 0 ? (
                                <div className="col-span-3 text-center py-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">No available slots for this date</p>
                                </div>
                            ) : (
                                slots.map(time => (
                                    <button 
                                        key={time}
                                        onClick={() => handleBook(time)}
                                        disabled={booking}
                                        className="bg-white/5 border border-white/10 rounded-xl py-3 text-[10px] font-black text-white hover:bg-brand-blue hover:border-brand-blue transition-all group"
                                    >
                                        {time}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${message.includes('confirmed') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                        >
                            {message.includes('confirmed') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {message}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
