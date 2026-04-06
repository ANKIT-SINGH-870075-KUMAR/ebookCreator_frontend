import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Clock, User, CheckCircle, AlertCircle, MessageSquare, Trash2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
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

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isTicketOwner = ticket?.user?._id === user?._id;
  const canManage = isSuperAdmin || isTicketOwner;

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.TICKETS.GET_BY_ID}/${ticketId}`);
      setTicket(response.data);
    } catch (error) {
      toast.error("Failed to fetch ticket.");
      navigate("/support");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.TICKETS.ADD_REPLY}/${ticketId}/replies`,
        { message: replyMessage }
      );
      setTicket(response.data.ticket);
      setReplyMessage("");
      toast.success("Reply added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.TICKETS.UPDATE_STATUS}/${ticketId}/status`,
        { status: newStatus }
      );
      setTicket(response.data.ticket);
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${API_PATHS.TICKETS.DELETE}/${ticketId}`);
      toast.success("Ticket deleted successfully!");
      navigate("/support");
    } catch (error) {
      toast.error("Failed to delete ticket.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/support")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Ticket Details</h1>
          </div>
          {canManage && (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} icon={Trash2}>
              Delete
            </Button>
          )}
        </div>

        {/* Ticket Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{ticket.subject}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                  {ticket.status.replace("_", " ")}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 capitalize">
                  {ticket.category.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {ticket.user?.name || "You"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDate(ticket.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              {ticket.replies?.length || 0} replies
            </span>
          </div>

          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</div>

          {/* Status Actions - Only for SuperAdmin */}
          {isSuperAdmin && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Update Status:</p>
              <div className="flex gap-2">
                {["open", "in_progress", "resolved", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={ticket.status === status}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      ticket.status === status
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">Replies</h3>
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 border ${
                  reply.isAdmin
                    ? "bg-violet-50 border-violet-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      reply.isAdmin
                        ? "bg-violet-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {reply.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reply.user?.name || "User"}
                      {reply.isAdmin && (
                        <span className="ml-2 text-xs text-violet-600 font-normal">(Support)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap ml-11">{reply.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No replies yet. Start the conversation below.</p>
            </div>
          )}
        </div>

        {/* Reply Form - SuperAdmin can always reply, ticket owner can reply if not closed */}
        {(isSuperAdmin || (isTicketOwner && ticket.status !== "closed")) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {isSuperAdmin ? "Add Admin Reply" : "Add Reply"}
            </h3>
            <form onSubmit={handleAddReply}>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="4"
                placeholder={isSuperAdmin ? "Type your admin response..." : "Type your reply here..."}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm resize-none mb-4"
              ></textarea>
              <div className="flex justify-end">
                <Button type="submit" isLoading={isSubmitting} icon={Send}>
                  {isSuperAdmin ? "Send Admin Reply" : "Send Reply"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Closed Ticket - SuperAdmin can reopen */}
        {ticket.status === "closed" && !isSuperAdmin && isTicketOwner && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">This ticket is closed. Contact support to reopen.</p>
          </div>
        )}

        {ticket.status === "closed" && isSuperAdmin && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">This ticket is closed.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => handleStatusChange("open")}
            >
              Reopen Ticket
            </Button>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowDeleteConfirm(false)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Ticket</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
