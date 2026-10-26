import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Search,
  X,
  RefreshCw,
} from "lucide-react";
import {
  useToast,
  DisabledGuideButton,
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "@akeezo/ui";
import { apiFetch } from "../utils/api.js";

interface FinanceWorkspaceProps {
  onRefresh: () => void;
}

export const FinanceWorkspace: React.FC<FinanceWorkspaceProps> = () => {
  const toast = useToast();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Sorting & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<string | null>("billedAmountMinor");
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
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  // Payment Form state
  const [paymentForm, setPaymentForm] = useState({
    direction: "in_from_hospital",
    partyId: "",
    amount: "75000", // INR 75,000
    reference: "UTR-HDFC-982341",
    method: "bank_transfer",
    targetCommissionRecordId: "",
  });

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/v1/commission-records");
      const json = await res.json();
      setCommissions(json.data || []);
      if (json.data && json.data.length > 0) {
        setPaymentForm((prev) => ({
          ...prev,
          targetCommissionRecordId: json.data[0]._id,
          partyId: json.data[0].caseId?._id || "67b938000000000000000001",
        }));
      }
    } catch (err) {
      console.error("Failed to load commissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amountPaise = Math.round(parseFloat(paymentForm.amount) * 100);
      const payload = {
        direction: paymentForm.direction,
        partyId: paymentForm.partyId || "67b938000000000000000001",
        amountMinor: amountPaise,
        currency: "INR",
        paidOn: new Date().toISOString().split("T")[0],
        method: paymentForm.method,
        reference: paymentForm.reference,
        allocations: [
          {
            commissionRecordId: paymentForm.targetCommissionRecordId,
            amountMinor: amountPaise,
          },
        ],
      };

      const res = await apiFetch("/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Payment of ₹${parseFloat(paymentForm.amount).toLocaleString("en-IN")} recorded & allocated successfully!`, {
          title: "Payment Recorded",
        });
        setShowPaymentModal(false);
        fetchCommissions();
      } else {
        const err = await res.json();
        toast.error(err.error?.message || "Failed to record payment", { title: "Payment Error" });
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    }
  };

  // Totals
  const totalGrossCommissionMinor = commissions.reduce(
    (sum, c) => sum + (c.akeezoCommissionMinor || 0),
    0
  );
  const totalHospitalReceivedMinor = commissions.reduce(
    (sum, c) => sum + (c.hospitalReceivedMinor || 0),
    0
  );
  const totalPartnerShareMinor = commissions.reduce(
    (sum, c) => sum + (c.partnerShareMinor || 0),
    0
  );
  const totalPartnerPaidMinor = commissions.reduce(
    (sum, c) => sum + (c.partnerPaidMinor || 0),
    0
  );
  const totalPartnerPayableMinor = commissions.reduce(
    (sum, c) => sum + Math.max(0, c.partnerPayableMinor || 0),
    0
  );

  const filteredCommissions = useMemo(() => {
    let result = commissions;

    // 1. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseId?.caseCode?.toLowerCase().includes(q) ||
          c.status?.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // 3. Sorting
    return sortItems(result, sortField, sortDirection);
  }, [commissions, searchQuery, statusFilter, sortField, sortDirection]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (sortField !== "billedAmountMinor" || sortDirection !== "desc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortField("billedAmountMinor");
    setSortDirection("desc");
  };

  const totalPages = Math.max(1, Math.ceil(filteredCommissions.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCommissions = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredCommissions.slice(start, start + pageSize);
  }, [filteredCommissions, safeCurrentPage, pageSize]);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Commission Accounting & Settlements
          </h1>
          <p className="text-xs text-slate-500">
            Real-time reconciliation of Hospital receivables, Akeezo net, and Partner payouts.
          </p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment Receipt / Payout</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-4 pb-6 font-sans">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total Akeezo Commission
            </span>
            <DollarSign className="w-4 h-4 text-[#007A6C]" />
          </div>
          <div className="text-lg font-black text-slate-900">
            ₹{(totalGrossCommissionMinor / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-400">Gross accrued commission</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Hospital Receipts
            </span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-700">
            ₹{(totalHospitalReceivedMinor / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-400">
            Outstanding: ₹{((totalGrossCommissionMinor - totalHospitalReceivedMinor) / 100).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Partner Share Earned
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#007A6C]" />
          </div>
          <div className="text-lg font-black text-slate-900">
            ₹{(totalPartnerShareMinor / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-400">Total partner entitlement</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Partner Payable Due
            </span>
            <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-lg font-black text-[#FF6B00]">
            ₹{(totalPartnerPayableMinor / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-slate-400">
            Paid so far: ₹{(totalPartnerPaidMinor / 100).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Commission Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Episode Commission Records
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              ({filteredCommissions.length} records)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case code..."
                className="w-full text-xs pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#007A6C] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium capitalize"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="provisional">Provisional</option>
                <option value="invoiced">Invoiced</option>
                <option value="settled">Settled</option>
                <option value="clawback">Clawback</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30"
                title="Reset all filters and sorting"
              >
                <RefreshCw className="w-3 h-3" />
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

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <SortHeader
                    label="Case Code"
                    field="caseId.caseCode"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Billed (INR)"
                    field="billedAmountMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Akeezo Commission"
                    field="akeezoCommissionMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Partner Share"
                    field="partnerShareMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Hospital Recd"
                    field="hospitalReceivedMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Partner Paid"
                    field="partnerPaidMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Payable Due"
                    field="partnerPayableMinor"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Status"
                    field="status"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No commission records found.
                    </td>
                  </tr>
                ) : (
                  paginatedCommissions.map((cr) => (
                    <tr key={cr._id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-[#007A6C]">
                        {cr.caseId?.caseCode || "AKZ"}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        ₹{(cr.billedAmountMinor / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        ₹{(cr.akeezoCommissionMinor / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-bold text-[#007A6C]">
                        ₹{(cr.partnerShareMinor / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        ₹{(cr.hospitalReceivedMinor / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-semibold">
                        ₹{(cr.partnerPaidMinor / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3">
                        {cr.recoveryDueMinor > 0 ? (
                          <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                            Recovery ₹{(cr.recoveryDueMinor / 100).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-orange-700 font-bold">
                            ₹{(Math.max(0, cr.partnerPayableMinor || 0) / 100).toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {cr.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid Card View */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommissions.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-400">
                No commission records found.
              </div>
            ) : (
              paginatedCommissions.map((cr) => (
                <div
                  key={cr._id}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#007A6C] bg-[#E6F8F6] px-2 py-0.5 rounded border border-[#00C7BE]/30">
                      {cr.caseId?.caseCode || "AKZ"}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cr.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Billed Amount</span>
                      <strong className="text-slate-900 font-bold">
                        ₹{(cr.billedAmountMinor / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Akeezo Comm (15%)</span>
                      <strong className="text-slate-800 font-bold">
                        ₹{(cr.akeezoCommissionMinor / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Partner Share</span>
                      <strong className="text-[#007A6C] font-bold">
                        ₹{(cr.partnerShareMinor / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Hospital Received</span>
                      <strong className="text-emerald-700 font-bold">
                        ₹{(cr.hospitalReceivedMinor / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 text-[11px]">Due Status:</span>
                    {cr.recoveryDueMinor > 0 ? (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">
                        Clawback ₹{(cr.recoveryDueMinor / 100).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-orange-700 font-bold text-xs">
                        Payable ₹{(Math.max(0, cr.partnerPayableMinor || 0) / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

          {/* Table Pagination */}
          <TablePagination
            currentPage={safeCurrentPage}
            totalItems={filteredCommissions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="commission records"
          />
        </div>

      {/* Record Payment Dialog */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-[#061E1B]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Record Payment Receipt / Partner Payout
            </h3>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Payment Direction
                </label>
                <select
                  value={paymentForm.direction}
                  onChange={(e) => setPaymentForm({ ...paymentForm, direction: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
                >
                  <option value="in_from_hospital">Received from Hospital (Incoming)</option>
                  <option value="out_to_partner">Paid to Partner (Outgoing Payout)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Amount in INR
                </label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Bank Reference / UTR No. *
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Allocate to Commission Record
                </label>
                <select
                  value={paymentForm.targetCommissionRecordId}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, targetCommissionRecordId: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-mono"
                >
                  {commissions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseId?.caseCode || "Case"} - Billed ₹{(c.billedAmountMinor / 100).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-xs px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <DisabledGuideButton
                  type="submit"
                  disabled={
                    !paymentForm.amount ||
                    parseFloat(paymentForm.amount) <= 0 ||
                    !paymentForm.reference.trim() ||
                    !paymentForm.targetCommissionRecordId
                  }
                  reasonTitle="Payment Details Incomplete"
                  reasonMessage="A valid positive amount, banking reference UTR number, and target commission ledger are required."
                  requirements={[
                    {
                      label: "Positive Payment Amount (INR)",
                      fulfilled: Boolean(parseFloat(paymentForm.amount) > 0),
                      tip: "Must be greater than 0",
                    },
                    {
                      label: "Bank Transaction Reference (UTR / Cheque)",
                      fulfilled: Boolean(paymentForm.reference.trim()),
                      tip: "Required for bank audit reconciliation",
                    },
                    {
                      label: "Target Commission Allocation Case",
                      fulfilled: Boolean(paymentForm.targetCommissionRecordId),
                      tip: "Must select a billable case record",
                    },
                  ]}
                  stepsToEnable={[
                    "Enter the received or disbursed INR amount.",
                    "Fill in the bank UTR or remittance reference.",
                    "Select the target case billing record to allocate funds.",
                  ]}
                  placement="top"
                  className={`text-xs px-4 py-2 font-bold rounded-lg shadow-xs transition ${
                    parseFloat(paymentForm.amount) > 0 &&
                    paymentForm.reference.trim() &&
                    paymentForm.targetCommissionRecordId
                      ? "bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Record & Allocate
                </DisabledGuideButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
