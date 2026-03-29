import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { 
  Send, 
  User as UserIcon, 
  Search, 
  MoreVertical, 
  MessageSquare,
  Sparkles,
  ArrowBigLeftDash,
  Loader2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const SOCKET_URL = 'http://localhost:5001';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
    
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    
    if (user) {
      socket.emit('join_personal', user._id);
    }

    socket.on('receive_message_global', (data) => {
      fetchConversations();
    });

    socket.on('message_deleted_global', (deletedId) => {
      fetchConversations();
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socketRef.current) {
       socketRef.current.on('message_deleted', (deletedId: string) => {
          setMessages((prev) => prev.filter(m => m._id !== deletedId));
       });
    }

    return () => {
       socketRef.current?.off('message_deleted');
    };
  }, [selectedContact]);

  useEffect(() => {
    if (selectedContact && user) {
      const roomId = [user._id, selectedContact._id].sort().join('_');
      socketRef.current?.emit('join_chat', roomId);
      fetchHistory(selectedContact._id);
    }
  }, [selectedContact]);

  useEffect(() => {
    socketRef.current?.on('receive_message', (data) => {
      if (selectedContact && (data.senderId === selectedContact._id || data.senderId === user?._id)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socketRef.current?.off('receive_message');
    };
  }, [selectedContact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/chat/conversations', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setConversations(data);
      // Auto-select first conversation if none selected
      if (data.length > 0 && !selectedContact) {
        const first = data[0];
        setSelectedContact({
          _id: first._id,
          name: first.contactName,
          role: first.contactRole
        });
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/auth/users', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAllUsers(data.filter((u: any) => u._id !== user?._id));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startNewChat = (contact: any) => {
    setSelectedContact(contact);
    setSearchQuery('');
  };

  const fetchHistory = async (otherId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/chat/history/${otherId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMessages(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !user) return;

    const roomId = [user._id, selectedContact._id].sort().join('_');
    const messageData = {
      senderId: user._id,
      senderName: user.name,
      receiverId: selectedContact._id,
      message: newMessage,
      projectId: null,
      roomId,
      timestamp: new Date()
    };

    socketRef.current?.emit('send_message', messageData);
    setNewMessage('');
  };

  const deleteMessage = async (messageId: string) => {
    if (!user || !selectedContact) return;
    try {
      await axios.delete(`http://localhost:5001/api/chat/${messageId}`, {
         headers: { Authorization: `Bearer ${user.token}` }
      });

      const roomId = [user._id, selectedContact._id].sort().join('_');
      socketRef.current?.emit('delete_message', { 
         messageId, 
         roomId, 
         receiverId: selectedContact._id 
      });

      setMessages(messages.filter(m => m._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-6 min-h-screen bg-[#020617] h-screen flex flex-col">
       <div className="flex-1 max-w-7xl mx-auto w-full glass rounded-[2.5rem] overflow-hidden flex border-white/5 shadow-3xl">
          {/* Sidebar */}
          <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
             <div className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black text-white font-outfit tracking-tight">Messages</h2>
                   <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                      <Sparkles size={16} />
                   </div>
                </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                       type="text" 
                       placeholder="Find people..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white outline-none focus:border-brand-blue/40 transition-all font-medium"
                    />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {searchQuery ? (
                    <div className="space-y-2">
                       <p className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Search Results</p>
                       {filteredUsers.map((u) => (
                          <button 
                             key={u._id}
                             onClick={() => startNewChat(u)}
                             className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/[0.03] border border-transparent"
                          >
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <UserIcon size={16} />
                             </div>
                             <div className="text-left">
                                <div className="text-[11px] font-black text-white uppercase truncate">{u.name}</div>
                                <div className="text-[8px] text-slate-500 font-bold">{u.role}</div>
                             </div>
                          </button>
                       ))}
                    </div>
                 ) : (
                    <>
                       {conversations.length > 0 ? (
                          <>
                             <p className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Recent Conversations</p>
                             {conversations.map((conv) => (
                                <button 
                                   key={conv._id}
                                   onClick={() => setSelectedContact({ _id: conv._id, name: conv.contactName, role: conv.contactRole })}
                                   className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                                     selectedContact?._id === conv._id ? 'bg-brand-blue/10 border border-brand-blue/20' : 'hover:bg-white/[0.03] border border-transparent'
                                   }`}
                                >
                                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                      <UserIcon size={20} />
                                   </div>
                                   <div className="flex-1 text-left min-w-0">
                                      <div className="flex justify-between items-start mb-1">
                                         <span className="text-[11px] font-black text-white uppercase tracking-widest truncate">{conv.contactName}</span>
                                         <span className="text-[8px] text-slate-500 font-bold">{format(new Date(conv.lastMessageTime), 'HH:mm')}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 truncate font-medium">{conv.lastMessage}</p>
                                   </div>
                                </button>
                             ))}
                          </>
                       ) : null}

                       <p className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 mt-6">All Contacts</p>
                       {allUsers.length > 0 ? (
                          allUsers.map((u) => (
                             <button 
                                key={u._id}
                                onClick={() => startNewChat(u)}
                                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                                  selectedContact?._id === u._id && conversations.every(c => c._id !== u._id) ? 'bg-brand-blue/10 border border-brand-blue/20' : 'hover:bg-white/[0.03] border border-transparent'
                                }`}
                             >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 grayscale group-hover:grayscale-0 transition-all">
                                   <UserIcon size={16} />
                                </div>
                                <div className="text-left">
                                   <div className="text-[11px] font-black text-white uppercase truncate">{u.name}</div>
                                   <div className="text-[8px] text-slate-500 font-bold">{u.role}</div>
                                </div>
                             </button>
                          ))
                       ) : (
                          <div className="py-10 text-center px-4">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No contacts found.</p>
                          </div>
                       )}
                    </>
                 )}
              </div>
          </div>

          {/* Chat Area */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col relative overflow-hidden">
               {/* Chat Header */}
               <div className="p-6 border-b border-white/5 flex items-center justify-between glass z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                        <UserIcon size={24} />
                     </div>
                     <div>
                        <h3 className="text-white font-black text-lg font-outfit tracking-tight leading-none uppercase">{selectedContact.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                           <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{selectedContact.role} &bull; Academic Portal</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 text-slate-500 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                  </div>
               </div>

               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((msg, idx) => {
                    const isOwn = msg.senderId === user?._id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        key={msg._id || idx}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group/msg`}
                      >
                         <div className={`max-w-[70%] space-y-2 relative`}>
                            <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                              isOwn ? 'bg-brand-blue text-white rounded-tr-none' : 'glass text-slate-200 rounded-tl-none border-white/5'
                            }`}>
                               {msg.message}
                               {isOwn && (
                                  <button 
                                    onClick={() => deleteMessage(msg._id)}
                                    className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover/msg:opacity-100 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                               )}
                            </div>
                            <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                               {format(new Date(msg.createdAt || msg.timestamp), 'h:mm a')}
                               <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                               {isOwn ? 'Sent via Portal' : 'Official Response'}
                            </div>
                         </div>
                      </motion.div>
                    );
                  })}
                  <div ref={scrollRef} />
               </div>

               {/* Input */}
               <div className="p-6 border-t border-white/5">
                  <form onSubmit={sendMessage} className="flex gap-4 relative items-center">
                     <div className="flex-1 relative">
                        <input 
                           type="text" 
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           placeholder="Type a message to your mentor..."
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-7 pr-16 text-xs text-white outline-none focus:border-brand-blue/30 transition-all font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                           <button type="button" className="text-slate-500 hover:text-white transition-colors p-2"><Sparkles size={16} /></button>
                        </div>
                     </div>
                     <button 
                        type="submit"
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white p-5 rounded-2xl transition-all shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95"
                     >
                        <Send size={18} />
                     </button>
                  </form>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-20 text-center">
               <div className="max-w-md space-y-6">
                  <div className="w-24 h-24 bg-brand-blue/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-brand-blue">
                     <MessageSquare size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-white font-outfit tracking-tighter">Academic Messenger</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Select a conversation from the sidebar to start corresponding with your supervisor or students.</p>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default Chat;
