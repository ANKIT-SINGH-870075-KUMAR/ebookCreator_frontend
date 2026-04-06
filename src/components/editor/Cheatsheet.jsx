import { useState, useEffect } from "react";
import { MessageSquare, Trash2, User, Clock, X, Plus, Type, AlignLeft } from "lucide-react";
import Button from "../ui/Button";

const Cheatsheet = ({ chapter, onAddComment, onDeleteComment, selectedText, selectionInfo, externalText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const comments = chapter?.comments || [];
  
  // Auto-open when external text is provided
  useEffect(() => {
    if (externalText && externalText.trim()) {
      setIsOpen(true);
      setShowAddForm(true);
    }
  }, [externalText]);

  const effectiveSelectedText = externalText || selectedText;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      text: newComment,
      line: selectionInfo?.line || 0,
      position: selectionInfo?.position || 0,
      selectedText: effectiveSelectedText || "",
      type: selectionInfo?.type || (effectiveSelectedText?.split(/\s+/).length === 1 ? "word" : "text")
    };
    onAddComment(comment);
    setNewComment("");
    setShowAddForm(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'word': return 'Word';
      case 'line': return 'Line';
      case 'text': return 'Selection';
      default: return 'Line';
    }
  };

  return (
    <div className="relative">
      <button
        id="cheatsheet-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && externalText) {
            setShowAddForm(true);
          }
        }}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isOpen 
            ? "bg-violet-100 text-violet-700" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Comments
        {comments.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-violet-600 text-white rounded-full">
            {comments.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-96 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Chapter Comments</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {effectiveSelectedText && !showAddForm && (
            <div className="px-3 py-2 bg-violet-50 border-b border-violet-100">
              <div className="flex items-center gap-2 text-xs text-violet-700 mb-1">
                {selectionInfo?.type === 'word' ? <Type className="w-3 h-3" /> : <AlignLeft className="w-3 h-3" />}
                <span className="font-medium">Selected: {getTypeLabel(selectionInfo?.type)}</span>
              </div>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-violet-200 line-clamp-2">
                "{selectedText}"
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs text-violet-600 hover:text-violet-800 font-medium"
              >
                + Add note for this {selectionInfo?.type === 'word' ? 'word' : 'selection'}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1">Select text to add a note</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {comments.map((comment, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            comment.type === 'word' ? 'bg-blue-100 text-blue-700' : 
                            comment.type === 'text' ? 'bg-orange-100 text-orange-700' :
                            'bg-violet-100 text-violet-700'
                          }`}>
                            {getTypeLabel(comment.type)} {comment.line + 1}
                          </span>
                          {comment.userName && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              {comment.userName}
                            </span>
                          )}
                        </div>
                        {comment.selectedText && (
                          <p className="text-xs text-gray-500 bg-gray-100 p-1.5 rounded mb-1 italic line-clamp-1">
                            "{comment.selectedText}"
                          </p>
                        )}
                        <p className="text-sm text-gray-800">{comment.text}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteComment(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100">
            {showAddForm ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {selectionInfo?.type === 'word' ? <Type className="w-3 h-3" /> : <AlignLeft className="w-3 h-3" />}
                  <span className="line-clamp-1">"{selectedText || 'Line ' + (selectionInfo?.line + 1)}"</span>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your note..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddComment} className="flex-1">
                    Add Note
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cheatsheet;