// src/layouts/components/TopBarLeft.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ThemeToggle from '../../../components/Shared/ThemeToggle';

interface TopBarLeftProps {
  toggleSidebar: () => void;
}

const TopBarLeft: React.FC<TopBarLeftProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl hover:bg-[var(--card-hover-bg)] text-[var(--sidebar-text)] transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-lg font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-hover)] bg-clip-text text-transparent hidden sm:inline">
          MediNova
        </span>
      </div>
    </div>
  );
};

export default TopBarLeft;