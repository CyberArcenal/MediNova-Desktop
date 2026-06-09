// src/layouts/TopBar.tsx
import React, { useState, useEffect } from "react";
import { Menu, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "./components/NotificationsDropdown";
import authAPI from "../../api/core/auth";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../../components/Shared/ThemeToggle";
import TopBarLeft from "./components/TopBarLeft";

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page, or trigger global search
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-[var(--border-color)] bg-transparent">
      {/* Left section: hamburger + logo/title */}
      <TopBarLeft
        toggleSidebar={toggleSidebar}
      />

      {/* Center: search bar */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients, appointments, treatments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        </form>
      </div>

      {/* Right section: notifications + avatar */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationsDropdown />

        {/* Avatar / Profile button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--card-hover-bg)] transition-all duration-200"
          aria-label="Profile"
        >
          {user?.fullName ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-hover)] flex items-center justify-center text-white font-medium text-sm">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
