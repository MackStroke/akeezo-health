import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Filter,
  Download,
  Upload,
  ExternalLink,
  ArrowLeft,
  Eye,
  FileSpreadsheet,
  FileText,
  Sliders,
  Save,
  Globe,
  Share2,
  RefreshCw,
  Stethoscope,
  Activity,
  Layers,
  ChevronDown,
  DollarSign,
  Bed,
  HelpCircle,
} from "lucide-react";
import { getHospitalDetail } from "@akeezo/contracts";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
} from "./TablePagination.js";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "@akeezo/ui";
import {
  exportToCsv,
  exportToJson,
  exportToExcel,
  parseImportedFile,
  type ExportColumn,
} from "../utils/exportImport.js";

export type DirectoryPageSlug = "doctors" | "hospitals" | "treatments" | "destinations";

interface DirectoryModuleManagerProps {
  pageSlug: DirectoryPageSlug;
}

export const DirectoryModuleManager: React.FC<DirectoryModuleManagerProps> = ({ pageSlug }) => {
  const { token } = useAuth();
  const toast = useToast();

  // Navigation / View State: "list" | "profile" | "page-settings"
  const [currentView, setCurrentView] = useState<"list" | "profile" | "page-settings">("list");
  const [activeProfileTab, setActiveProfileTab] = useState<string>("basic");

  // Page Level Data
  const [pageTitle, setPageTitle] = useState("");
  const [pagePayload, setPagePayload] = useState<Record<string, any>>({});
  const [pageSeo, setPageSeo] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Items in Catalog
  const [items, setItems] = useState<any[]>([]);

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Sorting & Pagination
  const [sortField, setSortField] = useState<string | null>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Profile Editor State (Doctor or Hospital Full-Page)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [profileFormData, setProfileFormData] = useState<Record<string, any>>({});

  // Hospital Sub-item Form States
  const [newSurgeryCost, setNewSurgeryCost] = useState({
    procedure: "",
    category: "Cosmetic Surgery",
    hospitalPriceUsd: "$2,500",
    usUkPriceUsd: "$8,000",
    savingsPercent: 65,
    description: "Complete procedure including accredited surgeon and stay.",
  });
  const [newRoomType, setNewRoomType] = useState({
    name: "",
    description: "",
    amenities: "Private Bathroom, Wi-Fi, Smart TV, Nurse Call",
  });
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
  });

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [importParsing, setImportParsing] = useState(false);
  const [importError, setImportError] = useState("");

  // Export dropdown
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Determine collection key based on pageSlug
  const collectionKey = useMemo(() => {
    switch (pageSlug) {
      case "doctors": return "doctors";
      case "hospitals": return "hospitals";
      case "treatments": return "treatments";
      case "destinations": return "destinations";
      default: return "items";
    }
  }, [pageSlug]);

  // Singular / Plural Titles
  const entityLabels = useMemo(() => {
    switch (pageSlug) {
      case "doctors": return { singular: "Doctor", plural: "Doctors", icon: Stethoscope };
      case "hospitals": return { singular: "Hospital", plural: "Hospitals", icon: Building2 };
      case "treatments": return { singular: "Treatment", plural: "Treatments", icon: Activity };
      case "destinations": return { singular: "Destination", plural: "Destinations", icon: MapPin };
      default: return { singular: "Item", plural: "Items", icon: Layers };
    }
  }, [pageSlug]);

  // Fetch Page Data from backend
  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/pages/${pageSlug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};
        setPageTitle(data.title || `${entityLabels.plural} | AKEEZO`);
        const payload = data.payload || {};
        setPagePayload(payload);
        setPageSeo(data.seo || {});

        const rawList = Array.isArray(payload[collectionKey]) ? payload[collectionKey] : [];
        setItems(rawList);
      }
    } catch (err: any) {
      console.error("Failed to fetch page data", err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug, collectionKey, token, entityLabels.plural]);

  useEffect(() => {
    fetchPageData();
    setSelectedIds(new Set());
    setCurrentView("list");
  }, [pageSlug, collectionKey, token]);

  // Check URL query parameters on initial pageSlug load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      const action = params.get("action");
      if (editId && items.length > 0) {
        const target = items.find((i) => String(i.id || i.slug) === editId);
        if (target) {
          setEditingItem(target);
          setIsNewItem(false);
          setProfileFormData({ ...target });
          setActiveProfileTab("basic");
          setCurrentView("profile");
        }
      } else if (action === "new") {
        openNewProfileEditor(false);
      }
    }
  }, [pageSlug]);

  // Save changes to backend revision
  const persistChanges = async (newItemsList: any[], newPayloadOverrides: Record<string, any> = {}) => {
    try {
      setSaving(true);
      const updatedPayload = {
        ...pagePayload,
        ...newPayloadOverrides,
        [collectionKey]: newItemsList,
      };

      const res = await fetch(`/api/v1/admin/pages/${pageSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: pageTitle,
          payload: updatedPayload,
          seo: pageSeo,
          publishImmediately: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || "Failed to update page data");
      }

      setItems(newItemsList);
      setPagePayload(updatedPayload);
      toast.success(`Saved and published ${entityLabels.plural} catalog.`);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Save failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Columns specification for export and table
  const exportColumns: ExportColumn[] = useMemo(() => {
    if (pageSlug === "doctors") {
      return [
        { key: "name", label: "Doctor Name" },
        { key: "slug", label: "Slug" },
        { key: "specialty", label: "Specialty" },
        { key: "hospital", label: "Hospital" },
        { key: "city", label: "City" },
        { key: "country", label: "Country" },
        { key: "experienceYears", label: "Experience (Years)" },
        { key: "rating", label: "Rating" },
        { key: "reviewCount", label: "Reviews" },
        { key: "consultationFeeUsd", label: "Consultation Fee" },
        { key: "active", label: "Status", formatter: (val) => (val !== false ? "Active" : "Inactive") },
      ];
    } else if (pageSlug === "hospitals") {
      return [
        { key: "name", label: "Hospital Name" },
        { key: "slug", label: "Slug" },
        { key: "city", label: "City" },
        { key: "country", label: "Country" },
        { key: "bedsCount", label: "Beds Capacity" },
        { key: "rating", label: "Rating" },
        { key: "reviewCount", label: "Reviews" },
        { key: "accreditations", label: "Accreditations", formatter: (val) => (Array.isArray(val) ? val.join("; ") : String(val || "")) },
        { key: "active", label: "Status", formatter: (val) => (val !== false ? "Active" : "Inactive") },
      ];
    } else if (pageSlug === "treatments") {
      return [
        { key: "title", label: "Treatment Title" },
        { key: "slug", label: "Slug" },
        { key: "category", label: "Category" },
        { key: "avgCostAbroad", label: "Cost Abroad" },
        { key: "avgCostHome", label: "Cost Home" },
        { key: "recoveryTime", label: "Recovery Time" },
        { key: "isTopTreatment", label: "Featured Top", formatter: (val) => (val ? "Yes" : "No") },
        { key: "active", label: "Status", formatter: (val) => (val !== false ? "Active" : "Inactive") },
      ];
    } else {
      return [
        { key: "country", label: "Destination Country" },
        { key: "slug", label: "Slug" },
        { key: "cityHighlights", label: "Highlights" },
        { key: "savingsPercentage", label: "Savings %" },
        { key: "hospitalCount", label: "Partner Hospitals" },
        { key: "tagline", label: "Tagline" },
        { key: "active", label: "Status", formatter: (val) => (val !== false ? "Active" : "Inactive") },
      ];
    }
  }, [pageSlug]);

  // Extract distinct categories & countries for filters
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      const c = i.specialty || i.category;
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [items]);

  const countriesList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      const c = i.country || i.destinationCountry;
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [items]);

  // Filter & Search Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      // 1. Search text
      if (q) {
        const name = String(item.name || item.title || item.country || "").toLowerCase();
        const specialty = String(item.specialty || item.category || "").toLowerCase();
        const hospital = String(item.hospital || "").toLowerCase();
        const city = String(item.city || item.cityHighlights || "").toLowerCase();
        const country = String(item.country || "").toLowerCase();
        const matches =
          name.includes(q) ||
          specialty.includes(q) ||
          hospital.includes(q) ||
          city.includes(q) ||
          country.includes(q);
        if (!matches) return false;
      }

      // 2. Category
      if (categoryFilter !== "all") {
        const itemCat = String(item.specialty || item.category || "");
        if (itemCat !== categoryFilter) return false;
      }

      // 3. Country
      if (countryFilter !== "all") {
        const itemCountry = String(item.country || item.destinationCountry || "");
        if (itemCountry !== countryFilter) return false;
      }

      // 4. Status
      if (statusFilter === "active" && item.active === false) return false;
      if (statusFilter === "inactive" && item.active !== false) return false;

      return true;
    });
  }, [items, searchQuery, categoryFilter, countryFilter, statusFilter]);

  // Sort Items
  const sortedItems = useMemo(() => {
    if (!sortField) return filteredItems;
    return sortItems(filteredItems, sortField, sortDirection);
  }, [filteredItems, sortField, sortDirection]);

  // Paginate Items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

  // Header Sort Click
  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredItems.map((i) => String(i.id || i.slug)));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk Actions
  const handleBulkActivate = async (active: boolean) => {
    if (selectedIds.size === 0) return;
    const updated = items.map((i) => {
      const id = String(i.id || i.slug);
      if (selectedIds.has(id)) {
        return { ...i, active };
      }
      return i;
    });
    await persistChanges(updated);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} ${entityLabels.plural.toLowerCase()}?`)) {
      return;
    }
    const updated = items.filter((i) => !selectedIds.has(String(i.id || i.slug)));
    await persistChanges(updated);
    setSelectedIds(new Set());
  };

  const handleBulkExport = (format: "csv" | "json" | "excel") => {
    const selectedItems = items.filter((i) => selectedIds.has(String(i.id || i.slug)));
    const targetItems = selectedItems.length > 0 ? selectedItems : sortedItems;
    const filename = `${pageSlug}_export_${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      exportToCsv(targetItems, exportColumns, filename);
    } else if (format === "json") {
      exportToJson(targetItems, filename);
    } else if (format === "excel") {
      exportToExcel(targetItems, exportColumns, filename, entityLabels.plural);
    }
    setExportDropdownOpen(false);
    toast.success(`Exported ${targetItems.length} records as ${format.toUpperCase()}.`);
  };

  // Single Item Active Toggle
  const handleToggleActive = async (itemId: string, currentActive: boolean) => {
    const updated = items.map((i) => {
      if (String(i.id || i.slug) === itemId) {
        return { ...i, active: !currentActive };
      }
      return i;
    });
    await persistChanges(updated);
  };

  // Single Item Delete
  const handleDeleteItem = async (itemId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    const updated = items.filter((i) => String(i.id || i.slug) !== itemId);
    await persistChanges(updated);
  };

  // Open Full-Page Profile Editor for Doctor or Hospital
  const openProfileEditor = (item: any, updateHistory: boolean = true) => {
    setEditingItem(item);
    setIsNewItem(false);
    let initialData = { ...item };
    if (pageSlug === "hospitals" && item.slug) {
      const fullDetail = getHospitalDetail(item.slug);
      if (fullDetail) {
        initialData = {
          ...fullDetail,
          ...item,
          surgeriesCost: item.surgeriesCost && item.surgeriesCost.length > 0 ? item.surgeriesCost : fullDetail.surgeriesCost,
          roomTypes: item.roomTypes && item.roomTypes.length > 0 ? item.roomTypes : fullDetail.roomTypes,
          faqs: item.faqs && item.faqs.length > 0 ? item.faqs : fullDetail.faqs,
          highlights: item.highlights && item.highlights.length > 0 ? item.highlights : fullDetail.highlights,
          accessibilityFeatures: item.accessibilityFeatures && item.accessibilityFeatures.length > 0 ? item.accessibilityFeatures : fullDetail.accessibilityFeatures,
          location: item.location || fullDetail.location,
        };
      }
    }
    setProfileFormData(initialData);
    setActiveProfileTab("basic");
    setCurrentView("profile");

    if (updateHistory && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("edit", String(item.id || item.slug));
      url.searchParams.delete("action");
      window.history.pushState(null, "", url.pathname + url.search);
    }
  };

  const openNewProfileEditor = (updateHistory: boolean = true) => {
    setEditingItem(null);
    setIsNewItem(true);
    setActiveProfileTab("basic");

    const defaults: Record<string, any> = { active: true, verified: true };
    if (pageSlug === "doctors") {
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
      defaults.accreditations = ["JCI", "NABH"];
      defaults.bio = "Dedicated specialist providing world-class surgical care.";
      defaults.procedures = ["Cosmetic Consultation", "Surgical Evaluation"];
    } else if (pageSlug === "hospitals") {
      defaults.name = "";
      defaults.slug = "";
      defaults.city = "Bangkok";
      defaults.country = "Thailand";
      defaults.address = "454 Charan Sanitwong Road, Bang O, Bang Phlat, Bangkok 10700";
      defaults.phone = "+66 2 879 0300";
      defaults.rankBadge = "Ranked #12 in Thailand - Newsweek World's Best Hospitals 2024";
      defaults.accreditations = ["JCI", "ISO 9001", "HA Thailand"];
      defaults.bedsCount = 400;
      defaults.icuCount = 18;
      defaults.operatingRooms = 42;
      defaults.establishedYear = 1984;
      defaults.dailyPatients = "2,000+ Patients Daily";
      defaults.doctorsCount = "270+ Doctors";
      defaults.nursesCount = "500+ Nurses";
      defaults.rating = 75.21;
      defaults.reviewCount = 350;
      defaults.languagesSpoken = ["English", "Thai", "Arabic", "French", "German", "Mandarin", "Japanese"];
      defaults.specialties = ["Cosmetic & Plastic Surgery", "Gender Affirmation", "Bariatric Surgery", "Dental & Maxillofacial", "Cardiology", "Orthopedics"];
      defaults.image = "/uploads/hospitals/yanhee-main.webp";
      defaults.images = [
        "/uploads/hospitals/yanhee-main.webp",
        "/uploads/hospitals/yanhee-entrance.webp",
        "/uploads/hospitals/yanhee-ot.webp",
        "/uploads/hospitals/yanhee-ward.webp"
      ];
      defaults.summary = "Founded in 1984, Yanhee International Hospital is one of Asia's premier multi-specialty medical destinations.";
      defaults.aboutMarkdown = "Founded in 1984, Yanhee International Hospital has evolved from a modest outpatient clinic into a globally recognized tertiary healthcare landmark in Bangkok.";
      defaults.highlights = [
        "JCI-Accredited Excellence with patient safety benchmarks",
        "Ranked #12 in Thailand - Newsweek World's Best Hospitals 2024",
        "Over 75% of international patients are repeat visitors or direct referrals",
        "English, Arabic, French, German, Mandarin, and Japanese interpreters"
      ];
      defaults.accessibilityFeatures = [
        "Wheelchair-accessible entrances, elevators, and wide corridors throughout all wards",
        "Dedicated international patient coordination center with airport transfer"
      ];
      defaults.surgeriesCost = [
        {
          id: "cost-1",
          procedure: "Breast Augmentation (Mentor Implants)",
          category: "Cosmetic Surgery",
          hospitalPriceUsd: "$3,200",
          usUkPriceUsd: "$8,500",
          savingsPercent: 62,
          description: "Mentor FDA-approved silicone implants including surgical fees, anesthesia, and overnight hospital stay."
        },
        {
          id: "cost-2",
          procedure: "Facelift (Full rhytidectomy)",
          category: "Cosmetic Surgery",
          hospitalPriceUsd: "$4,100",
          usUkPriceUsd: "$12,000",
          savingsPercent: 66,
          description: "Comprehensive SMAS flap elevation, platysmaplasty, and 2 nights private room stay."
        },
        {
          id: "cost-3",
          procedure: "Rhinoplasty (Open structural)",
          category: "Cosmetic Surgery",
          hospitalPriceUsd: "$1,850",
          usUkPriceUsd: "$7,200",
          savingsPercent: 74,
          description: "Open structural rhinoplasty with cartilage grafting, post-op splints, and specialist consultation."
        },
        {
          id: "cost-4",
          procedure: "Sleeve Gastrectomy (Bariatric)",
          category: "Bariatric Surgery",
          hospitalPriceUsd: "$6,500",
          usUkPriceUsd: "$17,000",
          savingsPercent: 62,
          description: "Minimally invasive laparoscopic resection with multidisciplinary bariatric post-op follow-up."
        }
      ];
      defaults.roomTypes = [
        {
          name: "VIP Single Suite",
          description: "Spacious private bedroom with separate living room, en-suite bathroom, electric adjustable bed, and nurse call system.",
          amenities: ["Private Bathroom", "High-speed Wi-Fi", "Two Smart TVs", "Refrigerator & Microwave", "Guest Sofa Bed", "Nurse Call System"]
        },
        {
          name: "Deluxe Single Room",
          description: "Comfortable private room designed for patient recovery and privacy, equipped with companion daybed and private en-suite bathroom.",
          amenities: ["Private Bathroom", "Wi-Fi", "Smart TV", "Mini Refrigerator", "Companion Bed", "Direct Phone Line"]
        }
      ];
      defaults.paymentMethods = [
        "Cash (Thai Baht, US Dollars, Euros)",
        "Credit Cards (Visa, MasterCard, JCB, UnionPay)",
        "Direct Bank Wire Transfer (SWIFT)",
        "International Travel & Medical Insurance Guarantees"
      ];
      defaults.faqs = [
        {
          question: "How long before surgery should I arrive in Bangkok?",
          answer: "For most surgical procedures, we recommend arriving 1 to 2 days prior to your scheduled surgery date for in-person evaluations and lab tests."
        },
        {
          question: "Does the hospital provide airport transfers?",
          answer: "Yes, Yanhee International Hospital provides airport pickup and drop-off coordination from Suvarnabhumi (BKK) and Don Mueang (DMK) airports."
        }
      ];
    } else if (pageSlug === "treatments") {
      defaults.title = "";
      defaults.category = "Surgical";
      defaults.avgCostAbroad = "$3,500 - $6,000";
      defaults.avgCostHome = "$18,000 - $35,000";
      defaults.recoveryTime = "7 - 14 days";
      defaults.image = "/uploads/treatments/default.webp";
      defaults.description = "Comprehensive clinical procedure performed by accredited surgeons.";
    } else {
      defaults.country = "";
      defaults.cityHighlights = "Major healthcare hub";
      defaults.savingsPercentage = 70;
      defaults.hospitalCount = 20;
      defaults.tagline = "World-class healthcare at 70% lower costs";
      defaults.image = "/uploads/destinations/default.jpg";
    }

    setProfileFormData(defaults);
    setCurrentView("profile");

    if (updateHistory && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("action", "new");
      url.searchParams.delete("edit");
      window.history.pushState(null, "", url.pathname + url.search);
    }
  };

  const closeProfileEditor = () => {
    setCurrentView("list");
    setEditingItem(null);
    setIsNewItem(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      url.searchParams.delete("action");
      window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  // Save Doctor / Hospital Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = profileFormData.name || profileFormData.title || profileFormData.country;
    if (!displayName || !String(displayName).trim()) {
      toast.error("Name / Title is mandatory.");
      return;
    }

    let updatedList: any[] = [];
    if (editingItem) {
      // Update existing
      updatedList = items.map((i) => {
        if (String(i.id || i.slug) === String(editingItem.id || editingItem.slug)) {
          return {
            ...profileFormData,
            id: editingItem.id || i.id,
            slug: profileFormData.slug || editingItem.slug || i.slug,
          };
        }
        return i;
      });
    } else {
      // Create new item
      const id = `item_${Date.now()}`;
      const slug = (profileFormData.slug || String(displayName))
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/--+/g, "-");

      const newItem = {
        id,
        slug,
        ...profileFormData,
        active: profileFormData.active !== undefined ? profileFormData.active : true,
      };
      updatedList = [newItem, ...items];
    }

    const success = await persistChanges(updatedList);
    if (success) {
      closeProfileEditor();
    }
  };

  // Handle File Selection for Import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportError("");
    setImportParsing(true);
    try {
      const parsedRows = await parseImportedFile(file);
      if (!parsedRows || parsedRows.length === 0) {
        throw new Error("No readable records found in the uploaded file.");
      }
      setImportedPreview(parsedRows);
    } catch (err: any) {
      setImportError(err.message || "Failed to parse file.");
      setImportedPreview([]);
    } finally {
      setImportParsing(false);
    }
  };

  // Execute Import
  const handleConfirmImport = async () => {
    if (importedPreview.length === 0) return;

    const normalizedRecords = importedPreview.map((row, idx) => {
      const displayName =
        row.name ||
        row.title ||
        row.country ||
        row["Doctor Name"] ||
        row["Hospital Name"] ||
        row["Treatment Title"] ||
        row["Destination Country"] ||
        `Imported_${idx + 1}`;

      const slug = String(displayName)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/--+/g, "-");

      const base: Record<string, any> = {
        id: row.id || `imp_${Date.now()}_${idx}`,
        slug,
        active: row.active !== undefined ? String(row.active).toLowerCase() === "true" || row.active === true : true,
      };

      if (pageSlug === "doctors") {
        base.name = displayName;
        base.specialty = row.specialty || row["Specialty"] || "General Practice";
        base.hospital = row.hospital || row["Hospital"] || "Affiliated Medical Center";
        base.city = row.city || row["City"] || "International";
        base.country = row.country || row["Country"] || "Global";
        base.experienceYears = Number(row.experienceYears || row["Experience (Years)"] || 15);
        base.rating = Number(row.rating || row["Rating"] || 4.9);
        base.reviewCount = Number(row.reviewCount || row["Reviews"] || 100);
        base.consultationFeeUsd = row.consultationFeeUsd || row["Consultation Fee"] || "$80 - $150";
        base.image = row.image || "/uploads/doctors/doctor-default.jpg";
      } else if (pageSlug === "hospitals") {
        base.name = displayName;
        base.city = row.city || row["City"] || "City Center";
        base.country = row.country || row["Country"] || "Global";
        base.bedsCount = Number(row.bedsCount || row["Beds Capacity"] || 500);
        base.rating = Number(row.rating || row["Rating"] || 4.8);
        base.reviewCount = Number(row.reviewCount || row["Reviews"] || 250);
        base.image = row.image || "/uploads/hospitals/hospital-default.jpg";
      } else if (pageSlug === "treatments") {
        base.title = displayName;
        base.category = row.category || row["Category"] || "Surgical";
        base.avgCostAbroad = row.avgCostAbroad || row["Cost Abroad"] || "$3,000";
        base.avgCostHome = row.avgCostHome || row["Cost Home"] || "$15,000";
        base.recoveryTime = row.recoveryTime || row["Recovery Time"] || "7 days";
        base.image = row.image || "/uploads/treatments/default.webp";
      } else {
        base.country = displayName;
        base.cityHighlights = row.cityHighlights || row["Highlights"] || "Major medical hub";
        base.savingsPercentage = Number(row.savingsPercentage || row["Savings %"] || 70);
        base.hospitalCount = Number(row.hospitalCount || row["Partner Hospitals"] || 20);
        base.tagline = row.tagline || row["Tagline"] || "World-class care";
        base.image = row.image || "/uploads/destinations/default.jpg";
      }

      return base;
    });

    const newCombined = importMode === "append" ? [...items, ...normalizedRecords] : normalizedRecords;
    const success = await persistChanges(newCombined);
    if (success) {
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportedPreview([]);
      toast.success(`Successfully imported ${normalizedRecords.length} records into ${entityLabels.plural}!`);
    }
  };

  // Sample Template Downloader
  const handleDownloadSample = (format: "csv" | "json" | "excel") => {
    const sampleRows = items.slice(0, 2);
    const filename = `${pageSlug}_sample_template`;
    if (format === "csv") {
      exportToCsv(sampleRows, exportColumns, filename);
    } else if (format === "json") {
      exportToJson(sampleRows, filename);
    } else if (format === "excel") {
      exportToExcel(sampleRows, exportColumns, filename, `${entityLabels.plural} Sample`);
    }
  };

  // Page Content / SEO Save
  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistChanges(items, pagePayload);
  };

  const IconComponent = entityLabels.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-sans">
        <RefreshCw className="w-5 h-5 animate-spin mr-3 text-[#007A6C]" />
        <span>Loading {entityLabels.plural} administrative catalog...</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: FULL-PAGE PROFILE EDITOR (IN-PAGE)
  // ==========================================
  if (currentView === "profile") {
    return (
      <div className="font-sans space-y-6">
        {/* Sticky Action Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeProfileEditor}
              className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
              title="Return to tabular catalog"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {entityLabels.plural}</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-[#007A6C]" />
                <h2 className="text-base font-bold text-slate-900">
                  {isNewItem ? `Add New ${entityLabels.singular}` : `Edit ${entityLabels.singular} Profile`}
                </h2>
                {profileFormData.verified && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {profileFormData.name || profileFormData.title || profileFormData.country || "Unsaved Profile"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isNewItem && (
              <a
                href={`/${pageSlug}/${profileFormData.slug || ""}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Public Page</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-5 py-2 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveProfileTab("basic")}
            className={`px-4 py-2 rounded-lg transition shrink-0 ${
              activeProfileTab === "basic"
                ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                : "hover:text-slate-900"
            }`}
          >
            {pageSlug === "hospitals" ? "1. Core & Accreditations" : "1. Core Information"}
          </button>
          <button
            type="button"
            onClick={() => setActiveProfileTab("metrics")}
            className={`px-4 py-2 rounded-lg transition shrink-0 ${
              activeProfileTab === "metrics"
                ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                : "hover:text-slate-900"
            }`}
          >
            {pageSlug === "hospitals" ? "2. Capacity & Metrics" : "2. Experience & Metrics"}
          </button>
          <button
            type="button"
            onClick={() => setActiveProfileTab("clinical")}
            className={`px-4 py-2 rounded-lg transition shrink-0 ${
              activeProfileTab === "clinical"
                ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                : "hover:text-slate-900"
            }`}
          >
            {pageSlug === "hospitals" ? "3. Narrative & Clinical" : "3. Biography & Milestones"}
          </button>
          {pageSlug === "hospitals" ? (
            <>
              <button
                type="button"
                onClick={() => setActiveProfileTab("surgeries")}
                className={`px-4 py-2 rounded-lg transition shrink-0 ${
                  activeProfileTab === "surgeries"
                    ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                    : "hover:text-slate-900"
                }`}
              >
                4. Surgeries & Costs
              </button>
              <button
                type="button"
                onClick={() => setActiveProfileTab("rooms")}
                className={`px-4 py-2 rounded-lg transition shrink-0 ${
                  activeProfileTab === "rooms"
                    ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                    : "hover:text-slate-900"
                }`}
              >
                5. Facilities & Rooms
              </button>
              <button
                type="button"
                onClick={() => setActiveProfileTab("faqs")}
                className={`px-4 py-2 rounded-lg transition shrink-0 ${
                  activeProfileTab === "faqs"
                    ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                    : "hover:text-slate-900"
                }`}
              >
                6. Hospital FAQs
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setActiveProfileTab("services")}
              className={`px-4 py-2 rounded-lg transition shrink-0 ${
                activeProfileTab === "services"
                  ? "bg-teal-50 text-[#007A6C] border-b-2 border-[#007A6C]"
                  : "hover:text-slate-900"
              }`}
            >
              4. Procedures & Pricing
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {activeProfileTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  value={profileFormData.name || profileFormData.title || profileFormData.country || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfileFormData((prev) => ({
                      ...prev,
                      name: val,
                      title: val,
                      country: prev.country || val,
                    }));
                  }}
                  required
                  placeholder={pageSlug === "doctors" ? "Prof. Dr. Semra Kahraman" : "Memorial Hospital"}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug (Unique Route ID)
                </label>
                <input
                  type="text"
                  value={profileFormData.slug || ""}
                  onChange={(e) => setProfileFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. semra-kahraman"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>

              {pageSlug === "doctors" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty</label>
                    <input
                      type="text"
                      value={profileFormData.specialty || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, specialty: e.target.value }))}
                      placeholder="e.g. IVF Treatment, Cosmetic Surgery"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Affiliation</label>
                    <input
                      type="text"
                      value={profileFormData.hospital || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, hospital: e.target.value }))}
                      placeholder="e.g. Memorial Şişli Hospital"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={profileFormData.city || profileFormData.cityHighlights || ""}
                  onChange={(e) => setProfileFormData((prev) => ({ ...prev, city: e.target.value, cityHighlights: e.target.value }))}
                  placeholder="e.g. Istanbul"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={profileFormData.country || profileFormData.destinationCountry || ""}
                  onChange={(e) => setProfileFormData((prev) => ({ ...prev, country: e.target.value, destinationCountry: e.target.value }))}
                  placeholder="e.g. Turkey"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo / Thumbnail URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={profileFormData.image || ""}
                    onChange={(e) => setProfileFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="/uploads/doctors/profile.jpg"
                    className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                  />
                  {profileFormData.image && (
                    <img
                      src={profileFormData.image}
                      alt="Thumbnail preview"
                      className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                    />
                  )}
                </div>
              </div>

              {pageSlug === "hospitals" && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Physical Address</label>
                    <input
                      type="text"
                      value={profileFormData.address || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="e.g. 454 Charan Sanitwong Road, Bang O, Bang Phlat, Bangkok 10700"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={profileFormData.phone || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +66 2 879 0300"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Prestigious Rank Badge</label>
                    <input
                      type="text"
                      value={profileFormData.rankBadge || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, rankBadge: e.target.value }))}
                      placeholder="e.g. Ranked #12 in Thailand - Newsweek World's Best Hospitals 2024"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gallery Image URLs (one per line)</label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(profileFormData.images)
                          ? profileFormData.images.join("\n")
                          : typeof profileFormData.images === "string"
                          ? profileFormData.images
                          : ""
                      }
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                      placeholder="/uploads/hospitals/yanhee-1.webp&#10;/uploads/hospitals/yanhee-2.webp"
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileFormData.active !== false}
                    onChange={(e) => setProfileFormData((prev) => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#007A6C] border-slate-300 focus:ring-[#007A6C]"
                  />
                  <span className="text-xs font-semibold text-slate-800">Publish in Directory (Active)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(profileFormData.verified)}
                    onChange={(e) => setProfileFormData((prev) => ({ ...prev, verified: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-600"
                  />
                  <span className="text-xs font-semibold text-slate-800">Display Verified Badge</span>
                </label>
              </div>
            </div>
          )}

          {activeProfileTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pageSlug === "hospitals" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Beds Capacity</label>
                    <input
                      type="number"
                      value={profileFormData.bedsCount ?? 400}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, bedsCount: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Intensive Care Unit (ICU) Beds</label>
                    <input
                      type="number"
                      value={profileFormData.icuCount ?? 18}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, icuCount: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Operating Theaters (OTs)</label>
                    <input
                      type="number"
                      value={profileFormData.operatingRooms ?? 42}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, operatingRooms: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year Established</label>
                    <input
                      type="number"
                      value={profileFormData.establishedYear ?? 1984}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, establishedYear: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Daily Patient Inflow</label>
                    <input
                      type="text"
                      value={profileFormData.dailyPatients || "2,000+ Patients Daily"}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, dailyPatients: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialist Doctors Count</label>
                    <input
                      type="text"
                      value={profileFormData.doctorsCount || "270+ Doctors"}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, doctorsCount: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Nurses Count</label>
                    <input
                      type="text"
                      value={profileFormData.nursesCount || "500+ Registered Nurses"}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, nursesCount: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Score / Rating</label>
                    <input
                      type="number"
                      step="0.01"
                      value={profileFormData.rating ?? 75.21}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Patient Reviews Count</label>
                    <input
                      type="number"
                      value={profileFormData.reviewCount ?? 350}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, reviewCount: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(profileFormData.languagesSpoken) ? profileFormData.languagesSpoken.join(", ") : ""}
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          languagesSpoken: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                      placeholder="English, Thai, Arabic, French, German, Mandarin, Japanese"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Accreditations & Certifications (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(profileFormData.accreditations) ? profileFormData.accreditations.join(", ") : ""}
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          accreditations: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                      placeholder="JCI, ISO 9001, HA Thailand"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={profileFormData.experienceYears || 15}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Average Star Rating (0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={profileFormData.rating || 4.9}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Patient Reviews Count</label>
                    <input
                      type="number"
                      value={profileFormData.reviewCount || 100}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, reviewCount: Number(e.target.value) }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Consultation / Assessment Fee</label>
                    <input
                      type="text"
                      value={profileFormData.consultationFeeUsd || "$80 - $150"}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, consultationFeeUsd: e.target.value }))}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Accreditations (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(profileFormData.accreditations) ? profileFormData.accreditations.join(", ") : ""}
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          accreditations: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                      placeholder="JCI, NABH, ISO 15189, ESHRE"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeProfileTab === "clinical" && (
            <div className="space-y-4">
              {pageSlug === "hospitals" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Hospital Summary</label>
                    <textarea
                      rows={3}
                      value={profileFormData.summary || profileFormData.description || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, summary: e.target.value, description: e.target.value }))}
                      placeholder="Founded in 1984, Yanhee International Hospital is one of Asia's premier destinations for cosmetic surgery..."
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comprehensive About / Narrative (Markdown)</label>
                    <textarea
                      rows={6}
                      value={profileFormData.aboutMarkdown || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, aboutMarkdown: e.target.value }))}
                      placeholder="Detailed clinical history, department overviews, and quality standards..."
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Highlights & Accreditations (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={
                        Array.isArray(profileFormData.highlights)
                          ? profileFormData.highlights.join("\n")
                          : typeof profileFormData.highlights === "string"
                          ? profileFormData.highlights
                          : ""
                      }
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          highlights: e.target.value.split("\n").filter(Boolean),
                        }))
                      }
                      placeholder="JCI-Accredited Excellence&#10;Ranked #12 in Thailand by Newsweek&#10;Over 75% repeat or referral patients"
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accessibility & Facilities Features (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(profileFormData.accessibilityFeatures)
                          ? profileFormData.accessibilityFeatures.join("\n")
                          : typeof profileFormData.accessibilityFeatures === "string"
                          ? profileFormData.accessibilityFeatures
                          : ""
                      }
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          accessibilityFeatures: e.target.value.split("\n").filter(Boolean),
                        }))
                      }
                      placeholder="Wheelchair-accessible ramps and elevators&#10;Barrier-free restrooms and wide entrance bays"
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialties Known For (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(profileFormData.specialties) ? profileFormData.specialties.join(", ") : ""}
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        }))
                      }
                      placeholder="Cosmetic & Plastic Surgery, Gender Affirmation, Bariatric Surgery, Dental"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Biography / Summary</label>
                    <textarea
                      rows={5}
                      value={profileFormData.bio || profileFormData.description || ""}
                      onChange={(e) => setProfileFormData((prev) => ({ ...prev, bio: e.target.value, description: e.target.value }))}
                      placeholder="Enter detailed clinical narrative, background, and medical achievements..."
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Milestones & Innovations (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={
                        Array.isArray(profileFormData.milestones)
                          ? profileFormData.milestones.join("\n")
                          : typeof profileFormData.milestones === "string"
                          ? profileFormData.milestones
                          : ""
                      }
                      onChange={(e) =>
                        setProfileFormData((prev) => ({
                          ...prev,
                          milestones: e.target.value.split("\n").filter(Boolean),
                        }))
                      }
                      placeholder="First microinjection baby in Turkey&#10;First PGD pregnancy in the region"
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {pageSlug === "hospitals" && activeProfileTab === "surgeries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Surgeries & Cost Comparison Table</h4>
                  <p className="text-xs text-slate-500">Manage procedure prices, US/UK comparison rates, and patient savings.</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-teal-50 text-[#007A6C] font-bold rounded-lg border border-teal-200">
                  {Array.isArray(profileFormData.surgeriesCost) ? profileFormData.surgeriesCost.length : 0} Procedures Listed
                </span>
              </div>

              {/* Surgeries Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Procedure</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Hospital Price (USD)</th>
                      <th className="py-2.5 px-3">US / UK Price</th>
                      <th className="py-2.5 px-3">Savings</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(profileFormData.surgeriesCost || []).map((sc: any, idx: number) => (
                      <tr key={sc.id || idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-semibold text-slate-900">{sc.procedure}</td>
                        <td className="py-2 px-3 text-slate-600">{sc.category || "General"}</td>
                        <td className="py-2 px-3 font-bold text-[#007A6C]">{sc.hospitalPriceUsd}</td>
                        <td className="py-2 px-3 text-slate-400 line-through">{sc.usUkPriceUsd}</td>
                        <td className="py-2 px-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Save {sc.savingsPercent}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (profileFormData.surgeriesCost || []).filter((_: any, i: number) => i !== idx);
                              setProfileFormData((prev) => ({ ...prev, surgeriesCost: updated }));
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                            title="Delete Surgery Cost"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!profileFormData.surgeriesCost || profileFormData.surgeriesCost.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          No surgery prices listed yet. Add one below.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Surgery Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#007A6C]" />
                  <span>Add New Surgery / Procedure Pricing</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Procedure Name</label>
                    <input
                      type="text"
                      value={newSurgeryCost.procedure}
                      onChange={(e) => setNewSurgeryCost((prev) => ({ ...prev, procedure: e.target.value }))}
                      placeholder="e.g. Breast Augmentation (Mentor)"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                    <input
                      type="text"
                      value={newSurgeryCost.category}
                      onChange={(e) => setNewSurgeryCost((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Cosmetic Surgery"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hospital Price (USD)</label>
                    <input
                      type="text"
                      value={newSurgeryCost.hospitalPriceUsd}
                      onChange={(e) => setNewSurgeryCost((prev) => ({ ...prev, hospitalPriceUsd: e.target.value }))}
                      placeholder="e.g. $3,200"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">US / UK Price (USD)</label>
                    <input
                      type="text"
                      value={newSurgeryCost.usUkPriceUsd}
                      onChange={(e) => setNewSurgeryCost((prev) => ({ ...prev, usUkPriceUsd: e.target.value }))}
                      placeholder="e.g. $8,500"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Savings %</label>
                    <input
                      type="number"
                      value={newSurgeryCost.savingsPercent}
                      onChange={(e) => setNewSurgeryCost((prev) => ({ ...prev, savingsPercent: Number(e.target.value) }))}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSurgeryCost.procedure.trim()) return;
                        const id = `cost-${Date.now()}`;
                        const itemToAdd = { id, ...newSurgeryCost };
                        setProfileFormData((prev) => ({
                          ...prev,
                          surgeriesCost: [...(prev.surgeriesCost || []), itemToAdd],
                        }));
                        setNewSurgeryCost({
                          procedure: "",
                          category: "Cosmetic Surgery",
                          hospitalPriceUsd: "$2,500",
                          usUkPriceUsd: "$8,000",
                          savingsPercent: 65,
                          description: "Complete procedure including accredited surgeon and stay.",
                        });
                      }}
                      className="w-full py-2 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Procedure</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {pageSlug === "hospitals" && activeProfileTab === "rooms" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hospital Facilities & Room Suites</h4>
                  <p className="text-xs text-slate-500">Configure private suites, deluxe patient rooms, and accepted payment methods.</p>
                </div>
              </div>

              {/* Room Types */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-800">Active Patient Room Types</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(profileFormData.roomTypes || []).map((rt: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (profileFormData.roomTypes || []).filter((_: any, i: number) => i !== idx);
                          setProfileFormData((prev) => ({ ...prev, roomTypes: updated }));
                        }}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        title="Remove Room Type"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <h6 className="text-xs font-bold text-slate-900">{rt.name}</h6>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rt.description}</p>
                      {Array.isArray(rt.amenities) && rt.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rt.amenities.map((a: string, ai: number) => (
                            <span key={ai} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] rounded border border-slate-200">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Room Type Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#007A6C]" />
                  <span>Add Room Suite Option</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Room Name</label>
                    <input
                      type="text"
                      value={newRoomType.name}
                      onChange={(e) => setNewRoomType((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. VIP Single Suite"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      value={newRoomType.amenities}
                      onChange={(e) => setNewRoomType((prev) => ({ ...prev, amenities: e.target.value }))}
                      placeholder="Private Bathroom, Wi-Fi, Smart TV, Nurse Call"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={newRoomType.description}
                      onChange={(e) => setNewRoomType((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Spacious private room with electric hospital bed, guest daybed, and en-suite bath."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newRoomType.name.trim()) return;
                    const itemToAdd = {
                      name: newRoomType.name.trim(),
                      description: newRoomType.description.trim(),
                      amenities: newRoomType.amenities.split(",").map((s) => s.trim()).filter(Boolean),
                    };
                    setProfileFormData((prev) => ({
                      ...prev,
                      roomTypes: [...(prev.roomTypes || []), itemToAdd],
                    }));
                    setNewRoomType({
                      name: "",
                      description: "",
                      amenities: "Private Bathroom, Wi-Fi, Smart TV, Nurse Call",
                    });
                  }}
                  className="px-4 py-2 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Room Type</span>
                </button>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accepted Payment Methods (one per line)</label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(profileFormData.paymentMethods)
                      ? profileFormData.paymentMethods.join("\n")
                      : typeof profileFormData.paymentMethods === "string"
                      ? profileFormData.paymentMethods
                      : ""
                  }
                  onChange={(e) =>
                    setProfileFormData((prev) => ({
                      ...prev,
                      paymentMethods: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="Cash (Thai Baht, USD, EUR)&#10;Credit Cards (Visa, MasterCard, JCB)&#10;Bank Wire Transfer (SWIFT)"
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>
            </div>
          )}

          {pageSlug === "hospitals" && activeProfileTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hospital FAQs (Frequently Asked Questions)</h4>
                  <p className="text-xs text-slate-500">Provide direct answers about arrival, transfers, visas, and aftercare.</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-teal-50 text-[#007A6C] font-bold rounded-lg border border-teal-200">
                  {Array.isArray(profileFormData.faqs) ? profileFormData.faqs.length : 0} Questions
                </span>
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-2.5">
                {(profileFormData.faqs || []).map((faq: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (profileFormData.faqs || []).filter((_: any, i: number) => i !== idx);
                        setProfileFormData((prev) => ({ ...prev, faqs: updated }));
                      }}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-xs font-bold text-slate-900 pr-6">Q: {faq.question}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
                {(!profileFormData.faqs || profileFormData.faqs.length === 0) && (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No FAQs added yet. Use the form below to add hospital questions.
                  </div>
                )}
              </div>

              {/* Add FAQ Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#007A6C]" />
                  <span>Add New Hospital FAQ</span>
                </h5>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Question</label>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g. How long before surgery should I arrive in Bangkok?"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
                    placeholder="e.g. For most surgical procedures, we recommend arriving 1 to 2 days prior to your surgery date..."
                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#007A6C]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
                    const itemToAdd = {
                      question: newFaq.question.trim(),
                      answer: newFaq.answer.trim(),
                    };
                    setProfileFormData((prev) => ({
                      ...prev,
                      faqs: [...(prev.faqs || []), itemToAdd],
                    }));
                    setNewFaq({ question: "", answer: "" });
                  }}
                  className="px-4 py-2 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>
            </div>
          )}

          {pageSlug !== "hospitals" && activeProfileTab === "services" && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                Offered Procedures & Services (comma-separated or items)
              </label>
              <textarea
                rows={4}
                value={
                  Array.isArray(profileFormData.procedures)
                    ? profileFormData.procedures.map((p) => (typeof p === "string" ? p : p.name || p.title)).join(", ")
                    : ""
                }
                onChange={(e) =>
                  setProfileFormData((prev) => ({
                    ...prev,
                    procedures: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  }))
                }
                placeholder="IVF Treatment, ICSI Procedure, Pre-implantation Genetic Testing"
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
              />
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeProfileEditor}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PAGE SETTINGS & SEO TAB
  // ==========================================
  if (currentView === "page-settings") {
    return (
      <div className="font-sans space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView("list")}
              className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listing</span>
            </button>
            <h2 className="text-base font-bold text-slate-900">
              Manage /{pageSlug} Landing Page Content & SEO
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSavePageSettings}
            disabled={saving}
            className="px-5 py-2 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save & Publish Landing Page</span>
          </button>
        </div>

        <form onSubmit={handleSavePageSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Page Headline</label>
              <input
                type="text"
                value={pagePayload.headline || ""}
                onChange={(e) => setPagePayload((prev) => ({ ...prev, headline: e.target.value }))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Input Placeholder</label>
              <input
                type="text"
                value={pagePayload.searchPlaceholder || ""}
                onChange={(e) => setPagePayload((prev) => ({ ...prev, searchPlaceholder: e.target.value }))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Subheadline / Supporting Tagline</label>
              <input
                type="text"
                value={pagePayload.subheadline || ""}
                onChange={(e) => setPagePayload((prev) => ({ ...prev, subheadline: e.target.value }))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#007A6C]" />
              <span>Search Engine Optimization (SEO)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Browser Title</label>
                <input
                  type="text"
                  value={pageSeo.title || ""}
                  onChange={(e) => setPageSeo((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL Path</label>
                <input
                  type="text"
                  value={pageSeo.canonicalPath || `/${pageSlug}`}
                  onChange={(e) => setPageSeo((prev) => ({ ...prev, canonicalPath: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={pageSeo.description || ""}
                  onChange={(e) => setPageSeo((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: TABULAR LISTING WITH BULK ACTIONS
  // ==========================================
  const allFilteredSelected =
    filteredItems.length > 0 && filteredItems.every((i) => selectedIds.has(String(i.id || i.slug)));

  return (
    <div className="font-sans space-y-4">
      {/* Top Banner & Module Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#007A6C]">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{entityLabels.plural} Directory & Management</h1>
            <p className="text-xs text-slate-500">
              Manage {items.length} verified records, bulk update statuses, and import/export catalogs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView("page-settings")}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Edit landing page banner, headline, and SEO"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Landing Page Settings</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen((prev) => !prev)}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleBulkExport("csv")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Export as CSV (.csv)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkExport("excel")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-700" />
                  <span>Export as Excel (.xls/.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkExport("json")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Export as JSON (.json)</span>
                </button>
              </div>
            )}
          </div>

          {/* Import Button */}
          <button
            type="button"
            onClick={() => {
              setIsImportModalOpen(true);
              setImportedPreview([]);
              setImportFile(null);
              setImportError("");
            }}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>

          {/* Add New Button */}
          <button
            type="button"
            onClick={() => openNewProfileEditor(true)}
            className="px-4 py-2 bg-[#007A6C] hover:bg-[#006054] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add {entityLabels.singular}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${entityLabels.plural.toLowerCase()} by name, specialty, country...`}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none"
            />
          </div>

          {/* Category Filter */}
          {categoriesList.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#007A6C] text-slate-700"
            >
              <option value="all">All Specialties / Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Country Filter */}
          {countriesList.length > 0 && (
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#007A6C] text-slate-700"
            >
              <option value="all">All Countries</option>
              {countriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#007A6C] text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Draft Only</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium shrink-0">
          Showing <span className="font-bold text-slate-800">{filteredItems.length}</span> of {items.length} records
        </div>
      </div>

      {/* Floating Bulk Actions Bar (When items are selected) */}
      {selectedIds.size > 0 && (
        <div className="bg-slate-900 text-white p-3 px-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-teal-500/20 text-[#00C7BE] border border-teal-500/30 px-2.5 py-1 rounded-full">
              {selectedIds.size} Selected
            </span>
            <span className="text-xs text-slate-300">Bulk Actions available:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkActivate(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkActivate(false)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkExport("csv")}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected</span>
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-slate-400 hover:text-white ml-2 underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Tabular View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#007A6C] border-slate-300 focus:ring-[#007A6C]"
                  />
                </th>
                <th className="p-3.5">
                  <SortHeader
                    label={entityLabels.singular + " Name"}
                    field="name"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="p-3.5">
                  <SortHeader
                    label="Specialty / Category"
                    field="specialty"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="p-3.5">
                  <SortHeader
                    label="Location"
                    field="country"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="p-3.5">
                  <SortHeader
                    label="Rating & Experience"
                    field="rating"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="p-3.5">
                  <SortHeader
                    label="Status"
                    field="active"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="p-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No matching records found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try refining your search filter or add a new entry.</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const itemId = String(item.id || item.slug);
                  const isSelected = selectedIds.has(itemId);
                  const displayName = item.name || item.title || item.country || "Untitled";
                  const specialty = item.specialty || item.category || "General";
                  const location = item.city && item.country ? `${item.city}, ${item.country}` : item.country || item.city || "Global";
                  const rating = item.rating || 4.9;
                  const exp = item.experienceYears ? `${item.experienceYears}y exp` : item.recoveryTime || item.bedsCount ? `${item.bedsCount} beds` : "";
                  const isActive = item.active !== false;

                  return (
                    <tr
                      key={itemId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-teal-50/40" : ""
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(itemId)}
                          className="w-4 h-4 rounded text-[#007A6C] border-slate-300 focus:ring-[#007A6C]"
                        />
                      </td>

                      {/* Name & Photo */}
                      <td className="p-3.5 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/uploads/doctors/doctor-default.jpg"}
                            alt={displayName}
                            className="w-9 h-9 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => openProfileEditor(item)}
                              className="font-bold text-slate-900 hover:text-[#007A6C] transition text-left"
                            >
                              {displayName}
                            </button>
                            {item.hospital && (
                              <p className="text-[11px] text-slate-500 font-normal">{item.hospital}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Specialty / Category */}
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200">
                          {specialty}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{location}</span>
                        </div>
                      </td>

                      {/* Rating & Reviews */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {rating}
                          </span>
                          {exp && <span className="text-[11px] text-slate-500 font-medium">({exp})</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(itemId, isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {isActive ? "Active" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openProfileEditor(item)}
                            className="p-1.5 hover:bg-teal-50 text-slate-600 hover:text-[#007A6C] rounded-lg transition"
                            title="Edit full profile (Page)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/${pageSlug}/${item.slug || ""}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition"
                            title="View public live page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(itemId, displayName)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredItems.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* IMPORT MODAL (.csv, .json, Excel)          */}
      {/* ========================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-[#007A6C]" />
                <h3 className="text-base font-bold text-slate-900">
                  Import {entityLabels.plural} Catalog (.csv, .json, Excel)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Download Prompt */}
            <div className="flex items-center justify-between p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs">
              <div className="text-teal-900 font-medium">
                Need a formatted template? Download a pre-structured sample file:
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSample("csv")}
                  className="px-2.5 py-1 bg-white border border-teal-200 text-teal-800 rounded-lg hover:bg-teal-100/50 font-semibold"
                >
                  .CSV
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSample("excel")}
                  className="px-2.5 py-1 bg-white border border-teal-200 text-teal-800 rounded-lg hover:bg-teal-100/50 font-semibold"
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSample("json")}
                  className="px-2.5 py-1 bg-white border border-teal-200 text-teal-800 rounded-lg hover:bg-teal-100/50 font-semibold"
                >
                  .JSON
                </button>
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-[#007A6C] rounded-2xl p-6 text-center cursor-pointer transition">
              <input
                type="file"
                accept=".csv,.json,.xls,.xlsx,application/json,text/csv,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
                id="catalog-import-input"
              />
              <label htmlFor="catalog-import-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">
                  {importFile ? importFile.name : "Click or drag .csv, .json, or Excel file to upload"}
                </div>
                <p className="text-[11px] text-slate-400">
                  Supports UTF-8 CSV, native JSON array, and Microsoft Excel XML formats.
                </p>
              </label>
            </div>

            {importParsing && (
              <div className="text-xs text-slate-500 flex items-center justify-center gap-2 py-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007A6C]" />
                <span>Parsing file records...</span>
              </div>
            )}

            {importError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* Parsed Preview Table */}
            {importedPreview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Found {importedPreview.length} valid records:</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === "append"}
                        onChange={() => setImportMode("append")}
                        className="text-[#007A6C]"
                      />
                      <span>Append to catalog</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-rose-600">
                      <input
                        type="radio"
                        name="importMode"
                        value="replace"
                        checked={importMode === "replace"}
                        onChange={() => setImportMode("replace")}
                        className="text-rose-600"
                      />
                      <span>Replace catalog</span>
                    </label>
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl text-xs divide-y divide-slate-100">
                  {importedPreview.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {row.name || row.title || row.country || row["Doctor Name"] || row["Hospital Name"] || `Record ${idx + 1}`}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {row.specialty || row.category || row.city || row["Specialty"] || ""}
                      </span>
                    </div>
                  ))}
                  {importedPreview.length > 5 && (
                    <div className="p-2 text-center text-slate-400 text-[11px] bg-slate-50">
                      + {importedPreview.length - 5} more records ready to import
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importedPreview.length === 0 || saving}
                className="px-5 py-2.5 bg-[#007A6C] hover:bg-[#006054] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Import {importedPreview.length} Records</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
