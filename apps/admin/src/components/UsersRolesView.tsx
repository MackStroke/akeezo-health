import React, { useState, useEffect, useMemo } from "react";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "./TablePagination";
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
} from "lucide-react";
import { useToast, DisabledGuideButton } from "@akeezo/ui";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status: "active" | "disabled";
  phoneVerified?: boolean;
  createdAt: string;
}

interface RoleDefinition {
  name: string;
  scope: string;
  badge: string;
  badgeColor: string;
  description: string;
  permissions: Record<string, string[]>;
}

export const UsersRolesView: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  // Users State
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
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

  // Reset to page 1 on filter/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter, sortField, sortDirection]);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Edit User State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "disabled">("active");
  const [savingUser, setSavingUser] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/v1/admin/users"),
        fetch("/api/v1/admin/roles"),
      ]);

      if (usersRes.ok) {
        const uJson = await usersRes.json();
        setUsers(uJson.data || []);
      }
      if (rolesRes.ok) {
        const rJson = await rolesRes.json();
        setRoles(rJson.data || []);
      }
    } catch (err) {
      console.error("Failed to load users & roles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError("");
    setInviteSuccess("");

    try {
      const res = await fetch("/api/v1/admin/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          phone: invitePhone,
          role: inviteRole,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setInviteError(json.error?.message || "Failed to invite user.");
        return;
      }

      setInviteSuccess(`Invitation dispatched to ${inviteEmail}.`);
      setInviteName("");
      setInviteEmail("");
      setInvitePhone("");
      await fetchUsersAndRoles();
      setTimeout(() => {
        setInviteSuccess("");
        setInviteModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const openEditUser = (u: AdminUser) => {
    setEditingUser(u);
    setEditRole(u.role);
    setEditStatus(u.status);
    setEditError("");
  };

  const handleSaveUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    setEditError("");

    try {
      const res = await fetch(`/api/v1/admin/users/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editRole,
          status: editStatus,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setEditError(json.error?.message || "Failed to update user.");
        return;
      }

      setEditingUser(null);
      await fetchUsersAndRoles();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSavingUser(false);
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
        toast.error(json.error?.message || "Action not allowed.", { title: "User Status Locked" });
        return;
      }
      toast.success(`User "${u.name}" account status changed to ${nextStatus}.`, {
        title: "Account Status Updated",
      });
      await fetchUsersAndRoles();
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Text search
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

    // 2. Status filter
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    // 3. Role filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // 4. Sorting
    return sortItems(result, sortField, sortDirection);
  }, [users, search, statusFilter, roleFilter, sortField, sortDirection]);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0) +
    (sortField !== "createdAt" || sortDirection !== "desc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
  };

  const availableRoles = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.role) set.add(u.role);
    });
    return Array.from(set);
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  const modulesList = [
    { key: "dashboard", label: "Dashboard Overview" },
    { key: "content", label: "Content & Pages" },
    { key: "media", label: "Media Library" },
    { key: "enquiries", label: "Enquiries & Leads" },
    { key: "seo", label: "SEO & Redirects" },
    { key: "users", label: "Users & RBAC" },
    { key: "activity", label: "Audit Logs" },
    { key: "settings", label: "System Settings" },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Users className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Enterprise Security & Access Governance</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Users, Roles & Authorization</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Manage administrator accounts, invitations, and module permissions. Centralized RBAC protects the last Super Administrator from accidental disablement or demotion.
          </p>
        </div>

        {activeTab === "users" && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite User</span>
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
          <span>Platform Users ({users.length})</span>
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
          <span>Roles & Permissions Matrix</span>
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, or role..."
                className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                >
                  <option value="all">All Roles</option>
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                >
                  <option value="all">All Accounts</option>
                  <option value="active">Active Only</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30"
                  title="Reset all filters and sorting"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}

              {/* Layout Toggle */}
              <ViewToggle
                mode={viewMode}
                onChange={setViewMode}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {viewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <SortHeader
                        label="User"
                        field="name"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onSort={handleSort}
                        className="py-3 px-4"
                      />
                      <SortHeader
                        label="Role"
                        field="role"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onSort={handleSort}
                        className="py-3 px-4"
                      />
                      <SortHeader
                        label="Contact"
                        field="phone"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onSort={handleSort}
                        className="py-3 px-4"
                      />
                      <SortHeader
                        label="Account Status"
                        field="status"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onSort={handleSort}
                        className="py-3 px-4"
                      />
                      <SortHeader
                        label="Created Date"
                        field="createdAt"
                        currentField={sortField}
                        currentDirection={sortDirection}
                        onSort={handleSort}
                        className="py-3 px-4"
                      />
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                          Loading users...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                          No users match the search filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((u) => {
                        const initials = u.name
                          ? u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "U";
                        return (
                          <tr key={u._id} className="hover:bg-slate-50 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30 font-bold flex items-center justify-center text-xs shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{u.name}</div>
                                  <div className="text-[11px] text-slate-400">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  u.role === "admin"
                                    ? "bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30"
                                    : u.role === "editor"
                                    ? "bg-[#E6F8F6] text-[#007A6C]"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {u.phone || "No phone registered"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  u.status === "active"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditUser(u)}
                                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit user"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {(() => {
                                  const activeAdmins = users.filter((x) => x.role === "super_admin" && x.status === "active");
                                  const isSoleSuperAdmin = u.role === "super_admin" && u.status === "active" && activeAdmins.length <= 1;

                                  return (
                                    <DisabledGuideButton
                                      disabled={isSoleSuperAdmin}
                                      reasonTitle="Super Admin Account Protected"
                                      reasonMessage="At least one active Super Admin account must remain active in the system to maintain platform security governance."
                                      requirements={[
                                        {
                                          label: "Multiple Active Super Admins Exist",
                                          fulfilled: !isSoleSuperAdmin,
                                          tip: "Invite or promote another Super Admin first",
                                        },
                                      ]}
                                      stepsToEnable={[
                                        "Invite or promote another team member to the Super Admin role.",
                                        "Verify the new Super Admin account is active.",
                                        "Return here to disable this account if necessary.",
                                      ]}
                                      placement="left"
                                      onClick={() => handleToggleUserStatus(u)}
                                      className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
                                        isSoleSuperAdmin
                                          ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                                          : u.status === "active"
                                          ? "text-rose-600 hover:bg-rose-50"
                                          : "text-emerald-600 hover:bg-emerald-50"
                                      }`}
                                    >
                                      {u.status === "active" ? "Disable" : "Activate"}
                                    </DisabledGuideButton>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid Card View */
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                    No users match the search filter.
                  </div>
                ) : (
                  paginatedUsers.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U";
                    const activeAdmins = users.filter((x) => x.role === "super_admin" && x.status === "active");
                    const isSoleSuperAdmin = u.role === "super_admin" && u.status === "active" && activeAdmins.length <= 1;

                    return (
                      <div
                        key={u._id}
                        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === "admin"
                                ? "bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30"
                                : u.role === "editor"
                                ? "bg-[#E6F8F6] text-[#007A6C]"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30 font-bold flex items-center justify-center text-sm shrink-0">
                            {initials}
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="font-bold text-sm text-slate-900 truncate">{u.name}</h3>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {u.phone || "No phone"}
                          </span>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditUser(u)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="Edit user"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <DisabledGuideButton
                              disabled={isSoleSuperAdmin}
                              reasonTitle="Super Admin Account Protected"
                              reasonMessage="At least one active Super Admin account must remain active in the system to maintain platform security governance."
                              requirements={[
                                {
                                  label: "Multiple Active Super Admins Exist",
                                  fulfilled: !isSoleSuperAdmin,
                                  tip: "Invite or promote another Super Admin first",
                                },
                              ]}
                              stepsToEnable={[
                                "Invite or promote another team member to the Super Admin role.",
                                "Verify the new Super Admin account is active.",
                                "Return here to disable this account if necessary.",
                              ]}
                              placement="left"
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
                                isSoleSuperAdmin
                                  ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                                  : u.status === "active"
                                  ? "text-rose-600 hover:bg-rose-50"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {u.status === "active" ? "Disable" : "Activate"}
                            </DisabledGuideButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination Controls */}
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
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#007A6C]" />
              <h2 className="text-base font-bold text-slate-900">
                Authoritative Centralized Permission Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Permissions are verified on the backend server for every API call. UI navigation menus adapt to permissions, but access restrictions are authoritatively enforced at the controller layer.
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">System Module</th>
                    <th className="py-3 px-4">Super Admin / Owner</th>
                    <th className="py-3 px-4">Administrator</th>
                    <th className="py-3 px-4">Content Editor</th>
                    <th className="py-3 px-4">Case Coordinator</th>
                    <th className="py-3 px-4">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {modulesList.map((m) => (
                    <tr key={m.key} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.label}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">
                        Full (Create, Edit, Publish, Delete, Manage)
                      </td>
                      <td className="py-3 px-4 text-teal-700 font-semibold">
                        Operational (Create, Edit, Publish)
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.key === "content" || m.key === "media"
                          ? "Draft & Edit"
                          : m.key === "dashboard"
                          ? "View"
                          : "No Access"}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.key === "enquiries"
                          ? "Triage & Convert"
                          : m.key === "dashboard"
                          ? "View"
                          : "No Access"}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {m.key === "dashboard" ? "View" : "No Access"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Invite New Administrator</h3>

            {inviteSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{inviteSuccess}</span>
              </div>
            )}
            {inviteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  placeholder="e.g. Dr. Priya Nair"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="name@akeezo.com"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                >
                  <option value="admin">Super Administrator / Owner</option>
                  <option value="editor">Content Editor</option>
                  <option value="coordinator">Case Coordinator</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+91 99999 00000"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] rounded-xl shadow-xs disabled:opacity-60"
                >
                  {inviting ? "Inviting..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER ROLE / STATUS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Edit Permissions: {editingUser.name}
            </h3>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                >
                  <option value="admin">Super Administrator / Owner</option>
                  <option value="editor">Content Editor</option>
                  <option value="coordinator">Case Coordinator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-semibold text-slate-800"
                >
                  <option value="active">Active (Access Allowed)</option>
                  <option value="disabled">Disabled (Access Blocked)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs disabled:opacity-60"
                >
                  {savingUser ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
