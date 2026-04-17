"use client";

import { formatDateTime } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, Shield, Loader2 } from "lucide-react";

const statusIcons = {
  "Menunggu Verifikasi": Clock,
  "Diverifikasi": Shield,
  "Diproses": Loader2,
  "Selesai": CheckCircle2,
  "Ditolak": XCircle,
};

const statusColors = {
  "Menunggu Verifikasi": "text-gray-400 bg-gray-100",
  "Diverifikasi": "text-blue-500 bg-blue-100",
  "Diproses": "text-amber-500 bg-amber-100",
  "Selesai": "text-green-500 bg-green-100",
  "Ditolak": "text-red-500 bg-red-100",
};

const lineColors = {
  "Menunggu Verifikasi": "bg-gray-200",
  "Diverifikasi": "bg-blue-200",
  "Diproses": "bg-amber-200",
  "Selesai": "bg-green-200",
  "Ditolak": "bg-red-200",
};

export default function Timeline({ updates }) {
  if (!updates || updates.length === 0) return null;

  return (
    <div className="space-y-0">
      {updates.map((update, index) => {
        const Icon = statusIcons[update.status] || Clock;
        const colorClass = statusColors[update.status] || statusColors["Menunggu Verifikasi"];
        const lineColor = lineColors[update.status] || lineColors["Menunggu Verifikasi"];
        const isLast = index === updates.length - 1;

        return (
          <div key={update.id} className="flex gap-4">
            {/* Line and Icon */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 ${lineColor}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${isLast ? "" : ""}`}>
              <p className="text-sm font-semibold text-slate-700">{update.status}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDateTime(update.updated_at)} • {update.updated_by}
              </p>
              {update.note && (
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{update.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
