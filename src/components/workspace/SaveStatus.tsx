import { Check, Loader2, AlertTriangle, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type SaveState = "idle" | "saving" | "saved" | "error" | "offline";

interface SaveStatusProps {
  state: SaveState;
  lastSavedAt: Date | null;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function SaveStatus({ state, lastSavedAt }: SaveStatusProps) {
  const config = {
    idle: {
      Icon: Check,
      label: lastSavedAt ? `Salvo às ${formatTime(lastSavedAt)}` : "Pronto para anotar",
      className: "bg-success-soft text-success-base",
    },
    saving: {
      Icon: Loader2,
      label: "Salvando...",
      className: "bg-info-soft text-info-base",
      spin: true,
    },
    saved: {
      Icon: Check,
      label: lastSavedAt ? `Salvo às ${formatTime(lastSavedAt)}` : "Salvo",
      className: "bg-success-soft text-success-base",
    },
    error: {
      Icon: AlertTriangle,
      label: "Falha ao salvar — tentando novamente",
      className: "bg-error-soft text-error-base",
    },
    offline: {
      Icon: CloudOff,
      label: "Sem conexão — alterações ficarão pendentes",
      className: "bg-warning-soft text-warning-base",
    },
  }[state];

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium",
        config.className,
      )}
    >
      <config.Icon
        className={cn("h-3.5 w-3.5", "spin" in config && config.spin && "animate-spin")}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
