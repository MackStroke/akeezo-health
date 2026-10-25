import React, { useState, useEffect } from "react";
import { DollarSign, ArrowDownLeft, ArrowUpRight, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

interface FinanceWorkspaceProps {
  onRefresh: () => void;
}

export const FinanceWorkspace: React.FC<FinanceWorkspaceProps> = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
      const res = await fetch("/api/v1/commission-records");
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

      const res = await fetch("/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowPaymentModal(false);
        fetchCommissions();
      } else {
        const err = await res.json();
        alert(err.error?.message || "Failed to record payment");
      }
    } catch (err: any) {
      alert(err.message);
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
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Episode Commission Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3">Case Code</th>
                <th className="p-3">Billed (INR)</th>
                <th className="p-3">Akeezo Commission</th>
                <th className="p-3">Partner Share</th>
                <th className="p-3">Hospital Recd</th>
                <th className="p-3">Partner Paid</th>
                <th className="p-3">Payable Due</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No commission records found.
                  </td>
                </tr>
              ) : (
                commissions.map((cr) => (
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
                <button
                  type="submit"
                  className="text-xs px-4 py-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white font-bold rounded-lg shadow-xs transition"
                >
                  Record & Allocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
