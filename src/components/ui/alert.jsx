export function Alert({ variant = "default", title, children, className = "" }) {
  const base = "rounded-xl border p-4 text-sm";
  const variants = {
    default: "bg-white/5 border-white/10 text-white",
    destructive: "bg-red-500/10 border-red-500/30 text-red-200",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
  };
  return (
    <div className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {title && <div className="font-medium mb-1">{title}</div>}
      {children && <div className="text-xs opacity-90">{children}</div>}
    </div>
  );
}


