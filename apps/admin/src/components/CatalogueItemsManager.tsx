import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Layers,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export type CatalogueItemType =
  | "doctor"
  | "hospital"
  | "treatment"
  | "destination"
  | "community"
  | "teamMember"
  | "procedure";

export interface CatalogueItemsManagerProps {
  pageSlug: string;
  itemType: CatalogueItemType;
  items: any[];
  collectionKey: string;
  onItemsChange: (newItems: any[]) => void;
  onSaveRevision?: (updatedPayload: any) => Promise<void>;
}

export const CatalogueItemsManager: React.FC<CatalogueItemsManagerProps> = ({
  pageSlug,
  itemType,
  items = [],
  collectionKey,
  onItemsChange,
  onSaveRevision,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filtering
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      String(item.name || item.title || item.patientName || item.country || "").toLowerCase().includes(q) ||
      String(item.specialty || item.category || item.hospital || item.procedureName || "").toLowerCase().includes(q) ||
      String(item.city || item.destinationCountry || "").toLowerCase().includes(q);

    const itemCat = String(item.specialty || item.category || item.country || "General");
    const matchesCat = categoryFilter === "all" || itemCat === categoryFilter;

    return matchesSearch && matchesCat;
  });

  // Extract distinct categories for filter dropdown
  const categories = Array.from(
    new Set(
      items
        .map((i) => i.specialty || i.category || i.country)
        .filter(Boolean)
    )
  );

  // Toggle Active/Inactive
  const handleToggleActive = async (itemId: string, currentActive: boolean) => {
    const updated = items.map((i) => {
      if (String(i.id || i.slug) === String(itemId)) {
        return { ...i, active: !currentActive };
      }
      return i;
    });
    onItemsChange(updated);
    if (onSaveRevision) {
      await onSaveRevision({ [collectionKey]: updated });
    }
  };

  // Delete Item
  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this catalogue entry?")) return;
    const updated = items.filter((i) => String(i.id || i.slug) !== String(itemId));
    onItemsChange(updated);
    if (onSaveRevision) {
      await onSaveRevision({ [collectionKey]: updated });
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    const defaults: Record<string, any> = { active: true };
    if (itemType === "doctor") {
      defaults.name = "";
      defaults.specialty = "Cosmetic/Plastic Surgery";
      defaults.hospital = "Medanta - The Medicity";
      defaults.city = "New Delhi";
      defaults.country = "India";
      defaults.experienceYears = 15;
      defaults.rating = 4.9;
      defaults.reviewCount = 100;
      defaults.consultationFeeUsd = "$80 - $150";
      defaults.image = "/uploads/doctors/doctor-default.jpg";
    } else if (itemType === "hospital") {
      defaults.name = "";
      defaults.city = "New Delhi";
      defaults.country = "India";
      defaults.accreditations = ["JCI", "NABH"];
      defaults.bedsCount = 500;
      defaults.rating = 4.8;
      defaults.specialties = ["Cardiac Surgery", "Oncology"];
      defaults.image = "/uploads/hospitals/hospital-default.jpg";
      defaults.description = "Premier multi-super-specialty healthcare facility.";
    } else if (itemType === "treatment") {
      defaults.title = "";
      defaults.category = "Surgical";
      defaults.description = "Accredited surgical procedure with board-certified specialists.";
      defaults.avgCostAbroad = "$3,500 - $6,000";
      defaults.avgCostHome = "$18,000 - $35,000";
      defaults.recoveryTime = "7 - 14 days";
      defaults.isTopTreatment = false;
      defaults.image = "/uploads/treatments/default.webp";
    } else if (itemType === "destination") {
      defaults.country = "";
      defaults.cityHighlights = "Major healthcare hubs";
      defaults.savingsPercentage = 70;
      defaults.hospitalCount = 25;
      defaults.tagline = "World-class healthcare at 70% lower costs";
      defaults.image = "/uploads/destinations/default.jpg";
    } else if (itemType === "community") {
      defaults.patientName = "";
      defaults.originCountry = "United States";
      defaults.destinationCountry = "India";
      defaults.hospitalName = "Apollo Hospitals";
      defaults.procedureName = "Knee Replacement";
      defaults.rating = 5;
      defaults.reviewText = "";
      defaults.avatarUrl = "/uploads/about/testi-review.webp";
    } else if (itemType === "teamMember") {
      defaults.name = "";
      defaults.role = "Clinical Coordinator";
      defaults.credentials = "MD, FACP";
      defaults.bio = "Dedicated patient advocate and clinical care coordinator.";
      defaults.image = "/uploads/about/team-0.webp";
    } else if (itemType === "procedure") {
      defaults.name = "";
      defaults.category = "Orthopedics";
      defaults.avgCostAbroad = "$4,500";
      defaults.avgCostHome = "$30,000";
      defaults.recoveryDays = "10 - 14 days";
      defaults.savingsPercentage = 75;
      defaults.popular = false;
    }
    setFormData(defaults);
    setIsModalOpen(true);
    setErrorMsg("");
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
    setErrorMsg("");
  };

  // Submit Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    try {
      const displayName = formData.name || formData.title || formData.patientName || formData.country;
      if (!displayName || !String(displayName).trim()) {
        throw new Error("Name / Title is required.");
      }

      let updatedList: any[] = [];
      if (editingItem) {
        // Update existing
        updatedList = items.map((i) => {
          if (String(i.id || i.slug) === String(editingItem.id || editingItem.slug)) {
            return { ...formData, id: editingItem.id || i.id };
          }
          return i;
        });
      } else {
        // Create new
        const id = `item_${Date.now()}`;
        const slug = String(displayName)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9_-]/g, "-")
          .replace(/--+/g, "-");
        const newItem = {
          id,
          slug,
          ...formData,
          active: formData.active !== undefined ? formData.active : true,
        };
        updatedList = [newItem, ...items];
      }

      onItemsChange(updatedList);
      if (onSaveRevision) {
        await onSaveRevision({ [collectionKey]: updatedList });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save item.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${items.length} ${itemType}s...`}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#007A6C]"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Categories ({items.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</span>
        </button>
      </div>

      {/* Catalogue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item, idx) => {
          const title = item.name || item.title || item.patientName || item.country;
          const subtitle = item.specialty || item.category || item.city || item.role || item.destinationCountry;
          const secondary = item.hospital || item.procedureName || item.tagline || item.avgCostAbroad;
          const isActive = item.active !== false;

          return (
            <div
              key={item.id || item.slug || idx}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-white border-slate-200 shadow-2xs hover:shadow-xs"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                {item.image || item.avatarUrl ? (
                  <img
                    src={item.image || item.avatarUrl}
                    alt={title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/uploads/doctors/doctor-default.jpg";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center font-bold text-sm shrink-0">
                    {title ? title.charAt(0) : "A"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate" title={title}>
                      {title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                        isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {subtitle && <p className="text-[11px] font-medium text-slate-500 truncate">{subtitle}</p>}
                  {secondary && <p className="text-[10px] text-slate-400 truncate mt-0.5">{secondary}</p>}

                  {item.rating && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      {item.reviewCount && <span className="text-slate-400 font-normal">({item.reviewCount})</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id || item.slug, isActive)}
                  className={`text-[11px] font-semibold hover:underline ${
                    isActive ? "text-slate-500 hover:text-slate-700" : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-slate-400 hover:text-[#007A6C] rounded transition"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id || item.slug)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-medium">No items match your filter criteria.</p>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? `Edit ${itemType}` : `Add New ${itemType}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title / Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {itemType === "treatment" ? "Treatment Title" : "Name / Title"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || formData.title || formData.patientName || formData.country || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (itemType === "treatment") setFormData({ ...formData, title: val });
                    else if (itemType === "community") setFormData({ ...formData, patientName: val });
                    else if (itemType === "destination") setFormData({ ...formData, country: val });
                    else setFormData({ ...formData, name: val });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              {/* Specialty / Category */}
              {(itemType === "doctor" || itemType === "treatment" || itemType === "procedure") && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty / Category</label>
                  <input
                    type="text"
                    value={formData.specialty || formData.category || ""}
                    onChange={(e) => {
                      if (itemType === "doctor") setFormData({ ...formData, specialty: e.target.value });
                      else setFormData({ ...formData, category: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                  />
                </div>
              )}

              {/* Hospital / Facility */}
              {(itemType === "doctor" || itemType === "community") && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={formData.hospital || formData.hospitalName || ""}
                    onChange={(e) => {
                      if (itemType === "doctor") setFormData({ ...formData, hospital: e.target.value });
                      else setFormData({ ...formData, hospitalName: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                  />
                </div>
              )}

              {/* Location (City & Country) */}
              {(itemType === "doctor" || itemType === "hospital") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country || ""}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Image URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={formData.image || formData.avatarUrl || ""}
                  onChange={(e) => {
                    if (itemType === "community") setFormData({ ...formData, avatarUrl: e.target.value });
                    else setFormData({ ...formData, image: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                  placeholder="/uploads/... or https://..."
                />
              </div>

              {/* Pricing (for Treatments & Procedures) */}
              {(itemType === "treatment" || itemType === "procedure") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cost Abroad</label>
                    <input
                      type="text"
                      value={formData.avgCostAbroad || ""}
                      onChange={(e) => setFormData({ ...formData, avgCostAbroad: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                      placeholder="$2,500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Home Country Cost</label>
                    <input
                      type="text"
                      value={formData.avgCostHome || ""}
                      onChange={(e) => setFormData({ ...formData, avgCostHome: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                      placeholder="$18,000"
                    />
                  </div>
                </div>
              )}

              {/* Description / Review Text / Bio */}
              {(itemType === "hospital" || itemType === "treatment" || itemType === "community" || itemType === "teamMember" || itemType === "destination") && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {itemType === "community" ? "Patient Story / Review Quote" : "Description / Bio"}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || formData.reviewText || formData.bio || formData.tagline || ""}
                    onChange={(e) => {
                      if (itemType === "community") setFormData({ ...formData, reviewText: e.target.value });
                      else if (itemType === "teamMember") setFormData({ ...formData, bio: e.target.value });
                      else if (itemType === "destination") setFormData({ ...formData, tagline: e.target.value });
                      else setFormData({ ...formData, description: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#007A6C] focus:outline-none"
                  />
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-active"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-[#007A6C] focus:ring-[#007A6C]"
                />
                <label htmlFor="modal-active" className="font-bold text-slate-700 select-none cursor-pointer">
                  Active & Displayed on Public Website
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-lg transition disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : editingItem ? "Update Entry" : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
