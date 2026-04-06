import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const WritersPage = () => {
    const [writers, setWriters] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [subscribingId, setSubscribingId] = useState(null);

    useEffect(() => {
        fetchWriters();
        fetchSubscriptions();
    }, []);

    const fetchWriters = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_WRITERS);
            setWriters(response.data);
        } catch (error) {
            toast.error("Failed to fetch writers");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_MY);
            setSubscriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch subscriptions");
        }
    };

    const handleSubscribe = async (writerId, plan = 'free') => {
        setSubscribingId(writerId);
        try {
            await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.SUBSCRIBE, { writerId, plan });
            toast.success("Subscribed successfully!");
            fetchSubscriptions();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to subscribe");
        } finally {
            setSubscribingId(null);
        }
    };

    const handleUnsubscribe = async (subscriptionId) => {
        setSubscribingId(subscriptionId);
        try {
            await axiosInstance.delete(`${API_PATHS.SUBSCRIPTIONS.CANCEL}/${subscriptionId}`);
            toast.success("Unsubscribed successfully!");
            fetchSubscriptions();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unsubscribe");
        } finally {
            setSubscribingId(null);
        }
    };

    const isSubscribed = (writerId) => {
        return subscriptions.some(sub => 
            sub.writerId?._id === writerId || sub.writerId === writerId
        );
    };

    const getSubscription = (writerId) => {
        return subscriptions.find(sub => 
            sub.writerId?._id === writerId || sub.writerId === writerId
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Writers</h1>
                        <p className="text-gray-600">Subscribe to your favorite writers to access their eBooks</p>
                    </div>

                    {writers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No writers found</p>
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {writers.map((writer) => {
                            const subscribed = isSubscribed(writer._id);
                            const writerSub = getSubscription(writer._id);

                            return (
                                <div key={writer._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        {writer.avatar ? (
                                            <img 
                                                src={`${BASE_URL}/backend${writer.avatar}`.replace(/\\/g, "/")} 
                                                alt={writer.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-xl">
                                                    {writer.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{writer.name}</h3>
                                            <p className="text-sm text-gray-500">{writer.email}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-xs text-gray-500 mb-3 font-medium">Subscription Plans</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                                                <span className="text-sm font-medium text-gray-700">Free</span>
                                                <span className="text-xs text-green-600 font-medium">Basic</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                                                <span className="text-sm font-medium text-gray-700">Monthly</span>
                                                <span className="text-xs text-violet-600 font-medium">Full</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                                                <span className="text-sm font-medium text-gray-700">Yearly</span>
                                                <span className="text-xs text-violet-600 font-medium">Best Value</span>
                                            </div>
                                        </div>
                                    </div>

                                    {subscribed && writerSub ? (
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 text-lg">✓</span>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-sm font-bold text-green-800">Subscribed</span>
                                                    <p className="text-xs text-green-600 capitalize">Current Plan: {writerSub.plan}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSubscribe(writer._id, writerSub.plan === 'free' ? 'monthly' : 'yearly')}
                                                disabled={subscribingId === writer._id}
                                                className="w-full py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {subscribingId === writer._id ? 'Updating...' : `Upgrade to ${writerSub.plan === 'free' ? 'Monthly' : 'Yearly'}`}
                                            </button>
                                            <button
                                                onClick={() => handleUnsubscribe(writerSub._id)}
                                                disabled={subscribingId === writerSub._id}
                                                className="w-full py-2.5 text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {subscribingId === writerSub._id ? 'Unsubscribing...' : 'Unsubscribe'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 mb-4">
                                            <button
                                                onClick={() => handleSubscribe(writer._id, 'free')}
                                                disabled={subscribingId === writer._id}
                                                className="w-full py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {subscribingId === writer._id ? 'Subscribing...' : 'Subscribe (Free)'}
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSubscribe(writer._id, 'monthly')}
                                                    disabled={subscribingId === writer._id}
                                                    className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    Monthly
                                                </button>
                                                <button
                                                    onClick={() => handleSubscribe(writer._id, 'yearly')}
                                                    disabled={subscribingId === writer._id}
                                                    className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    Yearly
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <Link 
                                        to={`/writer-profile/${writer._id}`}
                                        className="w-full py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center block"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default WritersPage;