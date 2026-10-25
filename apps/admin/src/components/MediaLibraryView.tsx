import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List,
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
  Eye,
} from "lucide-react";

interface MediaAsset {
  _id: string;
  originalFilename: string;
  storedFilename: string;
  storageUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
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

export const MediaLibraryView: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Drawer State
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [typeFilter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const url =
        typeFilter === "all"
          ? "/api/v1/admin/media"
          : `/api/v1/admin/media?type=${typeFilter}`;
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

        setUploadSuccess(
          file.type.includes("svg")
            ? "SVG sanitized and uploaded securely with malicious scripts stripped."
            : "Media asset uploaded and indexed successfully."
        );
        await fetchMedia();
        setTimeout(() => setUploadSuccess(""), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setAltText(asset.altText || "");
    setCaption(asset.caption || "");
    setCopiedUrl(false);
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
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const filteredAssets = assets.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.originalFilename?.toLowerCase().includes(q) ||
      a.altText?.toLowerCase().includes(q) ||
      a.caption?.toLowerCase().includes(q)
    );
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <ImageIcon className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Digital Assets & Media Library</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Media Storage & Asset Management</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Upload hospital photos, procedure illustrations, and brand SVG vectors. Automated SVG sanitization strips malicious JavaScript handlers before storage to protect patient browsers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
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
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload New Asset"}</span>
          </button>
        </div>
      </div>

      {/* Upload Feedback Alerts */}
      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
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
          <div className="text-[10px] text-slate-400">
            Supports PNG, JPEG, WebP, SVG, and PDF documents up to 10MB. SVGs are sanitized automatically.
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename or alt text..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
            >
              <option value="all">All Assets</option>
              <option value="image">Images (PNG/JPG)</option>
              <option value="svg">Vector SVGs</option>
              <option value="document">Documents (PDF/Doc)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid" ? "bg-white text-[#007A6C] shadow-2xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list" ? "bg-white text-[#007A6C] shadow-2xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Asset Display (Grid or List) with Details Drawer */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Collection Area */}
        <div className={`flex-1 ${selectedAsset ? "lg:w-2/3" : "w-full"}`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
              Loading media assets...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
              No media assets found matching the search or type filter.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?._id === asset._id;
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
                          src={asset.storageUrl}
                          alt={asset.altText || asset.originalFilename}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-slate-400" />
                      )}

                      {asset.fileCategory === "svg" && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30">
                          SVG
                        </span>
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
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Uploaded</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map((asset) => (
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
                            <img src={asset.storageUrl} alt="" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <File className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{asset.originalFilename}</td>
                      <td className="py-2.5 px-4 uppercase text-[10px] font-bold text-slate-500">
                        {asset.mimeType}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{formatBytes(asset.sizeBytes)}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyUrl(asset.storageUrl);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded-lg mr-1"
                          title="Copy URL"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Drawer */}
        {selectedAsset && (
          <div className="lg:w-80 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 shrink-0 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Asset Details
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
                  src={selectedAsset.storageUrl}
                  alt={selectedAsset.altText || ""}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <FileText className="w-16 h-16 text-slate-400" />
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
              onClick={() => copyUrl(selectedAsset.storageUrl)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
            >
              {copiedUrl ? (
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
    </div>
  );
};
