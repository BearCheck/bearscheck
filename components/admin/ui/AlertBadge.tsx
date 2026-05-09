"use client";

interface AlertBadgeProps {
  type: "erreur" | "attention" | "info" | "succes";
  message: string;
  action?: string;
  onAction?: () => void;
}

const cfg = {
  erreur:    { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-800",    icon: "🔴" },
  attention: { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  icon: "🟠" },
  info:      { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800",   icon: "🔵" },
  succes:    { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800",  icon: "🟢" },
};

export function AlertBadge({ type, message, action, onAction }: AlertBadgeProps) {
  const c = cfg[type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border}`} role="alert">
      <span aria-hidden="true">{c.icon}</span>
      <span className={`flex-1 text-sm font-medium ${c.text}`}>{message}</span>
      {action && onAction && (
        <button onClick={onAction} className={`text-xs font-semibold underline ${c.text} hover:no-underline`}>
          {action}
        </button>
      )}
    </div>
  );
}
