import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Syringe, X } from "lucide-react";
import treatmentsAPI, { type TreatmentResponseDto } from "../../../api/core/treatments";

interface TreatmentSelectProps {
  value: number | null;
  onChange: (treatmentId: number | null, treatment?: TreatmentResponseDto) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const TreatmentSelect: React.FC<TreatmentSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select treatment...",
  className = "w-full max-w-md",
}) => {
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [filtered, setFiltered] = useState<TreatmentResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await treatmentsAPI.getAll(1, 1000);
        setTreatments(res.items);
        setFiltered(res.items);
      } catch (error) {
        console.error("Failed to load treatments", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(treatments);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFiltered(treatments.filter(t => t.name.toLowerCase().includes(lower) || (t.categoryName && t.categoryName.toLowerCase().includes(lower))));
  }, [searchTerm, treatments]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isOpen]);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (t: TreatmentResponseDto) => {
    onChange(t.id, t);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => { e.stopPropagation(); onChange(null); };
  const selected = treatments.find(t => t.id === value);

  return (
    <div className={`relative ${className}`}>
      <button ref={triggerRef} type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-2 transition-colors duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"}`}
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)", minHeight: "42px" }}>
        <Syringe className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary-color)" }} />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selected ? <span className="font-medium truncate">{selected.name}</span> : <span className="truncate" style={{ color: "var(--text-secondary)" }}>{placeholder}</span>}
        </div>
        {selected && !disabled && <button onClick={handleClear} className="p-1 rounded-full hover:bg-gray-700 flex-shrink-0" style={{ color: "var(--text-secondary)" }}><X className="w-4 h-4" /></button>}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-secondary)" }} />
      </button>
      {isOpen && createPortal(
        <div ref={dropdownRef} className="fixed z-[9999] rounded-lg shadow-lg overflow-hidden" style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width, backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", maxHeight: "350px" }}>
          <div className="p-2 border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              <input ref={searchInputRef} type="text" placeholder="Search treatment..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 rounded text-sm" style={{ backgroundColor: "var(--card-secondary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
            {loading && treatments.length === 0 ? <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>Loading...</div>
            : filtered.length === 0 ? <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>No treatments found</div>
            : filtered.map(t => (
              <button key={t.id} onClick={() => handleSelect(t)} className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)] ${t.id === value ? "bg-[var(--accent-blue-light)]" : ""}`} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <Syringe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--primary-color)" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{t.name}</span>
                    {t.categoryName && <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>({t.categoryName})</span>}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-tertiary)" }}>₱{t.price.toFixed(2)} • {t.durationMinutes} min</div>
                </div>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TreatmentSelect;