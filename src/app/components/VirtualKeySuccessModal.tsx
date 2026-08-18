import React, { useState, useEffect } from "react";
import { KeyRound, Copy, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VirtualKeySuccessModalProps {
  isOpen: boolean;
  secretKey: string | null;
  keyAlias?: string;
  onClose: () => void;
}

export function VirtualKeySuccessModal({
  isOpen,
  secretKey,
  keyAlias,
  onClose,
}: VirtualKeySuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setShowCheckIcon(false);
      setShowWarningDialog(false);
    }
  }, [isOpen]);

  if (!isOpen || !secretKey) return null;

  const handleCopyKey = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(secretKey);
      } else {
        // Fallback for non-secure contexts or unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = secretKey;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      setShowCheckIcon(true);
      toast.success("Virtual Key copied successfully.");

      setTimeout(() => {
        setShowCheckIcon(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy Virtual Key to clipboard.");
    }
  };

  const handleCloseClick = () => {
    if (!copied) {
      setShowWarningDialog(true);
    } else {
      handleFinalClose();
    }
  };

  const handleFinalClose = () => {
    setCopied(false);
    setShowCheckIcon(false);
    setShowWarningDialog(false);
    onClose();
  };

  return (
    <>
      {/* MAIN SUCCESS POPUP MODAL */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent accidental dismissal on backdrop click
      >
        <div 
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden my-auto animate-scaleUp transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Key Icon */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200/60 dark:border-orange-800/60 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  Save Your Virtual Key
                </h3>
                {keyAlias && (
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 truncate max-w-[240px]">
                    Alias: {keyAlias}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 text-xs text-neutral-600 dark:text-neutral-300">
            {/* Description notice */}
            <div className="space-y-2 leading-relaxed">
              <p>Your Virtual Key has been generated successfully.</p>
              <p>Please save this key somewhere secure and accessible.</p>
              <p className="text-neutral-900 dark:text-white font-bold bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200/60 dark:border-amber-800/50 text-amber-900 dark:text-amber-200">
                For security reasons, you will not be able to view this Virtual Key again through your Guardian Layer account.
              </p>
              <p>If you lose this Virtual Key, you will need to generate a new one.</p>
            </div>

            {/* Read-only Single-line Generated Key Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Generated Virtual Key
              </label>
              <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-500 transition-all">
                <input
                  type="text"
                  readOnly
                  value={secretKey}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-transparent border-none outline-none font-mono text-xs text-neutral-900 dark:text-neutral-100 truncate cursor-pointer pr-8 select-all"
                  title="Click to auto-select key"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="absolute right-2 p-1.5 rounded-md text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Copy Virtual Key"
                >
                  {showCheckIcon ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
            {/* Secondary Action: Done */}
            <button
              type="button"
              onClick={handleFinalClose}
              className="w-full sm:w-auto px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors text-xs cursor-pointer flex items-center justify-center"
            >
              Done
            </button>

            {/* Primary Action: Copy Virtual Key */}
            <button
              type="button"
              onClick={handleCopyKey}
              className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg font-medium transition-colors text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {showCheckIcon ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Virtual Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG: CLOSE WITHOUT SAVING */}
      {showWarningDialog && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Close Without Saving?
              </h4>
            </div>

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>You have not copied your Virtual Key.</p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                Once this popup is closed, the Virtual Key cannot be viewed again.
              </p>
              <p>Are you sure you want to continue?</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWarningDialog(false)}
                className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors text-xs cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleFinalClose}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg font-medium transition-colors text-xs shadow-xs cursor-pointer"
              >
                Close Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default VirtualKeySuccessModal;
