import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, BookOpen, Users, ChevronLeft, Star, Send } from "lucide-react";

const WriterProfilePage = () => {
    const { writerId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [writer, setWriter] = useState(null);
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [subscribingId, setSubscribingId] = useState(null);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (writerId) {
            fetchWriterData();
        }
    }, [writerId]);

    const fetchWriterData = async () => {
        setIsLoading(true);
        setError(null);
        
        if (!writerId) {
            setError("Invalid writer ID");
            navigate("/writers");
            return;
        }

        try {
            const writerRes = await axiosInstance.get(`${API_PATHS.USERS.GET_USER}/${writerId}`);
            
            if (!writerRes.data) {
                setError("Writer not found");
                toast.error("Writer not found");
                navigate("/writers");
                return;
            }

            if (writerRes.data.role !== 'writer') {
                setError("User is not a writer");
                toast.error("User is not a writer");
                navigate("/writers");
                return;
            }

            setWriter(writerRes.data);

            try {
                const booksRes = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOKS_BY_USER}/${writerId}`);
                setBooks(booksRes.data || []);
            } catch (booksErr) {
                console.error("Failed to fetch books:", booksErr);
                setBooks([]);
            }

            try {
                const subscriptionsRes = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_MY);
                const userSub = subscriptionsRes.data.find(sub => 
                    sub.writerId?._id === writerId || sub.writerId === writerId
                );
                if (userSub) {
                    setIsSubscribed(true);
                    setSubscription(userSub);
                }
            } catch (subErr) {
                console.error("Failed to fetch subscriptions:", subErr);
            }

            try {
                const countRes = await axiosInstance.get(`${API_PATHS.SUBSCRIPTIONS.GET_SUBSCRIBER_COUNT}/${writerId}/count`);
                setSubscriberCount(countRes.data.count || 0);
            } catch (countErr) {
                console.error("Failed to fetch subscriber count:", countErr);
                setSubscriberCount(0);
            }

            if (user?.role === 'viewer') {
                try {
                    const ratingRes = await axiosInstance.get(`${API_PATHS.REVIEWS.GET_RATING}/${writerId}/rating`);
                    setAverageRating(ratingRes.data.averageRating || 0);
                    setReviewCount(ratingRes.data.count || 0);
                } catch (ratingErr) {
                    console.error("Failed to fetch rating:", ratingErr);
                }

                try {
                    const reviewsRes = await axiosInstance.get(`${API_PATHS.REVIEWS.GET_BY_WRITER}/${writerId}`);
                    setReviews(reviewsRes.data || []);
                    const existingReview = reviewsRes.data.find(r => r.viewerId?._id === user._id);
                    if (existingReview) {
                        setUserReview(existingReview);
                        setReviewRating(existingReview.rating);
                        setReviewText(existingReview.review || "");
                    }
                } catch (reviewsErr) {
                    console.error("Failed to fetch reviews:", reviewsErr);
                }
            }

        } catch (error) {
            console.error("Error loading writer profile:", error);
            setError("Failed to load writer profile");
            toast.error("Failed to load writer profile");
            navigate("/writers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async (plan) => {
        setSubscribingId(plan);
        setIsSubscribed(true);
        setSubscriberCount(prev => prev + 1);
        try {
            await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.SUBSCRIBE, { writerId, plan });
            toast.success("Subscribed successfully!");
            fetchWriterData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to subscribe");
            setIsSubscribed(false);
            setSubscriberCount(prev => prev - 1);
        } finally {
            setSubscribingId(null);
        }
    };

const handleUnsubscribe = async () => {
        if (!subscription) return;
        setSubscribingId('unsubscribe');
        setIsSubscribed(false);
        setSubscriberCount(prev => prev - 1);
        try {
            await axiosInstance.delete(`${API_PATHS.SUBSCRIPTIONS.CANCEL}/${subscription._id}`);
            toast.success("Unsubscribed successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unsubscribe");
            fetchWriterData();
        } finally {
            setSubscribingId(null);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmittingReview(true);
        try {
            await axiosInstance.post(API_PATHS.REVIEWS.CREATE, {
                writerId,
                rating: reviewRating,
                review: reviewText
            });
            toast.success(userReview ? "Review updated!" : "Review submitted!");
            setShowReviewModal(false);
            fetchWriterData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

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

    if (error || !writer) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">{error || "Writer not found"}</p>
                        <Link to="/writers" className="text-violet-600 hover:underline">Back to Writers</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/writers")}
                        className="flex items-center gap-2 text-gray-600 hover:text-violet-600 mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to Writers</span>
                    </button>

                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-32"></div>
                        <div className="px-8 py-8">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                                {writer.avatar ? (
                                    <img 
                                        src={`${BASE_URL}/backend${writer.avatar}`.replace(/\\/g, "/")} 
                                        alt={writer.name}
                                        className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-500 border-4 border-white shadow-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-4xl">{getInitial(writer.name)}</span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900">{writer.name}</h1>
                                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {writer.email}
                                        </span>
                                        {writer.createdAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Joined {new Date(writer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {isSubscribed ? (
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Subscribed ({subscription?.plan})
                                            </div>
                                            <button
                                                onClick={handleUnsubscribe}
                                                disabled={subscribingId === 'unsubscribe'}
                                                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                                            >
                                                {subscribingId === 'unsubscribe' ? 'Unsubscribing...' : 'Unsubscribe'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSubscribe('free')}
                                                disabled={subscribingId}
                                                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                                            >
                                                {subscribingId ? 'Subscribing...' : 'Subscribe (Free)'}
                                            </button>
                                            <button
                                                onClick={() => handleSubscribe('monthly')}
                                                disabled={subscribingId}
                                                className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 disabled:opacity-50"
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => handleSubscribe('yearly')}
                                                disabled={subscribingId}
                                                className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 disabled:opacity-50"
                                            >
                                                Yearly
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <BookOpen className="w-6 h-6 text-violet-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                            <p className="text-sm text-gray-500">Books</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{subscriberCount}</p>
                            <p className="text-sm text-gray-500">Subscribers</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center cursor-pointer hover:bg-yellow-50" onClick={() => user?.role === 'viewer' && setShowReviewModal(true)}>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{averageRating > 0 ? averageRating : '-'}</p>
                            <p className="text-sm text-gray-500">Rating ({reviewCount})</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{books.filter(b => b.status === 'published').length}</p>
                            <p className="text-sm text-gray-500">Published</p>
                        </div>
                    </div>

                    {/* Write Review Button for Viewers */}
                    {user?.role === 'viewer' && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                            >
                                {userReview ? "Update My Review" : "Write a Review"}
                            </button>
                        </div>
                    )}

                    {/* Books Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Books by {writer.name}</h2>
                        
                        {books.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">No books published yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {books.map((book) => {
                                            const coverImageUrl = book.coverImage ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/") : "";
                                            return (
                                                <tr 
                                                    key={book._id}
                                                    onClick={() => navigate(`/view-book/${book._id}`)}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {coverImageUrl ? (
                                                                <img 
                                                                    src={coverImageUrl} 
                                                                    alt={book.title}
                                                                    className="w-10 h-14 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-14 bg-violet-100 rounded flex items-center justify-center">
                                                                    <BookOpen className="w-5 h-5 text-violet-500" />
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-gray-900">{book.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-600">{book.author}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {book.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button className="text-violet-600 hover:text-violet-800 text-sm font-medium">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {userReview ? "Update Review" : "Write a Review"}
                            </h3>
                            <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className={`p-1 ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review (optional)</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={4}
                                    placeholder="Share your experience with this writer..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400 mt-1">{reviewText.length}/500</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReview}
                                    className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                                >
                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default WriterProfilePage;