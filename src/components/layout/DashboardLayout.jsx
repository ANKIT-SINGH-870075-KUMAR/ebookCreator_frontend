import { useState, useEffect, use } from "react";
import { Album, Headphones, Settings, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropDown";

const DashboardLayout = ({children, showWriterView, writerName, writerEmail}) => {
  const { user, logout, isSuperAdmin, isViewer, isWriter } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const canAccessSupport = isViewer || isWriter;

  // Close dropdowns when clicking outside
  useEffect(()=>{
    const handleClickOutside = () => {
      if(profileDropdownOpen){
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  },[profileDropdownOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            {showWriterView ? (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold text-lg">Back to Admin</span>
              </button>
            ) : (
              <Link className="flex items-center space-x-3" to="/">
              <div className="h-8 w-8 bg-gradient-to-br from-violet-400 to-violet-500 rounded-lg flex items-center justify-center">
                <Album className="h-5 w-5 text-white" />
              </div>
              <span className="text-black font-bold text-xl">
                AI eBook Creator
              </span>
              </Link>
            )}
            {user?.role && !showWriterView && (
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                user.role === 'writer' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'superadmin' ? 'Super Admin' : user.role === 'writer' ? 'Writer' : 'Viewer'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {showWriterView ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-gradient-to-br from-violet-400 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {writerName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{writerName}</p>
                  <p className="text-xs text-gray-500">{writerEmail}</p>
                </div>
              </div>
            ) : (
              <>
                {!showWriterView && isSuperAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                {!showWriterView && canAccessSupport && (
                  <Link
                    to="/support"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-all duration-200"
                  >
                    <Headphones className="w-4 h-4" />
                    <span className="hidden sm:inline">Support</span>
                  </Link>
                )}
                {!showWriterView && (
                  <ProfileDropdown
                    isOpen={profileDropdownOpen}
                    onToggle={(e)=>{
                      e.stopPropagation();
                      setProfileDropdownOpen(!profileDropdownOpen);
                    }}
                    avatar={user?.avatar || ""}
                    companyName={user?.name || ""}
                    email={user?.email || ""}
                    userRole={user?.role || ""}
                    onLogout={logout}
                  />
                )}
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout