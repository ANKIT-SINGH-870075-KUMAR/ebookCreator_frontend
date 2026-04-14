import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { UploadCloud, Sparkles } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookDetailsTab = ({
    book,
    onBookChange,
    onCoverUpload,
    isUploading,
    fileInputRef,
    onGenerateCover,
    isGeneratingCover
}) => {
    const coverImageUrl = book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g,  '/');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Book Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" name="title" value={book.title} onChange={onBookChange}/>
          <InputField label="Author" name="author" value={book.author} onChange={onBookChange}/>
          <InputField label="Category" name="category" value={book.category || ''} onChange={onBookChange} placeholder="e.g., Fiction, Non-Fiction, Technology..."/>
          <InputField label="Series Name" name="series" value={book.series || ''} onChange={onBookChange} placeholder="If part of a series..."/>
          {book.series && (
            <InputField label="Series Order" name="seriesOrder" type="number" value={book.seriesOrder || ''} onChange={onBookChange} placeholder="1" min="1"/>
          )}
          <div className="md:col-span-2">
          <InputField label="Subtitle" name="subtitle" value={book.subtitle || ''} onChange={onBookChange}/>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cover Image</h3>
        <div className="flex items-start gap-6">
          <img src={coverImageUrl} alt="Cover" className="w-32 h-48 object-cover rounded-lg bg-slate-100 shadow" />
          <div>
            <p className="text-sm text-slate-600 mb-4">Upload a new cover image or generate one with AI. Recommended size: 600x800px.</p>
            <div className="flex gap-3">
              <input type="file" ref={fileInputRef} onChange={onCoverUpload} className="hidden" accept="image/*" />
              <Button variant="secondary" onClick={()=> fileInputRef.current.click()} isLoading={isUploading} icon={UploadCloud}>
                Upload Image
              </Button>
              <Button 
                variant="secondary" 
                onClick={onGenerateCover} 
                isLoading={isGeneratingCover} 
                icon={Sparkles}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 hover:from-violet-700 hover:to-purple-700"
              >
                Generate with AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsTab;