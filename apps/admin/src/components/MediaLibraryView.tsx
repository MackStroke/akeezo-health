import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
} from "./TablePagination";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileText,
  File,
  X,
  RefreshCw,
  Zap,
  Sliders,
  Sparkles,
  AlertTriangle,
  ArrowDownRight,
  Layers,
  Settings2,
  Info,
  Loader2,
} from "lucide-react";

export interface MediaVariant {
  variant: "thumbnail" | "medium" | "large" | "webp" | "original";
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
}

export interface MediaAsset {
  _id: string;
  originalFilename: string;
  storedFilename: string;
  storageUrl: string;
  url?: string;
  mimeType: string;
  sizeBytes: number;
  originalSizeBytes?: number;
  originalMimeType?: string;
  isWebOptimized?: boolean;
  optimizationSavingsPercent?: number;
  optimizedAt?: string;
  width?: number;
  height?: number;
  variants?: MediaVariant[];
  altText?: string;
  caption?: string;
  fileCategory: "image" | "document" | "svg";
  referencedIn?: {
    entityType: string;
    entityId: string;
    field: string;
  }[];
  createdAt: string;
}

export interface MediaOptimizationStats {
  totalAssets: number;
  optimizedAssets: number;
  unoptimizedAssets: number;
  totalSavedBytes: number;
  savingsPercent: number;
  totalOriginalBytes: number;
  totalCurrentBytes: number;
  formatBreakdown: Record<string, number>;
}

export interface MediaOptimizationSettings {
  autoOptimizeOnUpload: boolean;
  quality: number;
  maxWidth: number;
  maxHeight: number;
  generateVariants: boolean;
  format: "webp" | "original";
  preserveOriginals: boolean;
}

