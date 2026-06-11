// src/renderer/pages/photos/index.tsx
import React from 'react';
import { Upload } from 'lucide-react';
import Button from '../../components/UI/Button';
import ClientSelect from '../../components/Selects/ClientSelect';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { usePhotos } from './hooks/usePhotos';
import PhotoGrid from './components/PhotoGrid';
import UploadPhotoModal from './components/UploadPhotoModal';
import ViewPhotoModal from './components/ViewPhotoModal';

const PhotosPage: React.FC = () => {
  const {
    selectedClientId,
    setSelectedClientId,
    photos,
    loading,
    appointments,
    uploadModal,
    viewModal,
    selectedPhoto,
    handleDelete,
    handleView,
    handleUploadSuccess,
  } = usePhotos();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Client Photos</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Before & after photos for clients</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Upload}
          onClick={uploadModal.open}
          disabled={!selectedClientId}
        >
          Upload Photo
        </Button>
      </div>

      {/* Client Selector */}
      <div className="max-w-md">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Select Client</label>
        <ClientSelect
          value={selectedClientId}
          onChange={(id) => setSelectedClientId(id)}
          placeholder="Choose a client to view photos"
        />
      </div>

      {/* Photo Grid */}
      {selectedClientId ? (
        loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            onView={handleView}
            onDelete={handleDelete}
            loading={loading}
          />
        )
      ) : (
        <div className="text-center py-12 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)]">Select a client to view their photos.</p>
        </div>
      )}

      {/* Modals */}
      <UploadPhotoModal
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.close}
        onSuccess={handleUploadSuccess}
        clientId={selectedClientId}
        appointments={appointments}
      />
      <ViewPhotoModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        photo={selectedPhoto}
      />
    </div>
  );
};

export default PhotosPage;