import React, { useState } from "react";
import type { PublicRouteResponseDTO, CommunityThread, CommunityReply } from "@akeezo/contracts";
import {
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  Share2,
  Stethoscope,
  Sparkles,
  Building2,
  ArrowRight,
  Star,
  Send,
  Shield,
  Check,
  ArrowLeft,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

function formatUtcDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export interface CommunityThreadTemplateProps {
  data: PublicRouteResponseDTO;
}

export const CommunityThreadTemplate: React.FC<CommunityThreadTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const thread = ((data.payload as any)?.thread as CommunityThread) || null;

  if (!thread) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <SiteHeader siteSettings={siteSettings} activePath="/community" />
        <div className="max-w-xl mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discussion Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The requested community discussion thread may have been moved or is undergoing moderation.
          </p>
          <a
            href="/community"
            className="inline-flex items-center gap-2 bg-[#007A6C] text-white px-6 py-2.5 rounded-full text-xs font-bold"
          >
            <ArrowLeft className="size-4" />
            <span>Return to Community</span>
          </a>
        </div>
        <SiteFooter siteSettings={siteSettings} />
      </div>
    );
  }

  const [upvotes, setUpvotes] = useState(thread.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [replies, setReplies] = useState<CommunityReply[]>(thread.replies || []);
  const [copied, setCopied] = useState(false);

  // New reply form state
  const [replyText, setReplyText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const handleUpvote = async () => {
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
      fetch(`/api/v1/community/${thread.id}/upvote`, { method: "POST" }).catch(() => {});
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim().length < 5) {
      setReplyError("Reply must be at least 5 characters.");
      return;
    }

    setSubmittingReply(true);
    setReplyError(null);

    try {
      const res = await fetch(`/api/v1/community/${thread.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: thread.id,
          authorName: authorName.trim() || (isDoctor ? "Specialist Physician" : "International Patient"),
          authorRole: isDoctor ? "doctor" : "patient",
          specialty: isDoctor ? specialty.trim() : undefined,
          hospitalName: isDoctor ? hospitalName.trim() : undefined,
          content: replyText.trim(),
          isVerifiedDoctorResponse: isDoctor,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to post reply");
      }

      setReplies((prev) => [...prev, json.data]);
      setReplyText("");
      setReplySuccess(true);
      setTimeout(() => setReplySuccess(false), 4000);
    } catch (err: any) {
      setReplyError(err.message || "Failed to post reply. Please try again.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Structured schema graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: thread.title,
      text: thread.content,
      answerCount: replies.length,
      upvoteCount: upvotes,
      dateCreated: thread.createdAt,
      author: {
        "@type": "Person",
        name: thread.author.isAnonymous ? "Anonymous Patient" : thread.author.name,
      },
      suggestedAnswer: replies.map((r) => ({
        "@type": "Answer",
        text: r.content,
        dateCreated: r.createdAt,
        upvoteCount: r.upvotes,
        author: {
          "@type": "Person",
          name: r.author.name,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#007A6C] selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader siteSettings={siteSettings} activePath="/community" />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto">
          <a href="/" className="hover:text-[#007A6C]">Home</a>
          <ChevronRight className="size-3 text-gray-400 shrink-0" />
          <a href="/community" className="hover:text-[#007A6C]">Community</a>
          <ChevronRight className="size-3 text-gray-400 shrink-0" />
          <span className="text-gray-400">{thread.category}</span>
          <ChevronRight className="size-3 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{thread.title}</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Thread & Answers (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Discussion Post */}
          <article className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-[#007A6C] border border-teal-100/60">
                  {thread.category}
                </span>
                {thread.isStory && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Sparkles className="size-3 text-amber-500" />
                    Patient Story
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {formatUtcDate(thread.createdAt)}
              </span>
            </div>

            {/* Author Section */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={thread.author.avatar || "/uploads/about/testi-review.webp"}
                alt={thread.author.name}
                className="size-11 rounded-full object-cover border border-gray-200"
              />
              <div>
                <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <span>{thread.author.isAnonymous ? "Anonymous Patient" : thread.author.name}</span>
                  {thread.author.isVerifiedPatient && (
                    <span title="Verified Patient">
                      <CheckCircle2 className="size-3.5 text-[#007A6C]" />
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Origin: <strong>{thread.author.country}</strong> {thread.author.countryCode && `(${thread.author.countryCode})`}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-4">
              {thread.title}
            </h1>

            {/* Story Details Card (if story) */}
            {thread.isStory && thread.storyDetails && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200/80 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Hospital</span>
                  <span className="font-bold text-gray-900">{thread.storyDetails.hospitalName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Cost</span>
                  <span className="font-black text-[#007A6C] text-sm">{thread.storyDetails.costUsd}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Recovery Time</span>
                  <span className="font-bold text-gray-900">{thread.storyDetails.recoveryDays} Days</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Rating</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {thread.storyDetails.rating}.0 / 5
                  </span>
                </div>
              </div>
            )}

            {/* Full Content */}
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3 mb-6">
              {thread.content}
            </div>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 pt-2 border-t border-gray-100">
                {thread.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Engagement Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpvote}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                    hasUpvoted
                      ? "bg-[#007A6C] text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <ThumbsUp className={`size-3.5 ${hasUpvoted ? "fill-white" : ""}`} />
                  <span>Helpful ({upvotes})</span>
                </button>

                <span className="text-gray-400 flex items-center gap-1">
                  <Eye className="size-3.5" />
                  <span>{thread.viewsCount} views</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#007A6C] px-3 py-1.5 rounded-full hover:bg-gray-50 font-semibold cursor-pointer"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5" />}
                <span>{copied ? "Link Copied" : "Share"}</span>
              </button>
            </div>
          </article>

          {/* Doctor Verified Answers Section */}
          {replies.some((r) => r.isVerifiedDoctorResponse) && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Stethoscope className="size-4 text-emerald-600" />
                <span>Verified Doctor &amp; Clinical Specialist Answers</span>
              </h2>

              {replies
                .filter((r) => r.isVerifiedDoctorResponse)
                .map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border border-emerald-200 rounded-3xl p-6 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={reply.author.avatar || "/uploads/doctors/doctor-2220.jpg"}
                          alt={reply.author.name}
                          className="size-11 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                            <span>{reply.author.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                              Verified Doctor
                            </span>
                          </div>
                          <p className="text-xs text-emerald-800">{reply.author.specialty || "Specialist Surgeon"}</p>
                          <p className="text-[11px] text-emerald-700 font-medium">{reply.author.hospitalName}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {formatUtcDate(reply.createdAt)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-emerald-400">
                      {reply.content}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-emerald-800 italic">
                        Accredited Clinical Opinion for International Medical Travelers
                      </span>
                      {reply.author.doctorId && (
                        <a
                          href={`/doctors/${reply.author.doctorId}`}
                          className="inline-flex items-center gap-1 font-bold text-[#007A6C] hover:underline"
                        >
                          <span>Doctor Profile</span>
                          <ArrowRight className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Peer Community Replies */}
          <div id="replies" className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <MessageSquare className="size-4 text-[#007A6C]" />
              <span>Community Replies ({replies.filter((r) => !r.isVerifiedDoctorResponse).length})</span>
            </h2>

            {replies.filter((r) => !r.isVerifiedDoctorResponse).length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-xs text-gray-500">
                No peer replies yet. Share your experience or advice below.
              </div>
            ) : (
              <div className="space-y-3">
                {replies
                  .filter((r) => !r.isVerifiedDoctorResponse)
                  .map((reply) => (
                    <div key={reply.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.author.avatar || "/uploads/about/testi-review.webp"}
                            alt={reply.author.name}
                            className="size-7 rounded-full object-cover border border-gray-200"
                          />
                          <span className="font-bold text-gray-900">{reply.author.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                            {reply.author.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {formatUtcDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pl-9">
                        {reply.content}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Add Reply Form */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Add Your Answer or Experience</h3>

            {replySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
                Your response has been added to the discussion!
              </div>
            )}
            {replyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                {replyError}
              </div>
            )}

            <form onSubmit={handleReplySubmit} className="space-y-3 text-xs">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your advice, recovery experience, or clinical insight..."
                className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-[#007A6C] transition-colors resize-none"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Michael T."
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#007A6C]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isDoctor}
                      onChange={(e) => setIsDoctor(e.target.checked)}
                      className="size-4 rounded text-[#007A6C] focus:ring-[#007A6C] cursor-pointer"
                    />
                    <span className="font-bold text-gray-800">I am a Medical Doctor / Specialist</span>
                  </label>
                </div>
              </div>

              {isDoctor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Medical Specialty</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Plastic Surgeon"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#007A6C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. Yanhee Hospital"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#007A6C]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Protected under DPDP Act 2023. Keep medical advice educational.
                </span>

                <button
                  type="submit"
                  disabled={submittingReply}
                  className="inline-flex items-center gap-2 bg-[#007A6C] hover:bg-[#006357] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  <span>{submittingReply ? "Posting..." : "Post Reply"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Back to Community Link */}
          <a
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#007A6C] hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Community Discussions</span>
          </a>

          {/* Need Direct Hospital Quote */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Building2 className="size-4 text-[#FF6D1B]" />
              <span>Direct Hospital Estimates</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Seeking an official surgical estimate or pre-travel medical opinion? Akeezo coordinates direct hospital rates with accredited centers in Bangkok, Istanbul, and Delhi.
            </p>
            <a
              href="/#opinion"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-xs py-2.5 rounded-full shadow-xs transition-all"
            >
              <span>Get Free Second Opinion</span>
              <ArrowRight className="size-3" />
            </a>
          </div>

          {/* Safety Disclaimer */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs text-xs space-y-2 text-gray-500">
            <div className="flex items-center gap-1.5 font-bold text-gray-800">
              <Shield className="size-4 text-emerald-600" />
              <span>Medical Forum Guidelines</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Discussions and answers in the Akeezo Community are for peer information only. Always consult directly with an accredited physician before undergoing elective surgery or changing medication.
            </p>
          </div>
        </aside>
      </main>

      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};
