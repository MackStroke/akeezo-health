import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  CheckCircle2,
  Share2,
  Stethoscope,
  Sparkles,
  Star,
  Check,
} from "lucide-react";
import type { CommunityThread } from "@akeezo/contracts";

interface CommunityThreadCardProps {
  thread: CommunityThread;
  onUpvote?: (id: string) => void;
}

function formatUtcDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export const CommunityThreadCard: React.FC<CommunityThreadCardProps> = ({ thread, onUpvote }) => {
  const [upvotes, setUpvotes] = useState(thread.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
      if (onUpvote) {
        onUpvote(thread.id);
      } else {
        fetch(`/api/v1/community/${thread.id}/upvote`, { method: "POST" }).catch(() => {});
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/community/${thread.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Format date
  const dateFormatted = formatUtcDate(thread.createdAt);

  return (
    <article className="group bg-white rounded-3xl border border-gray-100 hover:border-[#007A6C]/30 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-[#007A6C] border border-teal-100/60">
              {thread.category}
            </span>
            {thread.isStory && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                <Sparkles className="size-3 text-amber-500" />
                Patient Journey Story
              </span>
            )}
            {thread.isPinned && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Pinned
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400 font-medium">{dateFormatted}</span>
        </div>

        {/* Author Details */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <img
            src={thread.author.avatar || "/uploads/about/testi-review.webp"}
            alt={thread.author.name}
            className="size-8 rounded-full object-cover border border-gray-200"
            loading="lazy"
          />
          <div className="text-xs">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <span>{thread.author.isAnonymous ? "Anonymous Patient" : thread.author.name}</span>
              {thread.author.isVerifiedPatient && (
                <span title="Verified Patient">
                  <CheckCircle2 className="size-3 text-[#007A6C]" />
                </span>
              )}
            </div>
            <div className="text-gray-500 text-[11px] flex items-center gap-1">
              <span>{thread.author.country}</span>
              {thread.author.countryCode && (
                <span className="uppercase text-[10px] font-mono text-gray-400">({thread.author.countryCode})</span>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#007A6C] transition-colors leading-snug mb-2">
          <a href={`/community/${thread.slug}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#007A6C] rounded-sm">
            {thread.title}
          </a>
        </h3>

        {/* Content Excerpt */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {thread.content}
        </p>

        {/* Patient Journey Highlight Box (if story) */}
        {thread.isStory && thread.storyDetails && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Hospital</span>
              <span className="font-semibold text-gray-800 line-clamp-1">{thread.storyDetails.hospitalName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Cost</span>
              <span className="font-bold text-[#007A6C]">{thread.storyDetails.costUsd}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Recovery</span>
              <span className="font-semibold text-gray-800">{thread.storyDetails.recoveryDays} Days</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Rating</span>
              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {thread.storyDetails.rating}.0 / 5
              </span>
            </div>
          </div>
        )}

        {/* Doctor Verified Answer Callout */}
        {thread.isDoctorAnswered && thread.doctorAnswerPreview && (
          <div className="mb-4 p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-200/60 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Stethoscope className="size-3" />
              </span>
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                Verified Doctor Answer
                <span className="font-normal text-emerald-700">· {thread.doctorAnswerPreview.doctorName}</span>
              </span>
            </div>
            <p className="text-xs text-gray-700 italic line-clamp-2 pl-7 leading-relaxed">
              "{thread.doctorAnswerPreview.answerSnippet}"
            </p>
          </div>
        )}

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {thread.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="text-[11px] text-gray-500 font-medium hover:text-[#007A6C]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions & Stats */}
      <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              hasUpvoted
                ? "bg-[#007A6C] text-white shadow-xs"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
            aria-label="Upvote this discussion"
          >
            <ThumbsUp className={`size-3.5 ${hasUpvoted ? "fill-white" : ""}`} />
            <span>{upvotes}</span>
          </button>

          <a
            href={`/community/${thread.slug}#replies`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-50 font-semibold text-gray-600 hover:text-[#007A6C] transition-colors"
          >
            <MessageSquare className="size-3.5 text-gray-400" />
            <span>{thread.repliesCount} {thread.repliesCount === 1 ? "Reply" : "Replies"}</span>
          </a>

          <span className="hidden sm:inline-flex items-center gap-1 text-gray-400 font-medium">
            <Eye className="size-3.5 text-gray-400" />
            <span>{thread.viewsCount} views</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 text-gray-400 hover:text-[#007A6C] transition-colors p-1.5 rounded-full hover:bg-gray-50 cursor-pointer"
          title="Copy link to discussion"
        >
          {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5" />}
          <span className="text-[11px] font-semibold">{copied ? "Copied" : "Share"}</span>
        </button>
      </div>
    </article>
  );
};
