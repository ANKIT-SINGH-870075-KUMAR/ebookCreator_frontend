import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, BookOpen, Headphones, Trash2, ArrowRightLeft, Eye, Clock } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../Utils/apiPaths";

const roleColors = {
  superadmin: "bg-red-100 text-red-700",
  writer: "bg-violet-100 text-violet-700",
  viewer: "bg-blue-100 text-blue-700",
};

const statusColors = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [transferBookId, setTransferBookId] = useState(null);
  const [selectedWriter, setSelectedWriter] = useState("");
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const writers = users.filter(u => u.role === 'writer');

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate("/dashboard");
      return;
    }
    if (!activeTab) {
      setActiveTab("users");
    }
    fetchData();
  }, [activeTab, isSuperAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "users") {
        const response = await axiosInstance.get(API_PATHS.ADMIN.GET_USERS);
        setUsers(response.data);
      } else if (activeTab === "books") {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_ALL_BOOKS);
        setBooks(response.data);
      } else if (activeTab === "tickets") {
        console.log("Fetching tickets from:", API_PATHS.TICKETS.GET_ALL_ADMIN);
        const response = await axiosInstance.get(API_PATHS.TICKETS.GET_ALL_ADMIN);
        console.log("Tickets response:", response.data);
        setTickets(response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`${API_PATHS.ADMIN.UPDATE_USER_ROLE}/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await axiosInstance.delete(`${API_PATHS.ADMIN.DELETE_USER}/${deleteUserId}`);
      setUsers(users.filter(u => u._id !== deleteUserId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleteUserId(null);
    }
  };

  const viewWriterDashboard = (writerId) => {
    navigate(`/writer/${writerId}`);
  };

  const handleTransferBook = async () => {
    if (!transferBookId || !selectedWriter) return;
    try {
      await axiosInstance.post(API_PATHS.TRANSFER.CREATE, { bookId: transferBookId, toUserId: selectedWriter });
      toast.success("Transfer request sent to writer!");
      setTransferBookId(null);
      setSelectedWriter("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create transfer request.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "tickets", label: "Tickets", icon: Headphones },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Admin Panel</h1>
            <p className="text-[13px] text-slate-600 mt-1">Manage users, books, and support tickets.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Writer Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-lg p-4">
                    <div className="h-32 bg-slate-200 rounded mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : books.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No books found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Writer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {books.map((book) => {
                        const coverImageUrl = book.coverImage ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/") : "";
                        return (
                          <tr key={book._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {coverImageUrl ? (
                                  <img src={coverImageUrl} alt={book.title} className="w-10 h-14 object-cover rounded" onError={(e) => { e.target.src = ""; }} />
                                ) : (
                                  <div className="w-10 h-14 bg-violet-100 rounded flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-violet-500" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{book.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{book.author}</td>
                            <td className="px-6 py-4 text-gray-600">{book.userId?.name || '-'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {book.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setTransferBookId(book._id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                Transfer
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
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full"></div><div className="h-4 bg-gray-200 rounded w-24"></div></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-10"></div></td>
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full flex items-center justify-center text-white font-medium">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-violet-500 ${roleColors[u.role]}`}
                            disabled={u._id === user?._id}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="writer">Writer</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(u.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.role === 'writer' && (
                              <button
                                onClick={() => viewWriterDashboard(u._id)}
                                className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                title="View Dashboard"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {u._id !== user?._id && (
                              <button
                                onClick={() => setDeleteUserId(u._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === "books" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Writer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-14 bg-slate-200 rounded"></div><div className="h-4 bg-slate-200 rounded w-32"></div></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20"></div></td>
                      </tr>
                    ))
                  ) : books.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No books found</td></tr>
                  ) : (
                    books.map((book) => {
                      const coverImageUrl = book.coverImage ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/") : "";
                      return (
                        <tr key={book._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {coverImageUrl ? (
                                <img src={coverImageUrl} alt={book.title} className="w-10 h-14 object-cover rounded" onError={(e) => { e.target.src = ""; }} />
                              ) : (
                                <div className="w-10 h-14 bg-violet-100 rounded flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-violet-500" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900">{book.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{book.author}</td>
                          <td className="px-6 py-4 text-gray-600">{book.userId?.name || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setTransferBookId(book._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              Transfer
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-gray-200">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No tickets found</div>
            ) : (
              tickets.map((ticket) => (
                <div
                key={ticket._id}
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {ticket.user?.name || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(ticket.createdAt)}
                        </span>
                        <span className="capitalize">{ticket.category?.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {deleteUserId && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteUserId(null)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setDeleteUserId(null)}>Cancel</Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteUser}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Book Modal */}
        {transferBookId && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <div className="fixed inset-0 bg-black/50" onClick={() => { setTransferBookId(null); setSelectedWriter(""); }}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Book</h3>
                <p className="text-gray-600 mb-4">Select a writer to transfer this book to:</p>
                <select
                  value={selectedWriter}
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6"
                >
                  <option value="">Select a writer</option>
                  {writers.map((w) => (
                    <option key={w._id} value={w._id}>{w.name} ({w.email})</option>
                  ))}
                </select>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => { setTransferBookId(null); setSelectedWriter(""); }}>Cancel</Button>
                  <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={handleTransferBook} disabled={!selectedWriter}>Transfer</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