export const MediaLibraryView: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [optimizationFilter, setOptimizationFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimization State
  const [stats, setStats] = useState<MediaOptimizationStats | null>(null);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [batchOptimizing, setBatchOptimizing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<MediaOptimizationSettings>({
    autoOptimizeOnUpload: true,
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1920,
    generateVariants: true,
    format: "webp",
    preserveOriginals: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Edit Drawer State
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  useEffect(() => {
    fetchMedia();
    fetchStats();
    fetchSettings();
  }, [optimizationFilter]);

  // Reset to page 1 on filter, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [optimizationFilter, sizeFilter, searchQuery, sortField, sortDirection]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (optimizationFilter !== "all") {
        params.append("optimizationStatus", optimizationFilter);
      }
      const url = `/api/v1/admin/media?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setAssets(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch media assets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/v1/admin/media/stats");
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch media stats", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/v1/admin/media/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSettings(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch media settings", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/v1/admin/media/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Failed to update media optimization settings.");
        return;
      }
      setSettings(json.data);
      setSettingsOpen(false);
      setUploadSuccess("Web optimization settings saved successfully.");
      setTimeout(() => setUploadSuccess(""), 4000);
    } catch (err: any) {
      alert(`Save settings failed: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Client pre-check (<10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/v1/admin/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalFilename: file.name,
            mimeType: file.type || "application/octet-stream",
            fileData: base64Data,
            altText: file.name.replace(/\.[^/.]+$/, ""),
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          setUploadError(json.error?.message || "Upload failed.");
          return;
        }

        setUploadSuccess(json.message || "Media asset uploaded and processed successfully.");
        await fetchMedia();
        await fetchStats();
        setTimeout(() => setUploadSuccess(""), 5000);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleOptimizeSingle = async (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOptimizingId(asset._id);
    try {
      const res = await fetch(`/api/v1/admin/media/${asset._id}/optimize`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Optimization failed.");
        return;
      }

      setAssets((prev) =>
        prev.map((a) => (a._id === asset._id ? { ...a, ...json.data } : a))
      );
      if (selectedAsset?._id === asset._id) {
        setSelectedAsset({ ...selectedAsset, ...json.data });
      }
      setUploadSuccess(json.message || "Asset converted to WebP successfully.");
      await fetchStats();
      setTimeout(() => setUploadSuccess(""), 5000);
    } catch (err: any) {
      alert(`Optimization error: ${err.message}`);
    } finally {
      setOptimizingId(null);
    }
  };

  const handleBatchOptimizeAll = async () => {
    if (!confirm("Convert all unoptimized PNG and JPEG assets into WebP format now?")) return;
    setBatchOptimizing(true);
    try {
      const res = await fetch("/api/v1/admin/media/optimize-all", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Batch optimization failed.");
        return;
      }

      setUploadSuccess(json.data?.message || "Batch optimization complete.");
      await fetchMedia();
      await fetchStats();
      setTimeout(() => setUploadSuccess(""), 6000);
    } catch (err: any) {
      alert(`Batch optimization error: ${err.message}`);
    } finally {
      setBatchOptimizing(false);
    }
  };

  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setAltText(asset.altText || "");
    setCaption(asset.caption || "");
    setCopiedUrl(null);
  };

  const handleSaveDetails = async () => {
    if (!selectedAsset) return;
    setSavingDetails(true);
    try {
      const res = await fetch(`/api/v1/admin/media/${selectedAsset._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText, caption }),
      });
      if (res.ok) {
        setAssets((prev) =>
          prev.map((a) => (a._id === selectedAsset._id ? { ...a, altText, caption } : a))
        );
        setSelectedAsset({ ...selectedAsset, altText, caption });
      }
    } catch (err: any) {
      alert(`Failed to save details: ${err.message}`);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleDeleteAsset = async (asset: MediaAsset) => {
    const isReferenced = asset.referencedIn && asset.referencedIn.length > 0;
    if (isReferenced) {
      const confirmForce = confirm(
        `WARNING: This file is currently referenced in: ${asset.referencedIn
          ?.map((r) => `${r.entityType}.${r.field}`)
          .join(", ")}. Deleting it will break those references on the live site. Delete anyway?`
      );
      if (!confirmForce) return;
    } else {
      if (!confirm(`Delete asset "${asset.originalFilename}"?`)) return;
    }

    try {
      const res = await fetch(`/api/v1/admin/media/${asset._id}?force=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a._id !== asset._id));
        if (selectedAsset?._id === asset._id) {
          setSelectedAsset(null);
        }
        await fetchStats();
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const copyUrl = (url: string, key = "main") => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Multi-dimensional filtering and sorting pipeline
  const filteredAssets = useMemo(() => {
    let result = assets;

    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.originalFilename?.toLowerCase().includes(q) ||
          a.altText?.toLowerCase().includes(q) ||
          a.caption?.toLowerCase().includes(q) ||
          a.mimeType?.toLowerCase().includes(q)
      );
    }

    // 2. File size filter
    if (sizeFilter !== "all") {
      result = result.filter((a) => {
        const bytes = a.sizeBytes || 0;
        if (sizeFilter === "small") return bytes < 100 * 1024; // < 100 KB
        if (sizeFilter === "medium") return bytes >= 100 * 1024 && bytes <= 1024 * 1024; // 100 KB - 1 MB
        if (sizeFilter === "large") return bytes > 1024 * 1024; // > 1 MB
        return true;
      });
    }

    // 3. Sorting
    return sortItems(result, sortField, sortDirection);
  }, [assets, searchQuery, sizeFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedAssets = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, safeCurrentPage, pageSize]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (optimizationFilter !== "all" ? 1 : 0) +
    (sizeFilter !== "all" ? 1 : 0) +
    (sortField !== "createdAt" || sortDirection !== "desc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setOptimizationFilter("all");
    setSizeFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatPercentage = (percent?: number) => {
    if (!percent || percent <= 0) return null;
    return `-${percent}%`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Zap className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Digital Media & Web Optimization Engine</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Media Storage & Asset Management</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Store, manage, and deliver medical photography, procedure diagrams, and vector logos in next-gen WebP format.
            Automated image bounding, responsive resolution variants, and SVG script sanitization accelerate page load speeds across patient mobile networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition active:scale-98"
            title="Configure WebP conversion quality and responsive variants"
          >
            <Settings2 className="w-4 h-4 text-[#00C7BE]" />
            <span>Optimization Rules</span>
          </button>

          {stats && stats.unoptimizedAssets > 0 && (
            <button
              onClick={handleBatchOptimizeAll}
              disabled={batchOptimizing}
              className="flex items-center gap-1.5 bg-[#00C7BE] hover:bg-[#00b3aa] text-[#061E1B] font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition disabled:opacity-60 active:scale-98"
            >
              {batchOptimizing ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#061E1B]" />
              ) : (
                <Zap className="w-4 h-4 text-[#061E1B]" />
              )}
              <span>{batchOptimizing ? "Optimizing Assets..." : `Optimize All (${stats.unoptimizedAssets})`}</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept="image/*,.svg,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? "Transcoding..." : "Upload Asset"}</span>
          </button>
        </div>
      </div>

      {/* 2. Web Optimization Metrics KPI Bar */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Optimization Ratio */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Web-Optimized Assets</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{stats.optimizedAssets}</span>
                <span className="text-xs font-semibold text-slate-400">/ {stats.totalAssets} total</span>
              </div>
              <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#007A6C] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.totalAssets > 0 ? (stats.optimizedAssets / stats.totalAssets) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Bandwidth Savings */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bandwidth Saved</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-emerald-600">
                  {formatBytes(stats.totalSavedBytes)}
                </span>
                {stats.savingsPercent > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                    -{stats.savingsPercent}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Faster page loads across mobile 4G/5G</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Format Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Format Distribution</span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#007A6C]">
                  <span className="w-2 h-2 rounded-full bg-[#007A6C]" />
                  {stats.formatBreakdown?.webp || 0} WebP
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  {stats.formatBreakdown?.svg || 0} SVG
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {(stats.formatBreakdown?.png || 0) + (stats.formatBreakdown?.jpeg || 0)} Legacy
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {stats.unoptimizedAssets > 0 ? `${stats.unoptimizedAssets} files can be converted` : "All images in WebP format"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#007A6C] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Vector Protection */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SVG Sanitization</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{stats.formatBreakdown?.svg || 0}</span>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>
              <p className="text-[10px] text-slate-400">Scripts & DOM handlers stripped safely</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Upload Feedback Alerts */}
      {uploadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{uploadSuccess}</span>
          </div>
          <button onClick={() => setUploadSuccess("")} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {uploadError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{uploadError}</span>
          </div>
          <button onClick={() => setUploadError("")} className="text-rose-700 hover:text-rose-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-6 border-2 border-dashed border-slate-300 hover:border-[#007A6C] hover:bg-[#E6F8F6]/20 bg-white rounded-2xl text-center cursor-pointer transition shadow-2xs group"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#E6F8F6] text-slate-500 group-hover:text-[#007A6C] flex items-center justify-center transition">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800">
            Drag and drop assets here, or <span className="text-[#007A6C] underline">browse files</span>
          </div>
          <div className="text-[11px] text-slate-500 max-w-xl">
            Supports PNG, JPEG, WebP, SVG vectors, and PDF documents up to 10MB.
            {settings.autoOptimizeOnUpload ? (
              <span className="text-[#007A6C] font-semibold"> Auto-optimization to WebP is active ({settings.quality}% quality).</span>
            ) : (
              <span className="text-slate-400"> (Auto-optimization is currently paused).</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, alt text, or format..."
            className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Format / Optimization Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Format:</span>
            <select
              value={optimizationFilter}
              onChange={(e) => setOptimizationFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
            >
              <option value="all">All Formats</option>
              <option value="optimized">⚡ Web-Optimized (WebP & SVG)</option>
              <option value="unoptimized">⚠️ Needs Optimization (PNG/JPEG)</option>
              <option value="webp">WebP Images Only</option>
              <option value="svg">Vector SVGs</option>
              <option value="document">Documents (PDF)</option>
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Size:</span>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
            >
              <option value="all">All Sizes</option>
              <option value="small">&lt; 100 KB</option>
              <option value="medium">100 KB - 1 MB</option>
              <option value="large">&gt; 1 MB</option>
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

          <ViewToggle
            mode={viewMode === "grid" ? "grid" : "table"}
            onChange={(m) => setViewMode(m === "grid" ? "grid" : "list")}
          />
        </div>
      </div>

      {/* Main Asset Display (Grid or List) with Details Drawer */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Collection Area */}
        <div className={`flex-1 ${selectedAsset ? "lg:w-2/3" : "w-full"}`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#007A6C]" />
              <span>Loading media library...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
              No media assets found matching the selected filter.
            </div>
          ) : viewMode === "grid" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {paginatedAssets.map((asset) => {
                  const isSelected = selectedAsset?._id === asset._id;
                  const isOptimizingThis = optimizingId === asset._id;
                  const isWebp = asset.mimeType === "image/webp";
                  const isSvg = asset.fileCategory === "svg" || asset.mimeType === "image/svg+xml";
                  const isUnoptimizedRaster =
                    !asset.isWebOptimized &&
                    (asset.mimeType === "image/png" ||
                      asset.mimeType === "image/jpeg" ||
                      asset.mimeType === "image/jpg");

                  return (
                    <div
                      key={asset._id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`bg-white rounded-2xl border p-3 flex flex-col justify-between cursor-pointer transition shadow-2xs group relative ${
                        isSelected
                          ? "border-[#007A6C] ring-2 ring-[#00C7BE]"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Media Preview Box */}
                      <div className="h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 relative">
                        {asset.fileCategory === "image" || asset.fileCategory === "svg" ? (
                          <img
                            src={asset.storageUrl || asset.url}
                            alt={asset.altText || asset.originalFilename}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <FileText className="w-12 h-12 text-slate-400" />
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1">
                          {isWebp ? (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30 flex items-center gap-0.5 shadow-2xs">
                              <Zap className="w-2.5 h-2.5 text-[#00C7BE]" />
                              <span>WebP{formatPercentage(asset.optimizationSavingsPercent) ? ` · ${formatPercentage(asset.optimizationSavingsPercent)}` : ""}</span>
                            </span>
                          ) : isSvg ? (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#007A6C] text-white flex items-center gap-0.5 shadow-2xs">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>SVG</span>
                            </span>
                          ) : isUnoptimizedRaster ? (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                              <span>PNG/JPG</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                              DOC
                            </span>
                          )}
                        </div>

                        {/* Inline Quick Optimization Button on Unoptimized Cards */}
                        {isUnoptimizedRaster && (
                          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition duration-200">
                            <button
                              onClick={(e) => handleOptimizeSingle(asset, e)}
                              disabled={isOptimizingThis}
                              className="w-full py-1.5 px-2 bg-[#007A6C] hover:bg-[#005F54] text-white text-[10px] font-extrabold rounded-lg shadow-md flex items-center justify-center gap-1 transition"
                            >
                              {isOptimizingThis ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Zap className="w-3 h-3 text-[#00C7BE]" />
                              )}
                              <span>{isOptimizingThis ? "Converting..." : "Convert to WebP"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-slate-900 truncate" title={asset.originalFilename}>
                          {asset.originalFilename}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{formatBytes(asset.sizeBytes)}</span>
                          <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Pagination Controls */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <TablePagination
                  currentPage={safeCurrentPage}
                  totalItems={filteredAssets.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[12, 24, 48, 96]}
                  itemLabel="media files"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-14">Asset</th>
                    <SortHeader
                      label="Filename"
                      field="originalFilename"
                      currentField={sortField}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                      className="py-3 px-4"
                    />
                    <th className="py-3 px-4">Format / State</th>
                    <SortHeader
                      label="Size"
                      field="sizeBytes"
                      currentField={sortField}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                      className="py-3 px-4"
                    />
                    <SortHeader
                      label="Savings %"
                      field="optimizationSavingsPercent"
                      currentField={sortField}
                      currentDirection={sortDirection}
                      onSort={handleSort}
                      className="py-3 px-4"
                    />
                    <SortHeader
                      label="Uploaded"
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
                  {paginatedAssets.map((asset) => {
                    const isOptimizingThis = optimizingId === asset._id;
                    const isWebp = asset.mimeType === "image/webp";
                    const isSvg = asset.fileCategory === "svg" || asset.mimeType === "image/svg+xml";
                    const isUnoptimizedRaster =
                      !asset.isWebOptimized &&
                      (asset.mimeType === "image/png" ||
                        asset.mimeType === "image/jpeg" ||
                        asset.mimeType === "image/jpg");

                    return (
                      <tr
                        key={asset._id}
                        onClick={() => handleSelectAsset(asset)}
                        className={`hover:bg-slate-50 cursor-pointer transition ${
                          selectedAsset?._id === asset._id ? "bg-[#E6F8F6]/40" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 w-12">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                            {asset.fileCategory === "image" || asset.fileCategory === "svg" ? (
                              <img src={asset.storageUrl || asset.url} alt="" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <File className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          <div className="truncate max-w-[200px]" title={asset.originalFilename}>
                            {asset.originalFilename}
                          </div>
                          {asset.width && asset.height && (
                            <div className="text-[10px] text-slate-400">
                              {asset.width} × {asset.height} px
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {isWebp ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Zap className="w-3 h-3 text-emerald-600" />
                              <span>WebP Optimized</span>
                            </span>
                          ) : isSvg ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F8F6] text-[#007A6C] border border-[#00C7BE]/30">
                              <ShieldCheck className="w-3 h-3 text-[#007A6C]" />
                              <span>Sanitized SVG</span>
                            </span>
                          ) : isUnoptimizedRaster ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Needs WebP</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              Document
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium">
                          {formatBytes(asset.sizeBytes)}
                        </td>
                        <td className="py-2.5 px-4">
                          {asset.optimizationSavingsPercent && asset.optimizationSavingsPercent > 0 ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              -{asset.optimizationSavingsPercent}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isUnoptimizedRaster && (
                              <button
                                onClick={(e) => handleOptimizeSingle(asset, e)}
                                disabled={isOptimizingThis}
                                className="px-2 py-1 text-[10px] font-extrabold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] rounded-lg transition border border-[#00C7BE]/30 flex items-center gap-1"
                                title="Convert to WebP"
                              >
                                {isOptimizingThis ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3 text-[#007A6C]" />
                                )}
                                <span>Optimize</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyUrl(asset.storageUrl || asset.url || "");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
                              title="Copy Public URL"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAsset(asset);
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                              title="Delete asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table Pagination Controls */}
              <TablePagination
                currentPage={safeCurrentPage}
                totalItems={filteredAssets.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[12, 24, 48, 96]}
                itemLabel="media files"
              />
            </div>
          )}
        </div>

        {/* Details Drawer */}
        {selectedAsset && (
          <div className="lg:w-84 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 shrink-0 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#007A6C]" />
                <span>Asset Technical Details</span>
              </span>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="h-44 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-3 relative">
              {selectedAsset.fileCategory === "image" || selectedAsset.fileCategory === "svg" ? (
                <img
                  src={selectedAsset.storageUrl || selectedAsset.url}
                  alt={selectedAsset.altText || ""}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <FileText className="w-16 h-16 text-slate-400" />
              )}
            </div>

            {/* Web Optimization Card in Drawer */}
            <div className="p-3 rounded-xl border bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#007A6C]" />
                  <span>Web Optimization</span>
                </span>
                {selectedAsset.isWebOptimized || selectedAsset.mimeType === "image/webp" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Web-Optimized WebP
                  </span>
                ) : selectedAsset.fileCategory === "svg" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F8F6] text-[#007A6C]">
                    Clean Vector
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Unoptimized
                  </span>
                )}
              </div>

              {/* Before vs After Size Reduction */}
              {selectedAsset.originalSizeBytes && selectedAsset.originalSizeBytes > selectedAsset.sizeBytes ? (
                <div className="space-y-1 text-xs pt-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Original ({selectedAsset.originalMimeType || "raster"}):</span>
                    <span className="line-through">{formatBytes(selectedAsset.originalSizeBytes)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-emerald-700">Optimized WebP:</span>
                    <span className="text-emerald-700 flex items-center gap-1">
                      {formatBytes(selectedAsset.sizeBytes)}
                      <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        -{selectedAsset.optimizationSavingsPercent}%
                      </span>
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Action to optimize if unoptimized raster */}
              {!selectedAsset.isWebOptimized &&
                (selectedAsset.mimeType === "image/png" ||
                  selectedAsset.mimeType === "image/jpeg" ||
                  selectedAsset.mimeType === "image/jpg") && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleOptimizeSingle(selectedAsset)}
                      disabled={optimizingId === selectedAsset._id}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#007A6C] hover:bg-[#005F54] text-white text-xs font-bold transition shadow-xs disabled:opacity-60"
                    >
                      {optimizingId === selectedAsset._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-[#00C7BE]" />
                      )}
                      <span>
                        {optimizingId === selectedAsset._id
                          ? "Transcoding to WebP..."
                          : "⚡ Transcode to WebP Now"}
                      </span>
                    </button>
                    <p className="text-[10px] text-slate-500 mt-1 text-center">
                      Converts image to modern WebP with -60% to -80% file size reduction.
                    </p>
                  </div>
                )}

              {/* Responsive Variants List */}
              {selectedAsset.variants && selectedAsset.variants.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Responsive WebP Variants
                  </span>
                  <div className="space-y-1">
                    {selectedAsset.variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 bg-white rounded-lg border border-slate-200 text-[11px] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-800 uppercase text-[10px] mr-1.5">
                            {v.variant}
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            {v.width}×{v.height} · {formatBytes(v.sizeBytes)}
                          </span>
                        </div>
                        <button
                          onClick={() => copyUrl(v.url, `variant-${idx}`)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Copy variant URL"
                        >
                          {copiedUrl === `variant-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Metadata */}
            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Original:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                  {selectedAsset.originalFilename}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stored:</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">
                  {selectedAsset.storedFilename}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MIME Type:</span>
                <span className="font-semibold text-slate-700">{selectedAsset.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dimensions:</span>
                <span>
                  {selectedAsset.width && selectedAsset.height
                    ? `${selectedAsset.width} × ${selectedAsset.height} px`
                    : "Vector / Document"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size:</span>
                <span>{formatBytes(selectedAsset.sizeBytes)}</span>
              </div>
            </div>

            {/* Copy Public URL Button */}
            <button
              onClick={() => copyUrl(selectedAsset.storageUrl || selectedAsset.url || "", "main")}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
            >
              {copiedUrl === "main" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">URL Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Public Asset URL</span>
                </>
              )}
            </button>

            {/* References / Usage List */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700">Referenced In:</span>
              {selectedAsset.referencedIn && selectedAsset.referencedIn.length > 0 ? (
                <div className="space-y-1">
                  {selectedAsset.referencedIn.map((ref, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between"
                    >
                      <span className="font-semibold">{ref.entityType}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ref.field}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  Not currently referenced in any page or brand setting.
                </div>
              )}
            </div>

            {/* Alt Text & Caption Form */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe image for screen readers"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caption / Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Optional caption"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteAsset(selectedAsset)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={savingDetails}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition shadow-2xs disabled:opacity-60"
                >
                  {savingDetails ? "Saving..." : "Save Details"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Web Optimization Settings Modal Dialog */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Web Optimization Rules</h3>
                  <p className="text-[11px] text-slate-500">Fine-tune automated WebP conversion & dimension bounding</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Toggle: Auto-Optimize on Upload */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Convert on Upload to WebP</div>
                  <div className="text-[11px] text-slate-500">
                    Transcodes PNG and JPEG uploads into WebP format immediately upon upload.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoOptimizeOnUpload}
                    onChange={(e) => setSettings({ ...settings, autoOptimizeOnUpload: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007A6C]"></div>
                </label>
              </div>

              {/* Slider: WebP Quality */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">WebP Compression Quality</label>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#007A6C] text-white">
                    {settings.quality}% {settings.quality === 80 ? "(Recommended)" : ""}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#007A6C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>50% (Max Compression)</span>
                  <span>80% (Balanced)</span>
                  <span>95% (Near Lossless)</span>
                </div>
              </div>

              {/* Dropdown: Max Width Resolution Bounding */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Maximum Dimension Bounding
                </label>
                <select
                  value={settings.maxWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSettings({ ...settings, maxWidth: val, maxHeight: val });
                  }}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#007A6C] focus:outline-none font-medium"
                >
                  <option value="1920">1920 px (Full HD 1080p - Recommended)</option>
                  <option value="2560">2560 px (2K QHD Retina)</option>
                  <option value="3840">3840 px (4K Ultra HD)</option>
                  <option value="1280">1280 px (Compact Mobile)</option>
                </select>
                <div className="text-[10px] text-slate-400">
                  Images exceeding this resolution are scaled down proportionally, preserving aspect ratio.
                </div>
              </div>

              {/* Toggle: Generate Responsive Variants */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Generate Responsive Variants</div>
                  <div className="text-[11px] text-slate-500">
                    Creates thumbnail (320w) and medium (768w) WebP files for srcset tags.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.generateVariants}
                    onChange={(e) => setSettings({ ...settings, generateVariants: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007A6C]"></div>
                </label>
              </div>

              {/* Toggle: Preserve Original Uncompressed File */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Preserve Original File</div>
                  <div className="text-[11px] text-slate-500">
                    Retains backup of the original uncompressed image on disk.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preserveOriginals}
                    onChange={(e) => setSettings({ ...settings, preserveOriginals: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007A6C]"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#007A6C] hover:bg-[#005F54] transition shadow-md flex items-center gap-1.5 disabled:opacity-60"
                >
                  {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{savingSettings ? "Saving Rules..." : "Save Optimization Rules"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
