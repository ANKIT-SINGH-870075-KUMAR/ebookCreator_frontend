import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../Utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const WritersSection = () => {
    const { isAuthenticated, user } = useAuth();
    const [writers, setWriters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWriters = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_WRITERS);
                const limit = user?.role === 'viewer' ? 3 : 6;
                setWriters(response.data.slice(0, limit));
            } catch (error) {
                console.error("Failed to fetch writers");
            } finally {
                setIsLoading(false);
            }
        };
        fetchWriters();
    }, [user?.role]);

    if (isLoading) {
        return (
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="animate-pulse flex justify-center gap-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-72 h-56 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (writers.length === 0) return null;

    return (
        <div className="py-20 bg-gradient-to-b from-white via-violet-50 to-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full mb-4">
                        <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
                        <span className="text-sm font-semibold text-violet-900">Our Writers</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Discover Talented Writers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Subscribe to your favorite writers and get access to their exclusive eBooks
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {writers.map((writer) => (
                        <div 
                            key={writer._id} 
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 flex flex-col"
                        >
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
                                        <span className="text-xs text-green-600 font-medium">Basic Access</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Monthly</span>
                                        <span className="text-xs text-violet-600 font-medium">Full Access</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Yearly</span>
                                        <span className="text-xs text-violet-600 font-medium">Best Value</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-2">
                                <Link 
                                    to={isAuthenticated ? `/writer-profile/${writer._id}` : "/signup"}
                                    className="flex-1 text-center py-2.5 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                                >
                                    View Profile
                                </Link>
                                <Link 
                                    to={isAuthenticated ? "/writers" : "/signup"}
                                    className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-colors"
                                >
                                    Subscribe
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link 
                        to="/writers"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
                    >
                        <span>View All Writers</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WritersSection;