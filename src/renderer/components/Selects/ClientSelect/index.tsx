import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, User, X } from "lucide-react";
import clientsAPI, { type ClientResponseDto } from "../../../api/core/clients";

interface ClientSelectProps {
  value: number | null;
  onChange: (clientId: number | null, client?: ClientResponseDto) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const ClientSelect: React.FC<ClientSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select client...",
  className = "w-full max-w-md",
}) => {
  const [clients, setClients] = useState<ClientResponseDto[]>([]);
  const [filtered, setFiltered] = useState<ClientResponseDto[]>([]);
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
        const res = await clientsAPI.getAll(1, 1000);
        setClients(res.items);
        setFiltered(res.items);
      } catch (error) {
        console.error("Failed to load clients", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(clients);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFiltered(clients.filter(c => 
      c.fullName.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower) ||
      (c.phoneNumber && c.phoneNumber.includes(lower))
    ));
  }, [searchTerm, clients]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (client: ClientResponseDto) => {
    onChange(client.id, client);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selected = clients.find(c => c.id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-2 transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"
        }`}
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)", minHeight: "42px" }}
      >
        <User className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary-color)" }} />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selected ? (
            <>
              <span className="font-medium truncate">{selected.fullName}</span>
              {selected.email && (
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  ({selected.email})
                </span>
              )}
            </>
          ) : (
            <span className="truncate" style={{ color: "var(--text-secondary)" }}>{placeholder}</span>
          )}
        </div>
        {selected && !disabled && (
          <button onClick={handleClear} className="p-1 rounded-full hover:bg-gray-700 flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-secondary)" }} />
      </button>

      {isOpen && createPortal(
        <div ref={dropdownRef} className="fixed z-[9999] rounded-lg shadow-lg overflow-hidden" style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width, backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", maxHeight: "350px" }}>
          <div className="p-2 border-b" style={{ borderColor: "var(--border-color)" }}>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              <input ref={searchInputRef} type="text" placeholder="Search by name, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 rounded text-sm" style={{ backgroundColor: "var(--card-secondary-bg)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
            {loading && clients.length === 0 ? (
              <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>No clients found</div>
            ) : (
              filtered.map(client => (
                <button key={client.id} onClick={() => handleSelect(client)} className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)] ${client.id === value ? "bg-[var(--accent-blue-light)]" : ""}`} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--primary-color)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{client.fullName}</span>
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-tertiary)" }}>{client.email}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ClientSelect;