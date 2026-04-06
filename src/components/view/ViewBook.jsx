import { useState, useEffect } from "react";
import { ChevronLeft, Menu, Volume2, MessageSquare } from "lucide-react";
import ViewChapterSidebar from "./ViewChapterSidebar";
import TextToSpeech from "../ui/TextToSpeech";
import Cheatsheet from "../editor/Cheatsheet";

const ViewBook = ({book}) => {

    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [showTTS, setShowTTS] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [selectionInfo, setSelectionInfo] = useState(null);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [manualText, setManualText] = useState("");
    const [noteText, setNoteText] = useState("");
    const [localBook, setLocalBook] = useState(() => JSON.parse(JSON.stringify(book)));

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

    // Generate random color for comment highlight
    const getHighlightColor = (index) => {
        const colors = [
            '#fef3c7', // yellow
            '#dbeafe', // blue
            '#d1fae5', // green
            '#fce7f3', // pink
            '#e0e7ff', // indigo
            '#ffedd5', // orange
            '#f3e8ff', // purple
            '#fee2e2', // red
        ];
        return colors[index % colors.length];
    };

    // Format content with highlights for commented text
    const formatContent = (content, comments = []) => {
        const paragraphs = content.split('\n\n').filter(paragraph => paragraph.trim());
        
        return paragraphs.map((paragraph, pIndex) => {
            let formatted = paragraph;
            
            // Apply markdown first
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '<em>$1</em>');
            
            // Apply highlights for comments that match this paragraph
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

        {/* Main Content  */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
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
              {/* Font Size Controls */}
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
              
              {/* TTS Toggle Button */}
              <button
                onClick={() => setShowTTS(!showTTS)}
                className={`p-2 rounded-lg transition-colors ${showTTS ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Text-to-Speech"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* Add Note Button */}
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

              {/* Comments Button */}
              <div id="cheatsheet-wrapper">
                <Cheatsheet
                  chapter={selectedChapter}
                  onAddComment={(comment) => {
                    handleAddComment(comment);
                    // Reset external text after adding
                  }}
                  onDeleteComment={handleDeleteComment}
                  selectedText={selectedText}
                  selectionInfo={selectionInfo}
                  externalText={showCommentInput ? manualText : ""}
                />
              </div>
            </div>
          </header>

          {/* Add Comment Input Panel */}
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

          {/* Text-to-Speech Panel - Top of Page */}
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

          {/* Reading Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Chapter Title */}
              <h1 className="text-xl md:text-3xl font-bold mb-8 leading-tight">
                {selectedChapter.title}
              </h1>

              {/* Chapter Content */}
              <div 
                className="reading-content cursor-text"
                style={{fontSize: `${fontSize}px`, lineHeight: 1.7, fontFamily: 'Chapter, Georgia, "Times New Roman", serif'}}
                dangerouslySetInnerHTML={{
                  __html: formatContent(selectedChapter.content, selectedChapter.comments)
                }}
                onMouseUp={() => {
                  const selection = window.getSelection();
                  const text = selection.toString().trim();
                  if (text) {
                    const content = selectedChapter.content;
                    const start = selection.baseOffset;
                    const textBefore = content.substring(0, start);
                    const lines = textBefore.split('\n');
                    const line = lines.length - 1;
                    const type = text.split(/\s+/).length === 1 ? 'word' : 'text';
                    handleTextSelect(text, { line, position: 0, type });
                  }
                }}
              />

              {/* Navigation */}
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

        `}</style>
    </div>
  )
}

export default ViewBook