import { useState, useEffect, useRef } from "react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { UploadCloud, Sparkles, Plus, X, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const BookDetailsTab = ({
    book,
    onBookChange,
    onCoverUpload,
    isUploading,
    fileInputRef,
    onGenerateCover,
    isGeneratingCover
}) => {
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const categoryRef = useRef(null);
    const subcategoryRef = useRef(null);

    const coverImageUrl = book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g,  '/');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
            if (subcategoryRef.current && !subcategoryRef.current.contains(event.target)) {
                setShowSubcategoryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleCategorySearch = (value) => {
        setCategorySearch(value);
        if (value.trim() === "") {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(cat => 
                cat.name.toLowerCase().includes(value.toLowerCase()) ||
                cat.subcategories.some(sub => sub.toLowerCase().includes(value.toLowerCase()))
            );
            setFilteredCategories(filtered);
        }
        setShowCategoryDropdown(true);
    };

    const handleSelectCategory = (category) => {
        onBookChange({ target: { name: "category", value: category.name } });
        onBookChange({ target: { name: "subcategory", value: "" } });
        setCategorySearch(category.name);
        setShowCategoryDropdown(false);
        setFilteredSubcategories(category.subcategories.map(sub => ({ name: sub })));
    };

    const handleSelectSubcategory = (subcategory) => {
        onBookChange({ target: { name: "subcategory", value: subcategory.name } });
        setShowSubcategoryDropdown(false);
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }
        try {
            const response = await axiosInstance.post(API_PATHS.CATEGORIES.CREATE_WITH_SUBCATEGORY, {
                name: newCategoryName.trim(),
                subcategory: newSubcategoryName.trim() || null
            });
            await fetchCategories();
            onBookChange({ target: { name: "category", value: response.data.name } });
            if (newSubcategoryName.trim()) {
                onBookChange({ target: { name: "subcategory", value: newSubcategoryName.trim() } });
            }
            setCategorySearch(response.data.name);
            setShowNewCategoryInput(false);
            setNewCategoryName("");
            setNewSubcategoryName("");
            toast.success("Category added successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    const handleAddNewSubcategory = async () => {
        if (!newSubcategoryName.trim()) {
            toast.error("Subcategory name is required");
            return;
        }
        const currentCat = categories.find(cat => cat.name === book.category);
        if (!currentCat) {
            toast.error("Please select a category first");
            return;
        }
        try {
await axiosInstance.post(API_PATHS.CATEGORIES.ADD_SUBCATEGORY(currentCat._id), {
                subcategory: newSubcategoryName.trim()
            });
            await fetchCategories();
            onBookChange({ target: { name: "subcategory", value: newSubcategoryName.trim() } });
            setShowNewSubcategoryInput(false);
            setNewSubcategoryName("");
            toast.success("Subcategory added successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add subcategory");
        }
    };

    const currentCategory = categories.find(cat => cat.name === book.category);
    const subcategories = currentCategory?.subcategories || [];

    return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Book Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" name="title" value={book.title} onChange={onBookChange}/>
          <InputField label="Author" name="author" value={book.author} onChange={onBookChange}/>
          
          <div className="relative" ref={categoryRef}>
            <InputField 
                label="Category" 
                name="category" 
                value={categorySearch} 
                onChange={(e) => handleCategorySearch(e.target.value)} 
                placeholder="Search or add category..."
                onFocus={() => setShowCategoryDropdown(true)}
            />
            {showCategoryDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingCategories ? (
                        <div className="p-3 text-sm text-slate-500">Loading...</div>
                    ) : filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => (
                            <div 
                                key={cat._id}
                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                onClick={() => handleSelectCategory(cat)}
                            >
                                <div className="font-medium text-slate-900">{cat.name}</div>
                                <div className="text-xs text-slate-500 truncate">
                                    {cat.subcategories.slice(0, 3).join(", ")}
                                    {cat.subcategories.length > 3 && ` +${cat.subcategories.length - 3} more`}
                                </div>
                            </div>
                        ))
                    ) : null}
                    <div 
                        className="p-3 hover:bg-slate-50 cursor-pointer border-t border-slate-200"
                        onClick={() => {
                            setShowNewCategoryInput(true);
                            setShowCategoryDropdown(false);
                        }}
                    >
                        <div className="flex items-center text-violet-600">
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="font-medium">Add new category</span>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {book.category && (
            <div className="relative" ref={subcategoryRef}>
                <InputField 
                    label="Subcategory" 
                    name="subcategory" 
                    value={book.subcategory || ''} 
                    onChange={(e) => {
                        onBookChange(e);
                        if (e.target.value) {
                            setShowSubcategoryDropdown(true);
                        }
                    }} 
                    placeholder="Search or add subcategory..."
                    onFocus={() => setShowSubcategoryDropdown(true)}
                />
                {showSubcategoryDropdown && subcategories.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {subcategories.map((sub, index) => (
                            <div 
                                key={index}
                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                onClick={() => handleSelectSubcategory({ name: sub })}
                            >
                                <span className="text-slate-700">{sub}</span>
                            </div>
                        ))}
                        <div 
                            className="p-3 hover:bg-slate-50 cursor-pointer border-t border-slate-200"
                            onClick={() => {
                                setShowNewSubcategoryInput(true);
                                setShowSubcategoryDropdown(false);
                            }}
                        >
                            <div className="flex items-center text-violet-600">
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="font-medium">Add custom subcategory</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          )}

          <InputField label="Series Name" name="series" value={book.series || ''} onChange={onBookChange} placeholder="If part of a series..."/>
          {book.series && (
            <InputField label="Series Order" name="seriesOrder" type="number" value={book.seriesOrder || ''} onChange={onBookChange} placeholder="1" min="1"/>
          )}
          <div className="md:col-span-2">
          <InputField label="Subtitle" name="subtitle" value={book.subtitle || ''} onChange={onBookChange}/>
          </div>
        </div>
      </div>

      {showNewCategoryInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Category</h3>
                    <button onClick={() => setShowNewCategoryInput(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <InputField 
                        label="Category Name" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        placeholder="Enter category name..."
                    />
                    <InputField 
                        label="Subcategory (Optional)" 
                        value={newSubcategoryName} 
                        onChange={(e) => setNewSubcategoryName(e.target.value)} 
                        placeholder="Enter subcategory name..."
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowNewCategoryInput(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleAddNewCategory} className="flex-1">
                            Add Category
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {showNewSubcategoryInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add Subcategory to "{book.category}"</h3>
                    <button onClick={() => setShowNewSubcategoryInput(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <InputField 
                        label="Subcategory Name" 
                        value={newSubcategoryName} 
                        onChange={(e) => setNewSubcategoryName(e.target.value)} 
                        placeholder="Enter subcategory name..."
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowNewSubcategoryInput(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleAddNewSubcategory} className="flex-1">
                            Add Subcategory
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

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