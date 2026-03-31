import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ServiceForm from "./ServiceForm";

const ServiceModal = ({ isOpen, onClose, service, onSubmit }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        trapFocus(e);
      }
    };

    const trapFocus = (e) => {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", handleKeyDown);

    // focus first element
    setTimeout(() => {
      modalRef.current?.querySelector("input, button")?.focus();
    }, 0);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="card w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="card-header border-b border-zinc-100 flex-row items-center justify-between space-y-0 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 leading-none">
                {service ? "Configure Definition" : "New Service Entry"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1.5">Define operational parameters for the service registry.</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-950 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="card-content">
          <ServiceForm
            service={service}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceModal;
