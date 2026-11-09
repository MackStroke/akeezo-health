import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Inbox,
  Activity,
  FileText,
  ShieldCheck,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  ChevronRight,
  AlertCircle,
  Stethoscope,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { AdminTab } from "./SuperAdminSidebar.js";
import { useAuth } from "../context/AuthContext.js";

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  category: "lead" | "case" | "directory" | "content" | "system";
  severity: "info" | "success" | "warning" | "urgent";
  targetTab?: AdminTab;
  targetUrl?: string;
  targetId?: string;
  actionLabel?: string;
  createdAt: string;
  isRead: boolean;
  meta?: Record<string, any>;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
  onUnreadCountChange?: (count: number) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onUnreadCountChange,
}) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "lead" | "case" | "system">("all");

  const fetchNotifications = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setRefreshing(true);
      const res = await fetch("/api/v1/admin/notifications", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const items: AdminNotificationItem[] = json.data?.notifications || [];
        setNotifications(items);
        const unread = items.filter((n) => !n.isRead).length;
        if (onUnreadCountChange) onUnreadCountChange(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, onUnreadCountChange]);

  useEffect(() => {
    fetchNotifications(true);

    // Periodic polling every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      const remainingUnread = notifications.filter((n) => n.id !== id && !n.isRead).length;
      if (onUnreadCountChange) onUnreadCountChange(remainingUnread);

      await fetch(`/api/v1/admin/notifications/${id}/read`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length === 0) return;

      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onUnreadCountChange) onUnreadCountChange(0);

      await fetch("/api/v1/admin/notifications/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ ids: unreadIds }),
      });
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Dismiss a notification
  const handleDismiss = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic remove
      const updated = notifications.filter((n) => n.id !== id);
      setNotifications(updated);
      const unread = updated.filter((n) => !n.isRead).length;
      if (onUnreadCountChange) onUnreadCountChange(unread);

      await fetch(`/api/v1/admin/notifications/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to dismiss notification", err);
    }
  };

  // Handle clicking on notification action
  const handleItemClick = (n: AdminNotificationItem) => {
    handleMarkAsRead(n.id);
    onClose();

    if (n.targetUrl) {
      window.location.href = n.targetUrl;
    } else if (n.targetTab) {
      onSelectTab(n.targetTab);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "lead":
        return notifications.filter((n) => n.category === "lead");
      case "case":
        return notifications.filter((n) => n.category === "case" || n.category === "directory" || n.category === "content");
      case "system":
        return notifications.filter((n) => n.category === "system");
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#007A6C] text-[#00C7BE] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>Notifications Center</span>
              {unreadCount > 0 ? (
                <span className="bg-[#FF6B00] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> All caught up
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-300">
              Inbound patient triage & platform operations
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchNotifications(false)}
            disabled={refreshing}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#00C7BE]" : ""}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 bg-[#007A6C]/80 hover:bg-[#007A6C] text-white text-[10px] font-bold px-2 py-1 rounded-lg transition border border-[#00C7BE]/30"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3 h-3 text-[#00C7BE]" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            aria-label="Close notifications panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto select-none text-[11px]">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
            activeFilter === "all"
              ? "bg-slate-900 text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
            activeFilter === "unread"
              ? "bg-[#FF6B00] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter("lead")}
          className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
            activeFilter === "lead"
              ? "bg-[#007A6C] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          Patient Leads ({notifications.filter((n) => n.category === "lead").length})
        </button>
        <button
          onClick={() => setActiveFilter("case")}
          className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
            activeFilter === "case"
              ? "bg-indigo-600 text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          Cases & CMS ({notifications.filter((n) => n.category === "case" || n.category === "content").length})
        </button>
        <button
          onClick={() => setActiveFilter("system")}
          className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
            activeFilter === "system"
              ? "bg-slate-700 text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          Audit ({notifications.filter((n) => n.category === "system").length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-xs font-bold text-slate-800">No notifications found</div>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              {activeFilter === "unread"
                ? "You have acknowledged all active patient inquiries and operational updates."
                : "No items match the selected notification filter."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            // Category icon & color assignment
            let CategoryIcon = Inbox;
            let iconBg = "bg-[#FFF4EC] text-[#FF6B00]";

            if (n.category === "case") {
              CategoryIcon = Activity;
              iconBg = "bg-[#E6F8F6] text-[#007A6C]";
            } else if (n.category === "content") {
              CategoryIcon = FileText;
              iconBg = "bg-amber-100 text-amber-700";
            } else if (n.category === "directory") {
              CategoryIcon = Stethoscope;
              iconBg = "bg-teal-50 text-teal-700";
            } else if (n.category === "system") {
              CategoryIcon = ShieldCheck;
              iconBg = "bg-slate-100 text-slate-700";
            }

            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3 transition-colors cursor-pointer flex items-start gap-3 group relative ${
                  n.isRead
                    ? "bg-white hover:bg-slate-50/80"
                    : "bg-teal-50/20 hover:bg-teal-50/40 border-l-4 border-l-[#007A6C]"
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}
                >
                  <CategoryIcon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`font-bold text-xs truncate max-w-[210px] ${
                        n.isRead ? "text-slate-800" : "text-slate-900"
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#007A6C] group-hover:text-[#005F54]">
                      <span>{n.actionLabel || "View Details"}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </span>

                    {/* Unread dot or severity tag */}
                    <div className="flex items-center gap-2">
                      {n.severity === "urgent" && (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                          Urgent
                        </span>
                      )}
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Quick Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 self-center pl-1">
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDismiss(n.id, e)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-slate-100 transition"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <button
          onClick={() => {
            onClose();
            onSelectTab("activity");
          }}
          className="text-[#007A6C] font-bold hover:underline flex items-center gap-1"
        >
          <span>View Full Activity Audit Trail</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <span className="text-[10px] text-slate-400 font-medium">
          Auto-updates every 30s
        </span>
      </div>
    </div>
  );
};
