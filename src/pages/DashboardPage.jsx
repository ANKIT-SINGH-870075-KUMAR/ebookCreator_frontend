import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book, ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";

// Skeleton Loader for Book Card
const BookCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="w-full aspect-[16/25] bg-slate-200 rounded-t-lg"></div>
      <div className="p-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

const ConfirmationModal  = ({ isOpen, onClose, onConfirm, title, message }) =>{
  if(!isOpen) return null;

  return(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50 bg-opacity-25 transition-opacity"
        onClick={onClose}
        ></div>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [writerData, setWriterData] = useState(null);
  const [transferRequests, setTransferRequests] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { writerId } = useParams();

  useEffect(() => {
    const fetchData = async () =>{
      try {
        if (writerId) {
          const [booksRes, userRes] = await Promise.all([
            axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOKS_BY_USER}/${writerId}`),
            axiosInstance.get(`${API_PATHS.USERS.GET_USER}/${writerId}`)
          ]);
          setBooks(booksRes.data);
          setWriterData(userRes.data);
        } else {
          const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
          setBooks(response.data);
        }
        
        if (user?.role === 'writer') {
          const transferRes = await axiosInstance.get(API_PATHS.TRANSFER.GET_MY);
          setTransferRequests(transferRes.data.filter(r => r.status === 'pending'));
        }
      } catch (error) {
        toast.error("Failed to fetch your eBooks.");
      } finally{
        setIsLoading(false);
      }
    };

    fetchData();
  },[writerId, user?.role]);

  const handleDeleteBook = async() =>{
     if(!bookToDelete) return;
     try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`);
      setBooks(books.filter((book) => book._id !== bookToDelete));
      toast.success("eBook deleted successfully.");
     } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete the eBook.");
     } finally{
      setBookToDelete(null);
     }

  };

  const handleCreateBookClick = () => {
   setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    console.log("DEBUG - DashboardPage handleBookCreated called with:", bookId);
setIsCreateModalOpen(false);
navigate(`/editor/${bookId}`);
  };

  const handleTransferResponse = async (requestId, action) => {
    try {
      const response = await axiosInstance.put(`${API_PATHS.TRANSFER.RESPOND}/${requestId}/respond`, { action });
      toast.success(action === 'accepted' ? "Transfer accepted!" : "Transfer rejected");
      setTransferRequests(transferRequests.filter(r => r._id !== requestId));
    } catch (error) {
      console.log("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to respond to transfer request.");
    }
  };



  return (
    <DashboardLayout showWriterView={!!writerId} writerName={writerData?.name} writerEmail={writerData?.email}>
      <div className="container mx-auto p-6">
        {/* Transfer Requests Banner for Writers */}
        {user?.role === 'writer' && transferRequests.length > 0 && (
          <div className="mb-6 bg-violet-50 border border-violet-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-violet-900 mb-3">Transfer Requests</h3>
            {transferRequests.map((request) => {
              const coverImageUrl = request.bookId?.coverImage ? `${BASE_URL}/backend${request.bookId.coverImage}`.replace(/\\/g, "/") : "";
              return (
                <div key={request._id} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-3">
                    {coverImageUrl ? (
                      <img src={coverImageUrl} alt="" className="w-10 h-14 object-cover rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-10 h-14 bg-violet-200 rounded flex items-center justify-center">
                        <Book className="w-5 h-5 text-violet-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.bookId?.title || 'Unknown Book'}</p>
                      <p className="text-xs text-gray-500">From: {request.fromUserId?.name || 'Admin'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTransferResponse(request._id, 'accepted')}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleTransferResponse(request._id, 'rejected')}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                {writerId && writerData ? `${writerData.name}'s eBooks` : "All eBooks"}
              </h1>
            </div>
            <p className="text-[13px] text-slate-600 mt-1">
              {(user?.role === 'writer' || user?.role === 'superadmin')
                ? "Create, edit, and manage all your AI-generated eBooks."
                : "Browse and read all available eBooks."}
            </p>
          </div>
          {!writerId && (user?.role === 'writer' || user?.role === 'superadmin') && (
            <Button
            className="whitespace-nowrap"
            onClick={handleCreateBookClick}
            icon={Plus}
            >
              Create New eBook
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3xl xl:grid-cols-4 gap-6">
            {Array.from({ length: 4}).map((_, i) =>(
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No eBooks found.
            </h3>
            <p className="text-slate-500 mb-6 max-w-md">
              {(user?.role === 'writer' || user?.role === 'superadmin')
                ? "You haven't created any eBooks yet. Get started by creating your first one."
                : "No eBooks are available yet. Check back later."}
            </p>
            {(user?.role === 'writer' || user?.role === 'superadmin') && (
              <Button onClick={handleCreateBookClick} icon={Plus}>
                Create Your First eBook
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Book here */}
            {books.map((book)=>(
              <BookCard
                key={book._id}
                book={book}
                onDelete = {(user?.role === 'writer' || user?.role === 'superadmin') ? () => setBookToDelete(book._id) : undefined}
                />
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={!!bookToDelete}
          onClose ={() => setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          title="Delete eBook"
          message="Are you sure you want to delete this eBook? This action cannot be undone."
        />

        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreated={handleBookCreated}
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
