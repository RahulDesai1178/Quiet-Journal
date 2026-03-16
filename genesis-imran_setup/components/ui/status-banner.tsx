import { cn } from "@/lib/utils";

type StatusBannerProps = {
  className?: string;
  message: string;
  tone?: "success" | "error" | "info";
};

const toneClasses = {
  error: "border-danger/16 bg-[linear-gradient(180deg,rgba(166,70,70,0.12),rgba(166,70,70,0.06))] text-danger shadow-[0_12px_28px_-24px_rgba(166,70,70,0.8)]",
  info: "border-accent/12 bg-[linear-gradient(180deg,rgba(214,231,223,0.9),rgba(255,255,255,0.72))] text-accent-strong shadow-[0_14px_28px_-24px_rgba(31,77,65,0.55)]",
  success:
    "border-accent/16 bg-[linear-gradient(180deg,rgba(214,231,223,0.86),rgba(255,250,243,0.74))] text-accent-strong shadow-[0_14px_28px_-24px_rgba(31,77,65,0.55)]",
};

export function StatusBanner({ className, message, tone = "info" }: StatusBannerProps) {
  return (
    <div className={cn("rounded-[1.4rem] border px-4 py-3 text-sm leading-6 backdrop-blur", toneClasses[tone], className)}>
      {message}
    </div>
  );
}
