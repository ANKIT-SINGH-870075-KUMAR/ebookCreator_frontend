import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { Mail, Trash2, Check, BookOpen, User, ChevronRight } from "lucide-react";

const InboxPage = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INBOX.GET_MESSAGES);
            setMessages(response.data);
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            await axiosInstance.put(`${API_PATHS.INBOX.MARK_READ}/${messageId}/read`);
            setMessages(messages.map(msg => 
                msg._id === messageId ? { ...msg, isRead: true } : msg
            ));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleDelete = async (messageId) => {
        try {
            await axiosInstance.delete(`${API_PATHS.INBOX.DELETE}/${messageId}`);
            setMessages(messages.filter(msg => msg._id !== messageId));
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'book': return <BookOpen className="w-5 h-5" />;
            case 'subscription': return <User className="w-5 h-5" />;
            default: return <Mail className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'book': return 'bg-blue-100 text-blue-600';
            case 'subscription': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                            <p className="text-gray-600 mt-1">Your messages and notifications</p>
                        </div>
                        <span className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                            {messages.filter(m => !m.isRead).length} unread
                        </span>
                    </div>

                    {messages.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500">Your inbox is empty</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {messages.map((message) => (
                                <div 
                                    key={message._id}
                                    className={`flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!message.isRead ? 'bg-violet-50/50' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(message.type)}`}>
                                        {getTypeIcon(message.type)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {message.senderId?.name || 'Unknown'}
                                            </span>
                                            {!message.isRead && (
                                                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 truncate">{message.subject}</p>
                                        <p className="text-sm text-gray-500 truncate">{message.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(message.createdAt)}</p>
                                    </div>

                                    {message.bookId && (
                                        <button
                                            onClick={() => navigate(`/view-book/${message.bookId._id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            View Book
                                        </button>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {!message.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(message._id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(message._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InboxPage;