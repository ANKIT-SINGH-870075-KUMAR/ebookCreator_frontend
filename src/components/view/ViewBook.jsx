import { useState, useEffect } from "react";
import { ChevronLeft, Menu, Volume2, MessageSquare, Star, Globe } from "lucide-react";
import ViewChapterSidebar from "./ViewChapterSidebar";
import TextToSpeech from "../ui/TextToSpeech";
import Cheatsheet from "../editor/Cheatsheet";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ViewBook = ({book, reviews = []}) => {
    const { user } = useAuth();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [showTTS, setShowTTS] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [selectionInfo, setSelectionInfo] = useState(null);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [manualText, setManualText] = useState("");
    const [noteText, setNoteText] = useState("");
    const [localBook, setLocalBook] = useState(() => JSON.parse(JSON.stringify(book)));
    const [translatedContent, setTranslatedContent] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);

    const watermarkText = user?.name || user?.email || user?._id || "Reader";

    useEffect(() => {
        setLocalBook(JSON.parse(JSON.stringify(book)));
    }, [book]);

    const selectedChapter = localBook.chapters[selectedChapterIndex];

    const handleTextSelect = (text, info) => {
        setSelectedText(text);
        setSelectionInfo(info);
        setManualText(text);
        setShowCommentInput(true);
    };

    const openCommentPanel = () => {
        setShowCommentInput(true);
        setSelectedText("");
        setManualText("");
        setNoteText("");
    };

    const handleAddComment = (comment) => {
        const textToUse = comment.selectedText || manualText;
        if (!textToUse) return;
        
        const updatedChapters = localBook.chapters.map((chapter, index) => {
            if (index === selectedChapterIndex) {
                const existingComments = chapter.comments || [];
                return {
                    ...chapter,
                    comments: [...existingComments, {
                        text: comment.text || "",
                        selectedText: textToUse,
                        type: comment.type || 'text',
                        userName: "Reader",
                        createdAt: new Date()
                    }]
                };
            }
            return chapter;
        });
        setLocalBook({ ...localBook, chapters: updatedChapters });
        setShowCommentInput(false);
        setSelectedText("");
        setManualText("");
        setNoteText("");
    };

    const handleDeleteComment = (commentIndex) => {
        const updatedChapters = localBook.chapters.map((chapter, index) => {
            if (index === selectedChapterIndex) {
                const existingComments = chapter.comments || [];
                return {
                    ...chapter,
                    comments: existingComments.filter((_, i) => i !== commentIndex)
                };
            }
            return chapter;
        });
        setLocalBook({ ...localBook, chapters: updatedChapters });
    };

    const getHighlightColor = (index) => {
        const colors = [
            '#fef3c7', '#dbeafe', '#d1fae5', '#fce7f3', '#e0e7ff', '#ffedd5', '#f3e8ff', '#fee2e2',
        ];
        return colors[index % colors.length];
    };

    const handleTranslate = async (targetLang) => {
        if (translatedContent[selectedChapterIndex] && translatedContent[selectedChapterIndex] === targetLang) {
            return;
        }
        
        setIsTranslating(true);
        try {
            const response = await axiosInstance.post(API_PATHS.AI.TRANSLATE, {
                text: selectedChapter.content,
                targetLanguage: targetLang,
                sourceLanguage: 'auto'
            });
            
            setTranslatedContent(prev => ({
                ...prev,
                [selectedChapterIndex]: {
                    lang: targetLang,
                    content: response.data.translatedText
                }
            }));
            toast.success(`Translated to ${targetLang === 'Hindi' ? 'Hindi' : 'English'}!`);
        } catch (error) {
            toast.error("Translation failed");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleTranslateToggle = () => {
        const current = translatedContent[selectedChapterIndex];
        if (current) {
            const newState = { ...translatedContent };
            delete newState[selectedChapterIndex];
            setTranslatedContent(newState);
        } else {
            handleTranslate('Hindi');
        }
    };

    const formatContent = (content, comments = []) => {
        const paragraphs = content.split('\n\n').filter(paragraph => paragraph.trim());
        
        return paragraphs.map((paragraph, pIndex) => {
            let formatted = paragraph;
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '<em>$1</em>');
            
            if (comments && comments.length > 0) {
                comments.forEach((comment, index) => {
                    if (comment.selectedText) {
                        const color = getHighlightColor(index);
                        const escapedText = comment.selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(${escapedText})`, 'gi');
                        const tooltipContent = `${comment.text} - ${comment.userName}`;
                        formatted = formatted.replace(regex, 
                            `<span class="highlighted-text" style="background-color: ${color}; padding: 1px 3px; border-radius: 2px; cursor: help;" title="${tooltipContent}">$1</span>`
                        );
                    }
                });
            }
            return `<p>${formatted}</p>`;
        }).join('');
    };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white text-gray-900">
      <ViewChapterSidebar
        book={localBook}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapter={setSelectedChapterIndex}
        isOpen={sidebarOpen}
        onclose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button onClick={()=> setSidebarOpen(true)}
               className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
               </button>
               <div>
                 <h1 className="font-semibold text-base md:text-lg truncate">{localBook.title}</h1>
                 <p className="text-sm text-gray-500">by {localBook.author}</p>
               </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                 <button 
                  onClick={()=> setFontSize(Math.max(14, fontSize - 2))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-bold"
                 >
                   A-
                 </button>
                 <span className="text-sm text-gray-500">{fontSize}px</span>
                 <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg font-bold"
                 >
                   A+
                 </button>
              </div>
              
              <button
                onClick={() => setShowTTS(!showTTS)}
                className={`p-2 rounded-lg transition-colors ${showTTS ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Text-to-Speech"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                onClick={openCommentPanel}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    showCommentInput 
                    ? "bg-violet-100 text-violet-700" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Add Note
              </button>

              {user?.role === 'viewer' && (
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      showReviews 
                      ? "bg-yellow-100 text-yellow-700" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Reviews
                </button>
              )}

              <button
                onClick={handleTranslateToggle}
                disabled={isTranslating}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    translatedContent[selectedChapterIndex]
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Globe className="w-4 h-4" />
                {translatedContent[selectedChapterIndex] ? 'Original' : 'Translate'}
              </button>

              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    showWatermark 
                    ? "bg-rose-100 text-rose-700" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Toggle watermark"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {showWatermark ? 'Watermark On' : 'Watermark Off'}
              </button>

              <div id="cheatsheet-wrapper">
                <Cheatsheet
                  chapter={selectedChapter}
                  onAddComment={(comment) => {
                    handleAddComment(comment);
                  }}
                  onDeleteComment={handleDeleteComment}
                  selectedText={selectedText}
                  selectionInfo={selectionInfo}
                  externalText={showCommentInput ? manualText : ""}
                />
              </div>
            </div>
          </header>

          {showCommentInput && (
            <div className="border-b border-gray-200 bg-violet-50 px-6 py-3">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Enter word or phrase to highlight..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <input
                      type="text"
                      value={noteText || ""}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter your note (optional)..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (manualText.trim()) {
                          handleAddComment({ 
                            text: noteText || "", 
                            selectedText: manualText.trim(),
                            type: 'text',
                            line: 0,
                            position: 0
                          });
                          setNoteText("");
                        }
                      }}
                      disabled={!manualText.trim()}
                      className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCommentInput(false);
                        setSelectedText("");
                        setManualText("");
                        setNoteText("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTTS && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <TextToSpeech
                  text={selectedChapter.content}
                  bookTitle={localBook.title}
                  chapterTitle={selectedChapter.title}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto relative">
            {showWatermark && (
              <div className="watermark-container pointer-events-none select-none">
                {[...Array(20)].map((_, i) => (
                  <span 
                    key={i} 
                    className="watermark-text"
                    style={{
                      left: `${(i % 5) * 20 + 5}%`,
                      top: `${Math.floor(i / 5) * 20 + 5}%`,
                      transform: 'rotate(-30deg)',
                    }}
                  >
                    {watermarkText}
                  </span>
                ))}
              </div>
            )}

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
              <h1 className="text-xl md:text-3xl font-bold mb-8 leading-tight">
                {selectedChapter.title}
              </h1>

              <div 
                className="reading-content cursor-text"
                style={{fontSize: `${fontSize}px`, lineHeight: 1.7, fontFamily: 'Chapter, Georgia, "Times New Roman", serif'}}
                dangerouslySetInnerHTML={{
                  __html: formatContent(translatedContent[selectedChapterIndex]?.content || selectedChapter.content, selectedChapter.comments)
                }}
                onMouseUp={() => {
                  const contentToUse = translatedContent[selectedChapterIndex]?.content || selectedChapter.content;
                  const selection = window.getSelection();
                  const text = selection.toString().trim();
                  if (text) {
                    const content = contentToUse;
                    const start = selection.baseOffset;
                    const textBefore = content.substring(0, start);
                    const lines = textBefore.split('\n');
                    const line = lines.length - 1;
                    const type = text.split(/\s+/).length === 1 ? 'word' : 'text';
                    handleTextSelect(text, { line, position: 0, type });
                  }
                }}
              />

              <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
                <button
                 onClick={() => setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))}
                 disabled={selectedChapterIndex === 0}
                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Chapter
                </button>

                <span className="text-sm text-gray-500">
                  {selectedChapterIndex + 1} of {book.chapters.length}
                </span>

                <button
                 onClick={() => setSelectedChapterIndex(Math.min(book.chapters.length - 1, selectedChapterIndex + 1))}
                 disabled={selectedChapterIndex === book.chapters.length - 1}
                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Chapter
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {showReviews && user?.role === 'viewer' && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
              <ReviewForm bookId={book._id} existingReviews={reviews} />
            </div>
          </div>
        )}

        <style jsx>{`.reading-content p{
            margin-bottom: 1.5em;
            text-align: justify;
            hyphens: auto;
        }
        
        .reading-content p:first-child{
        margin-top: 0;
        }

        .reading-content p:last-child{
        margin-bottom: 0;
        }

        .reading-content strong{
          font-weight: 600;
          color: #1f2937;
        }

        .reading-content em{
          font-style: italic;
        }

        .highlighted-text {
          transition: all 0.2s ease;
        }

        .highlighted-text:hover {
          filter: brightness(0.95);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .watermark-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          opacity: 0.15;
        }

        .watermark-text {
          position: absolute;
          font-size: 1.5rem;
          font-weight: 600;
          color: #dc2626;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        `}</style>
    </div>
  )
}

const ReviewForm = ({ bookId, existingReviews = [] }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setLocalReviews(existingReviews);
    const currentUserId = user?._id;
    if (!currentUserId) return;
    
    const existing = existingReviews.find(r => 
      (r.viewerId?._id === currentUserId) || (r.viewerId === currentUserId)
    );
    if (existing) {
      setUserReview(existing);
      setRating(existing.rating);
      setReviewText(existing.review || "");
    }
  }, [existingReviews, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post(API_PATHS.BOOK_REVIEWS.CREATE, {
        bookId,
        rating,
        review: reviewText
      });
      toast.success(userReview ? "Review updated!" : "Review submitted!");
      
      const newReview = {
        rating,
        review: reviewText,
        viewerId: { _id: user?._id, name: user?.name || "You" },
        createdAt: new Date()
      };
      
      setLocalReviews(prev => {
        const filtered = prev.filter(r => {
          const rId = r.viewerId?._id || r.viewerId;
          return rId !== user?._id;
        });
        return [newReview, ...filtered];
      });
      setUserReview(newReview);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review (optional)</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts about this book..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
        </button>
      </form>

      {localReviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">All Reviews</h4>
          <div className="space-y-3">
            {localReviews.map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                {review.review && (
                  <p className="text-sm text-gray-700">{review.review}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  by {review.viewerId?.name || 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBook;