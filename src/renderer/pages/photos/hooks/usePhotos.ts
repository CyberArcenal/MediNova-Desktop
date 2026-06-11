// src/renderer/pages/photos/hooks/usePhotos.ts
import { useState, useEffect, useCallback } from 'react';
import photosAPI, { type PhotoResponseDto } from '../../../api/core/photos';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../api/core/appointments';
import { useModal } from '../../../hooks/useModal';
import { dialogs } from '../../../utils/dialogs';

export const usePhotos = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);

  const uploadModal = useModal();
  const viewModal = useModal();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoResponseDto | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!selectedClientId) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    try {
      const data = await photosAPI.getByClient(selectedClientId);
      setPhotos(data);
    } catch (error) {
      console.error('Failed to fetch photos', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClientId]);

  const fetchAppointments = useCallback(async () => {
    if (!selectedClientId) {
      setAppointments([]);
      return;
    }
    try {
      const data = await appointmentsAPI.getByClient(selectedClientId);
      // Sort by date descending
      setAppointments(data.sort((a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime()));
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  }, [selectedClientId]);

  useEffect(() => {
    fetchPhotos();
    fetchAppointments();
  }, [fetchPhotos, fetchAppointments]);

  const handleDelete = async (photo: PhotoResponseDto) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Photo',
      message: `Are you sure you want to delete this photo? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await photosAPI.delete(photo.id);
        await fetchPhotos();
      } catch (error) {
        console.error('Failed to delete photo', error);
      }
    }
  };

  const handleView = (photo: PhotoResponseDto) => {
    setSelectedPhoto(photo);
    viewModal.open();
  };

  const handleUploadSuccess = () => {
    uploadModal.close();
    fetchPhotos();
  };

  return {
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
  };
};