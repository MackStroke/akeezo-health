import React, { useState, useEffect, useMemo } from "react";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "./TablePagination.js";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Shield,
  Key,
  Check,
  X,
  Edit2,
  ShieldAlert,
  RefreshCw,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";
import { useToast, DisabledGuideButton } from "@akeezo/ui";
import { PERMISSION_KEYS, DEFAULT_ROLE_PERMISSIONS, RoleKey, PermissionKey } from "@akeezo/contracts";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  permissions?: string[];
  status: "active" | "disabled";
  phoneVerified?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface RoleOption {
  value: RoleKey;
  label: string;
  badgeColor: string;
  description: string;
}

const AVAILABLE_ROLES: RoleOption[] = [
  {
    value: "admin",
    label: "Super Administrator / Owner",
    badgeColor: "bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30",
    description: "Unrestricted control over system settings, website CMS, users, and financials.",
  },
  {
    value: "coordinator",
    label: "Case Coordinator",
    badgeColor: "bg-teal-50 text-teal-800 border border-teal-200",
    description: "Manages patient case lifecycle stages, doctor RFQs, quotes, and travel.",
  },
  {
    value: "hospital_liaison",
    label: "Hospital Operations",
    badgeColor: "bg-blue-50 text-blue-800 border border-blue-200",
    description: "Coordinates hospital quotes, beds, treatment plans, and discharge summaries.",
  },
  {
    value: "finance",
    label: "Finance & Accounts",
    badgeColor: "bg-amber-50 text-amber-800 border border-amber-200",
    description: "Oversees commissions, hospital billings, partner payouts, and collections.",
  },
  {
    value: "partner",
    label: "Referral Partner",
    badgeColor: "bg-purple-50 text-purple-800 border border-purple-200",
    description: "External medical travel facilitator with case submission and commission views.",
  },
  {
    value: "viewer",
    label: "Read-Only Viewer",
    badgeColor: "bg-slate-100 text-slate-700 border border-slate-200",
    description: "Read-only visibility for clinical auditing and compliance observation.",
  },
];

const PERMISSION_GROUPS: { label: string; permissions: PermissionKey[] }[] = [
  {
    label: "Patient & Case Operations",
    permissions: [
      "case.view",
      "case.create",
      "case.edit",
      "case.stage_move",
      "case.close",
      "case.reassign",
    ],
  },
  {
    label: "Clinical Records & Quotes",
    permissions: [
      "document.view",
      "document.upload",
      "document.view_identity",
      "quote.manage",
      "travel.manage",
      "episode.manage",
    ],
  },
  {
    label: "Finance, Partners & Hospital Network",
    permissions: [
      "commission.view",
      "commission.manage",
      "payment.record",
      "partner.manage",
      "partner.view_payout",
      "hospital.manage",
      "agreement.view",
      "agreement.manage",
    ],
  },
  {
    label: "Administration & Audit Governance",
    permissions: [
      "user.manage",
      "report.view",
      "report.financial",
      "export.data",
      "audit.view",
    ],
  },
];

