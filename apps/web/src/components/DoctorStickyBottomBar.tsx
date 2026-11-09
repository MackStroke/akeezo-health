import type { DoctorDetail } from "@akeezo/contracts";
import { Star, Video, ArrowRight } from "lucide-react";

interface DoctorStickyBottomBarProps {
  doctor: DoctorDetail;
  onOpenBooking: () => void;
}

export function DoctorStickyBottomBar({ doctor, onOpenBooking }: DoctorStickyBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#00C7BE]"
        />
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 truncate leading-tight">{doctor.name}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5 inline" />
              {doctor.rating}
            </span>
            <span>·</span>
            <span className="truncate">{doctor.specialty}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenBooking}
        className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs font-bold rounded-xl shrink-0 transition flex items-center gap-1.5 shadow-sm active:scale-95"
      >
        <Video className="w-3.5 h-3.5" />
        <span>Book Consult</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
