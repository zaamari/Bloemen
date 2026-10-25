import { WhatsAppIcon } from "./Logo";
import { WHATSAPP_NUMBER } from "@/lib/catalog";

export function WhatsAppButton({ label }: { label: string }) {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="wa-button group fixed z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] transition-[bottom,transform] duration-500 hover:scale-105"
      style={{ right: "max(16px, env(safe-area-inset-right))" }}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-20 [animation-duration:3s]" />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
