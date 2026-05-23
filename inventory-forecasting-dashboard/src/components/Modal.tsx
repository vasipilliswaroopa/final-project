import React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onConfirm?: () => void;
  confirmText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "Confirm",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-emerald-500 w-12 h-12 animate-bounce" />;
      case "error":
        return <AlertTriangle className="text-orange-600 w-12 h-12 animate-pulse" />;
      case "info":
      default:
        return <Info className="text-blue-600 w-12 h-12 animate-pulse" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white";
      case "error":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white";
      case "info":
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-4 p-3 bg-slate-50 rounded-2xl">
          {getIcon()}
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-6 px-2">
          {message}
        </p>

        {onConfirm? (
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-300 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition cursor-pointer ${getButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition cursor-pointer ${getButtonClass()}`}
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;