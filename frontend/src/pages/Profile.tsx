import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Users, 
  BookOpen, 
  Building2,
  Save,
  Edit2,
  ArrowLeft
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const GraduationCap = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const Profile: React.FC = () => {
    const { user, login } = useAuth();
    const { edit } = useParams<{ edit?: string }>();
    const isEditing = edit === 'edit';
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        birthday: user?.birthday || '',
        nicOrPassport: user?.nicOrPassport || '',
        gender: user?.gender || 'Male',
        universityBatch: user?.universityBatch || '',
        degree: user?.degree || '',
        faculty: user?.faculty || ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                login({ ...user, ...data } as any);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setTimeout(() => navigate('/profile'), 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-[#0A0C10]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white font-outfit tracking-tight">
                            {isEditing ? 'EDIT' : 'VIEW'} <span className="text-brand-blue">PROFILE</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                           {isEditing ? 'Update your institutional records' : 'Your professional identity'}
                        </p>
                    </div>
                    {isEditing ? (
                        <button 
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                        >
                            <ArrowLeft size={14} /> Back to View
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/profile/edit')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-blue/20"
                        >
                            <Edit2 size={14} /> Edit Profile
                        </button>
                    )}
                </div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            message.type === 'success' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Panel - Summary */}
                    <div className="md:col-span-1">
                        <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mb-6 border-2 border-brand-blue/20">
                                <User size={40} className="text-brand-blue" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">{user?.name}</h2>
                            <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest mt-1">{user?.role}</p>
                            
                            <div className="w-full h-px bg-white/5 my-6"></div>
                            
                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3">
                                    <Mail size={14} className="text-slate-500" />
                                    <span className="text-slate-400 text-[10px] font-bold truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={14} className="text-slate-500" />
                                    <span className="text-slate-400 text-[10px] font-bold">{user?.phoneNumber || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form / Details */}
                    <div className="md:col-span-2">
                        <div className="glass rounded-3xl p-8 border border-white/5">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <User size={12} /> Full Name
                                        </label>
                                        <input 
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Email - Disabled always */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Mail size={12} /> Institutional Email
                                        </label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            disabled={true}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={12} /> Phone Number
                                        </label>
                                        <input 
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="+94 XX XXX XXXX"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Birthday */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Date of Birth
                                        </label>
                                        <input 
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* NIC / Passport */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard size={12} /> NIC / Passport
                                        </label>
                                        <input 
                                            type="text"
                                            name="nicOrPassport"
                                            value={formData.nicOrPassport}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="National Identity Card Number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={12} /> Gender
                                        </label>
                                        <select 
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                        >
                                            <option value="Male" className="bg-[#0A0C10]">Male</option>
                                            <option value="Female" className="bg-[#0A0C10]">Female</option>
                                            <option value="Other" className="bg-[#0A0C10]">Other</option>
                                        </select>
                                    </div>

                                    {/* University Batch */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <BookOpen size={12} /> University Batch
                                        </label>
                                        <input 
                                            type="text"
                                            name="universityBatch"
                                            value={formData.universityBatch}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="e.g. 21.1, 22.2"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Degree */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <GraduationCap size={12} className="text-slate-500" /> Degree Program
                                        </label>
                                        <input 
                                            type="text"
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="e.g. Software Engineering"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Faculty */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Building2 size={12} /> Faculty
                                        </label>
                                        <input 
                                            type="text"
                                            name="faculty"
                                            value={formData.faculty}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="e.g. School of Computing"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="bg-brand-blue hover:bg-brand-blue/90 text-white px-12 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-blue/20 flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : (
                                                <>
                                                    <Save size={16} /> Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
