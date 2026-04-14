import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";
import { Edit, Trash2, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const BookCard = ({book, onDelete, onSchedule}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === 'writer' || user?.role === 'superadmin';
  const coverImageUrl = book.coverImage ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g,"/") : "";

  const getStatusBadge = () => {
    if (book.status === 'published') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Published</span>;
    }
    if (book.status === 'scheduled') {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Scheduled</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Draft</span>;
  };

  return (
    <div
     className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 cursor-pointer"
     onClick={()=> navigate(`/view-book/${book._id}`)}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img src={coverImageUrl} alt={book.title} className="w-full aspect-[16/25] object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) =>{e.target.src = ""}}/>
        {canEdit && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            {onSchedule && book.status !== 'published' && (
              <button
                onClick={(e)=> {
                  e.stopPropagation();
                  onSchedule(book);
                }} 
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors cursor-pointer"
                title={book.status === 'scheduled' ? "Cancel Schedule" : "Schedule Publication"}
              >
                <Calendar className={`w-4 h-4 ${book.status === 'scheduled' ? 'text-red-600' : 'text-blue-600'}`} />
              </button>
            )}
            <button
              onClick={(e)=> {
                e.stopPropagation();
                navigate(`/editor/${book._id}`);
              }} 
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>
            {onDelete && (
              <button
                onClick={(e)=> {
                  e.stopPropagation();
                  onDelete(book._id);
                }} 
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors group/delete cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-block/80 to-transparent backdrop-blur-xs"></div>
        <div className="relative">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-[13px] text-gray-300 font-medium">
            {book.author}
          </p>
          {book.category && (
            <p className="text-[11px] text-gray-400 mt-1">
              {book.category}
            </p>
          )}
          {book.series && (
            <p className="text-[11px] text-violet-300 mt-0.5">
              Series: {book.series} {book.seriesOrder ? `(#${book.seriesOrder})` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r  from-orange-500 via-amber-500 to-rose-500 opacity-0 group-hover:opacity-100  transition-opacity duration-300" />
    </div>
  )
}

export default BookCard 