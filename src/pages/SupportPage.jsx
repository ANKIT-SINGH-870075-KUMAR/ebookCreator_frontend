import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Headphones, Clock, CheckCircle, AlertCircle, MessageSquare, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPaths";

const statusColors = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
  });

  const subjectOptions = [
    "Login or account issues",
    "Payment or billing inquiry",
    "Feature request",
    "Bug report",
    "Book or content issue",
    "Subscription help",
    "Technical support",
    "Other"
  ];
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TICKETS.GET_ALL);
      setTickets(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error("Please fill in subject and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(API_PATHS.TICKETS.CREATE, formData);
      toast.success("Ticket created successfully!");
      setTickets([response.data.ticket, ...tickets]);
      setFormData({ subject: "", category: "general", priority: "medium", description: "" });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = filterStatus === "all"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Support Tickets
            </h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create and track your support tickets.
            </p>
          </div>
          <Button className="whitespace-nowrap" onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
            New Ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Tickets</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                <p className="text-xs text-gray-500">Open</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "open", "in_progress", "resolved", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                filterStatus === status
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
              }`}
            >
              {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Headphones className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {filterStatus === "all"
                ? "You haven't created any support tickets yet."
                : `No tickets with status "${filterStatus.replace("_", " ")}".`}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
              Create Your First Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/support/${ticket._id}`)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(ticket.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {ticket.replies?.length || 0} replies
                      </span>
                      <span className="capitalize">{ticket.category.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Ticket Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Ticket">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;
