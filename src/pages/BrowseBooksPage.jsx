import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Book, Eye, Search, Filter, X, Star, MessageSquare } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../Utils/apiPaths";

const BrowseBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [writerFilter, setWriterFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [writers, setWriters] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_ALL_BOOKS);
        setBooks(response.data);
        
        const uniqueWriters = response.data
          .filter(book => book.userId?._id)
          .reduce((acc, book) => {
            const existing = acc.find(w => w._id === book.userId._id);
            if (!existing) acc.push(book.userId);
            return acc;
          }, []);
        setWriters(uniqueWriters);
      } catch (error) {
        toast.error("Failed to fetch eBooks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openReviewModal = async (book, e) => {
    e.stopPropagation();
    if (user?.role !== 'viewer') {
      toast.error("Only viewers can write reviews.");
      return;
    }
    setSelectedBook(book);
    setShowReviewModal(true);
    
    try {
      const reviewRes = await axiosInstance.get(`${API_PATHS.BOOK_REVIEWS.GET_MY}/${book._id}/my`);
      if (reviewRes.data) {
        setUserReview(reviewRes.data);
        setReviewRating(reviewRes.data.rating);
        setReviewText(reviewRes.data.review || "");
      } else {
        setUserReview(null);
        setReviewRating(5);
        setReviewText("");
      }
    } catch (err) {
      setUserReview(null);
      setReviewRating(5);
      setReviewText("");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    setIsSubmittingReview(true);
    try {
      await axiosInstance.post(API_PATHS.BOOK_REVIEWS.CREATE, {
        bookId: selectedBook._id,
        rating: reviewRating,
        review: reviewText
      });
      toast.success(userReview ? "Review updated!" : "Review submitted!");
      
      const updatedBooks = books.map(b => {
        if (b._id === selectedBook._id) {
          const newCount = (b.ratingCount || 0) + (userReview ? 0 : 1);
          const newAvg = userReview 
            ? ((b.averageRating || 0) * (b.ratingCount || 1) + reviewRating - userReview.rating) / (b.ratingCount || 1)
            : ((b.averageRating || 0) * (b.ratingCount || 0) + reviewRating) / (newCount || 1);
          return {
            ...b,
            averageRating: newAvg.toFixed(1),
            ratingCount: newCount
          };
        }
        return b;
      });
      setBooks(updatedBooks);
      
      setShowReviewModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      searchQuery === "" ||
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    
    const matchesWriter = writerFilter === "all" || book.userId?._id === writerFilter;
    
    return matchesSearch && matchesStatus && matchesWriter;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setWriterFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || writerFilter !== "all";

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-slate-900">Browse All eBooks</h1>
          <p className="text-[13px] text-slate-600 mt-1">
            Explore eBooks created by all writers on the platform.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or writer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                showFilters || hasActiveFilters
                  ? "bg-violet-50 border-violet-300 text-violet-700"
                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                  {(searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (writerFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Writer:</span>
                <select
                  value={writerFilter}
                  onChange={(e) => setWriterFilter(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                >
                  <option value="all">All Writers</option>
                  {writers.map((writer) => (
                    <option key={writer._id} value={writer._id}>
                      {writer.name}
                    </option>
                  ))}
                </select>

                <span className="text-sm font-medium text-gray-600 ml-4">Status:</span>
                {["all", "draft", "published"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      statusFilter === status
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredBooks.length} of {books.length} books
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="w-full aspect-[16/25] bg-slate-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {hasActiveFilters ? "No matching eBooks found" : "No eBooks available"}
            </h3>
            <p className="text-slate-500 max-w-md">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria."
                : "There are no eBooks available yet. Check back later for new content."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const coverImageUrl = book.coverImage
                ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/")
                : "";
              return (
                <div
                  key={book._id}
                  className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/view-book/${book._id}`)}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={coverImageUrl}
                      alt={book.title}
                      className="w-full aspect-[16/25] object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = ""; }}
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-2">
                        {user?.role === 'viewer' && (
                          <button
                            onClick={(e) => openReviewModal(book, e)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                          </button>
                        )}
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <Eye className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-xs"></div>
                    <div className="relative">
                      <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-[13px] text-gray-300 font-medium">
                        {book.author}
                      </p>
                      {book.userId?.name && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          by {book.userId.name}
                        </p>
                      )}
                      {(book.averageRating > 0 || book.ratingCount > 0) && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-[11px] text-gray-300">
                            {book.averageRating || '-'} ({book.ratingCount || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        )}
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
            
            {selectedBook && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedBook.title}</p>
                <p className="text-sm text-gray-500">by {selectedBook.author}</p>
              </div>
            )}
            
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
                  placeholder="Share your thoughts about this book..."
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
    </DashboardLayout>
  );
};

export default BrowseBooksPage;
