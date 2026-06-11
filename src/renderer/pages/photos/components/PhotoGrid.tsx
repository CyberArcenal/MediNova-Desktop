// src/renderer/pages/photos/components/PhotoGrid.tsx
import React from 'react';
import { Eye, Trash2, Calendar } from 'lucide-react';
import type { PhotoResponseDto } from '../../../api/core/photos';

interface PhotoGridProps {
  photos: PhotoResponseDto[];
  onView: (photo: PhotoResponseDto) => void;
  onDelete: (photo: PhotoResponseDto) => void;
  loading: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onView, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center py-12 text-[var(--text-secondary)]">Loading photos...</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
        <p className="text-[var(--text-secondary)]">No photos found for this client.</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Upload photos using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-square bg-gray-100">
            <img
              src={photo.filePath}
              alt={photo.description || photo.fileName}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onView(photo)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
              }}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => onView(photo)}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(photo)}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-0.5 text-xs rounded-full ${photo.isBefore ? 'bg-blue-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
                {photo.isBefore ? 'Before' : 'After'}
              </span>
            </div>
          </div>
          <div className="p-3">
            {photo.description && (
              <p className="text-sm text-[var(--text-primary)] line-clamp-2 mb-1">{photo.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <Calendar className="w-3 h-3" />
              <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{formatFileSize(photo.fileSize)}</span>
            </div>
            {photo.appointmentId && (
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Appointment #{photo.appointmentId}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;