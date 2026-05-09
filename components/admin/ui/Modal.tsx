"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titre: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ isOpen, onClose, titre, size = "md", children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#C9A84C]/10 to-transparent rounded-t-2xl">
          <h2 id="modal-title" className="font-bold text-[#0F172A] text-lg">{titre}</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors rounded-lg p-1 hover:bg-[#F1F5F9]" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
