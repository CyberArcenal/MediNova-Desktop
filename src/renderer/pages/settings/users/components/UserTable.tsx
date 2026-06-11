// src/renderer/pages/settings/users/components/UserTable.tsx
import React from 'react';
import { Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { type UserResponseDto } from '../../../../api/core/users';

interface UserTableProps {
  users: UserResponseDto[];
  onEdit: (user: UserResponseDto) => void;
  onDelete: (id: number, username: string) => void;
  onToggleActive: (id: number, currentActive: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onToggleActive }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Username</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Full Name</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Active</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Roles</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{user.username}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{user.email}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{user.fullName || '—'}</td>
              <td className="py-2.5 px-4 text-center">
                {user.isActive ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Inactive</span>
                )}
              </td>
              <td className="py-2.5 px-4">
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      {role}
                    </span>
                  ))}
                  {user.roles.length === 0 && <span className="text-[var(--text-tertiary)]">—</span>}
                </div>
              </td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit(user)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onToggleActive(user.id, user.isActive)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title={user.isActive ? 'Deactivate' : 'Activate'}>
                    {user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onDelete(user.id, user.username)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;