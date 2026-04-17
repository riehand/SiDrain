import { cn } from "@/lib/utils";

export function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        "glass-card p-4 sm:p-6",
        hover && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, color = "cyan", trend, className }) {
  const colorMap = {
    cyan: "from-cyan-500 to-cyan-600",
    teal: "from-teal-500 to-teal-600",
    blue: "from-blue-500 to-blue-600",
    amber: "from-amber-500 to-amber-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    gray: "from-gray-400 to-gray-500",
  };

  const shadowMap = {
    cyan: "shadow-cyan-500/20",
    teal: "shadow-teal-500/20",
    blue: "shadow-blue-500/20",
    amber: "shadow-amber-500/20",
    green: "shadow-green-500/20",
    red: "shadow-red-500/20",
    purple: "shadow-purple-500/20",
    gray: "shadow-gray-400/20",
  };

  return (
    <div className={cn("glass-card p-3 sm:p-5 hover-lift", className)}>
      <div className="flex items-center sm:items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium truncate">{label}</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-0.5 sm:mt-1">{value}</p>
          {trend && (
            <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={cn(
          "w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0",
          colorMap[color],
          shadowMap[color]
        )}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const classMap = {
    "Menunggu Verifikasi": "badge-waiting",
    "Diverifikasi": "badge-verified",
    "Diproses": "badge-processing",
    "Selesai": "badge-completed",
    "Ditolak": "badge-rejected",
  };

  // Short labels for mobile
  const shortLabel = {
    "Menunggu Verifikasi": "Menunggu",
    "Diverifikasi": "Diverifikasi",
    "Diproses": "Diproses",
    "Selesai": "Selesai",
    "Ditolak": "Ditolak",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap",
      classMap[status] || "badge-waiting"
    )}>
      <span className="sm:hidden">{shortLabel[status] || status}</span>
      <span className="hidden sm:inline">{status}</span>
    </span>
  );
}

export function SectionTitle({ children, subtitle, className }) {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">{children}</h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="glass-card p-8 sm:p-12 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-700">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-1">{description}</p>
    </div>
  );
}