export const UsersRolesView: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  // Users State
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter, sortField, sortDirection]);

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createRole, setCreateRole] = useState<RoleKey>("coordinator");
  const [createStatus, setCreateStatus] = useState<"active" | "disabled">("active");
  const [createPermissions, setCreatePermissions] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Created Credentials Confirmation Popup
  const [credentialPopup, setCredentialPopup] = useState<{
    email: string;
    password: string;
    role: string;
    name: string;
  } | null>(null);

  // Edit User Profile & Access Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editTab, setEditTab] = useState<"profile" | "access" | "security">("profile");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<RoleKey>("coordinator");
  const [editStatus, setEditStatus] = useState<"active" | "disabled">("active");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editNewPassword, setEditNewPassword] = useState("");
  const [savingUser, setSavingUser] = useState(false);
  const [editError, setEditError] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");

  // Delete User Confirmation
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "Akz@";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + "!";
  };

  const handleOpenCreateModal = () => {
    setCreateName("");
    setCreateEmail("");
    setCreatePassword(generateRandomPassword());
    setCreatePhone("+91 ");
    setCreateRole("coordinator");
    setCreateStatus("active");
    setCreatePermissions(DEFAULT_ROLE_PERMISSIONS.coordinator || []);
    setCreateError("");
    setCreateModalOpen(true);
  };

  const handleRoleChangeForCreate = (role: RoleKey) => {
    setCreateRole(role);
    setCreatePermissions(DEFAULT_ROLE_PERMISSIONS[role] || []);
  };

  const toggleCreatePermission = (perm: string) => {
    setCreatePermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          email: createEmail.trim(),
          password: createPassword.trim(),
          phone: createPhone.trim(),
          role: createRole,
          status: createStatus,
          permissions: createPermissions,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error?.message || "Failed to create user.");
        return;
      }

      toast.success(`User '${createEmail}' created and synced with Firebase Auth!`, {
        title: "User Created Successfully",
      });

      setCredentialPopup({
        name: createName.trim(),
        email: createEmail.trim(),
        password: createPassword.trim(),
        role: createRole,
      });

      setCreateModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setEditTab("profile");
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || "");
    setEditRole((u.role as RoleKey) || "coordinator");
    setEditStatus(u.status);
    setEditPermissions(u.permissions || DEFAULT_ROLE_PERMISSIONS[u.role as RoleKey] || []);
    setEditNewPassword("");
    setEditError("");
    setResetSuccessMessage("");
  };

  const handleSaveProfileAndAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    setEditError("");
    setResetSuccessMessage("");

    try {
      const payload: any = {
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        role: editRole,
        status: editStatus,
        permissions: editPermissions,
      };

      if (editNewPassword.trim().length >= 6) {
        payload.password = editNewPassword.trim();
      }

      const res = await fetch(`/api/v1/admin/users/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setEditError(json.error?.message || "Failed to update user profile.");
        return;
      }

      toast.success(`User '${editName}' profile & permissions updated.`, {
        title: "Profile Saved",
      });

      setEditingUser(null);
      await fetchUsers();
    } catch (err: any) {
      setEditError(err.message || "Network error while saving user.");
    } finally {
      setSavingUser(false);
    }
  };

  const handleQuickResetPassword = async (userId: string, email: string) => {
    const newPass = generateRandomPassword();
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPass }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message || "Password reset failed.", { title: "Error" });
        return;
      }

      setCredentialPopup({
        name: email,
        email,
        password: newPass,
        role: "Password Reset Completed",
      });

      toast.success(`Password reset for ${email}. Synced with Firebase.`, {
        title: "Password Reset",
      });
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message, { title: "Error" });
    }
  };

  const handleToggleUserStatus = async (u: AdminUser) => {
    const nextStatus = u.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch(`/api/v1/admin/users/${u._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message || "Action not allowed.", { title: "Status Locked" });
        return;
      }
      toast.success(`User "${u.name}" account status changed to ${nextStatus}.`, {
        title: "Account Status Updated",
      });
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/admin/users/${deletingUser._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message || "Failed to delete user.", { title: "Action Blocked" });
        return;
      }
      toast.success(`User '${deletingUser.email}' removed from system.`, {
        title: "User Deleted",
      });
      setDeletingUser(null);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    return sortItems(result, sortField, sortDirection);
  }, [users, search, statusFilter, roleFilter, sortField, sortDirection]);

  const activeAdminsCount = useMemo(
    () => users.filter((u) => u.role === "admin" && u.status === "active").length,
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Users className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Identity & Access Management (IAM)</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Users, Roles & Profile Management</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Create user accounts, manage RBAC permissions, and configure Firebase Authentication credentials with zero forced SMS requirements.
          </p>
        </div>

        {activeTab === "users" && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        )}
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "users"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4 text-[#007A6C]" />
          <span>Platform Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "roles"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#007A6C]" />
          <span>RBAC Roles & Permissions Matrix</span>
        </button>
      </div>

      {/* TAB 1: USERS LIST & MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, or role..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-[#007A6C]"
              >
                <option value="all">All Roles</option>
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-[#007A6C]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>

              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Table View */}
          {viewMode === "table" ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] text-slate-600">
                    <tr>
                      <th className="py-3 px-4">User Profile</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Access Status</th>
                      <th className="py-3 px-4">Phone / Contact</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Actions & Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#007A6C]" />
                          <span>Loading platform user profiles...</span>
                        </td>
                      </tr>
                    ) : paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No users found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => {
                        const isSoleAdmin = u.role === "admin" && u.status === "active" && activeAdminsCount <= 1;
                        return (
                          <tr key={u._id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#061E1B] text-[#00C7BE] font-bold text-xs flex items-center justify-center shrink-0">
                                  {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{u.name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === "admin"
                                    ? "bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30"
                                    : u.role === "coordinator"
                                    ? "bg-teal-50 text-teal-800 border border-teal-200"
                                    : u.role === "finance"
                                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  u.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {u.status === "active" ? (
                                  <UserCheck className="w-3 h-3" />
                                ) : (
                                  <UserX className="w-3 h-3" />
                                )}
                                <span>{u.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                              {u.phone || "—"}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <button
                                  onClick={() => openEditModal(u)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-[#007A6C] hover:text-white text-slate-700 rounded-lg transition flex items-center gap-1"
                                  title="Edit Profile & Permissions"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Manage</span>
                                </button>

                                <button
                                  onClick={() => handleQuickResetPassword(u._id, u.email)}
                                  className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                                  title="Reset Password"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  disabled={isSoleAdmin}
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isSoleAdmin
                                      ? "text-slate-300 cursor-not-allowed"
                                      : u.status === "active"
                                      ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                      : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                  title={isSoleAdmin ? "Cannot disable last admin" : u.status === "active" ? "Disable Account" : "Enable Account"}
                                >
                                  {u.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedUsers.map((u) => {
                const isSoleAdmin = u.role === "admin" && u.status === "active" && activeAdminsCount <= 1;
                return (
                  <div
                    key={u._id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          u.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#061E1B] text-[#00C7BE] font-bold text-sm flex items-center justify-center shrink-0">
                        {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{u.name}</h3>
                        <p className="text-xs text-slate-400 truncate font-mono">{u.email}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">{u.phone || "No phone"}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#007A6C] text-white rounded-lg hover:bg-[#005F54] transition"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <TablePagination
            currentPage={safeCurrentPage}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="users"
          />
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === "roles" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#007A6C]" />
              <span>Role-Based Access Control (RBAC) Hierarchy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Privileges are authoritatively verified per-endpoint on the API layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_ROLES.map((r) => (
              <div key={r.value} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.badgeColor}`}>
                    {r.value}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {DEFAULT_ROLE_PERMISSIONS[r.value]?.length || 0} Permissions
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{r.label}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#007A6C]" />
                <h3 className="text-sm font-bold text-slate-900">Create New User & Configure Access</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Dr. Kavita Rao"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="kavita@akeezo.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                  <span className="text-[10px] text-teal-700 block mt-0.5">
                    Synced automatically to Firebase Auth (free & unlimited sign-in).
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Account Password *</label>
                    <button
                      type="button"
                      onClick={() => setCreatePassword(generateRandomPassword())}
                      className="text-[10px] font-bold text-[#007A6C] hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 pr-9 font-mono text-xs rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Include country code</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Role</label>
                  <select
                    value={createRole}
                    onChange={(e) => handleRoleChangeForCreate(e.target.value as RoleKey)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={createStatus}
                    onChange={(e) => setCreateStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="active">Active (Full access)</option>
                    <option value="disabled">Disabled (Blocked from sign-in)</option>
                  </select>
                </div>
              </div>

              {/* Granular Permissions Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Assigned Granular Permissions</label>
                  <button
                    type="button"
                    onClick={() => setCreatePermissions(DEFAULT_ROLE_PERMISSIONS[createRole] || [])}
                    className="text-[10px] font-bold text-[#007A6C] hover:underline"
                  >
                    Reset to Role Defaults
                  </button>
                </div>

                <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {PERMISSION_GROUPS.map((grp) => (
                    <div key={grp.label} className="space-y-1.5">
                      <div className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                        {grp.label}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {grp.permissions.map((p) => {
                          const isChecked = createPermissions.includes(p);
                          return (
                            <label
                              key={p}
                              className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                                isChecked
                                  ? "bg-teal-50 border-teal-300 text-teal-900 font-semibold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCreatePermission(p)}
                                className="rounded text-[#007A6C] focus:ring-0"
                              />
                              <span className="font-mono text-[10px]">{p}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {creating ? "Creating & Syncing..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER PROFILE & ACCESS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage Profile & Access: {editingUser.name}</h3>
                <p className="text-[11px] font-mono text-slate-400">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex border-b border-slate-200 px-6 pt-2 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditTab("profile")}
                className={`pb-2.5 border-b-2 transition ${
                  editTab === "profile"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setEditTab("access")}
                className={`pb-2.5 border-b-2 transition ${
                  editTab === "access"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Role & Permissions
              </button>
              <button
                type="button"
                onClick={() => setEditTab("security")}
                className={`pb-2.5 border-b-2 transition ${
                  editTab === "security"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Password & Security
              </button>
            </div>

            <form onSubmit={handleSaveProfileAndAccess} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* SUB-TAB 1: PROFILE */}
              {editTab === "profile" && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: ACCESS & PERMISSIONS */}
              {editTab === "access" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Role</label>
                      <select
                        value={editRole}
                        onChange={(e) => {
                          const r = e.target.value as RoleKey;
                          setEditRole(r);
                          setEditPermissions(DEFAULT_ROLE_PERMISSIONS[r] || []);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                      >
                        {AVAILABLE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                      >
                        <option value="active">Active (Access Allowed)</option>
                        <option value="disabled">Disabled (Session Blocked)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">Permissions Override</label>
                      <button
                        type="button"
                        onClick={() => setEditPermissions(DEFAULT_ROLE_PERMISSIONS[editRole] || [])}
                        className="text-[10px] font-bold text-[#007A6C] hover:underline"
                      >
                        Reset to Role Defaults
                      </button>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {PERMISSION_GROUPS.map((grp) => (
                        <div key={grp.label} className="space-y-1.5">
                          <div className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                            {grp.label}
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {grp.permissions.map((p) => {
                              const isChecked = editPermissions.includes(p);
                              return (
                                <label
                                  key={p}
                                  className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${
                                    isChecked
                                      ? "bg-teal-50 border-teal-300 text-teal-900 font-semibold"
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      setEditPermissions((prev) =>
                                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                                      )
                                    }
                                    className="rounded text-[#007A6C] focus:ring-0"
                                  />
                                  <span className="font-mono text-[10px]">{p}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: SECURITY & PASSWORD */}
              {editTab === "security" && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>Direct Password Reset</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Entering a new password here will update the user's password in MongoDB and sync it with Firebase Authentication. Existing active tokens will be invalidated immediately.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Set New Password</label>
                      <button
                        type="button"
                        onClick={() => setEditNewPassword(generateRandomPassword())}
                        className="text-[10px] font-bold text-[#007A6C] hover:underline flex items-center gap-0.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Random</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editNewPassword}
                      onChange={(e) => setEditNewPassword(e.target.value)}
                      placeholder="Leave blank to keep existing password"
                      className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="font-bold text-rose-700 text-xs">Danger Zone</div>
                    <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Delete User Account</div>
                        <div className="text-[10px] text-slate-500">
                          Permanently removes account and revokes active access.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingUser(editingUser);
                          setEditingUser(null);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {savingUser ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS DISPLAY POPUP */}
      {credentialPopup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">User Credentials Ready</h3>
              <p className="text-xs text-slate-500">
                User account synchronized with Firebase Authentication.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-slate-900">{credentialPopup.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-bold text-[#007A6C]">{credentialPopup.password}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="font-bold text-slate-700">{credentialPopup.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Akeezo Portal Access:\nEmail: ${credentialPopup.email}\nPassword: ${credentialPopup.password}\nPortal URL: http://localhost:4000/case-management/`
                  );
                  toast.success("Credentials copied to clipboard!", { title: "Copied" });
                }}
                className="flex-1 py-2 text-xs font-bold text-[#007A6C] bg-teal-50 hover:bg-teal-100 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Details</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialPopup(null)}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Delete User Account</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{deletingUser.name}</strong> ({deletingUser.email})?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
