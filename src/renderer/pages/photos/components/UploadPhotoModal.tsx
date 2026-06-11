// src/renderer/pages/photos/components/UploadPhotoModal.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import ClientSelect from '../../../components/Selects/ClientSelect';
import photosAPI, { type UploadPhotoRequest } from '../../../api/core/photos';
import type { AppointmentResponseDto } from '../../../api/core/appointments';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId?: number | null;
  appointments: AppointmentResponseDto[];
}

type FormData = {
  clientId: number;
  appointmentId: number | null;
  isBefore: boolean;
  description: string;
  file: FileList;
};

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ isOpen, onClose, onSuccess, clientId, appointments }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedFile = watch('file');

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const url = URL.createObjectURL(selectedFile[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (isOpen) {
      reset({
        clientId: clientId || 0,
        appointmentId: null,
        isBefore: true,
        description: '',
        file: undefined,
      });
      setPreviewUrl(null);
    }
  }, [isOpen, clientId, reset]);

  const onSubmit = async (data: FormData) => {
    if (!data.file || data.file.length === 0) {
      return;
    }
    try {
      const uploadData: UploadPhotoRequest = {
        clientId: data.clientId,
        appointmentId: data.appointmentId || undefined,
        isBefore: data.isBefore,
        description: data.description || undefined,
        file: data.file[0],
      };
      await photosAPI.upload(uploadData);
      onSuccess();
    } catch (error) {
      console.error('Failed to upload photo', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Photo"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="uploadForm" loading={isSubmitting}>
            Upload
          </Button>
        </div>
      }
    >
      <form id="uploadForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client *</label>
          <ClientSelect
            value={watch('clientId') || null}
            onChange={(id) => setValue('clientId', id || 0, { shouldValidate: true })}
            disabled={!!clientId}
          />
          {errors.clientId && <p className="text-xs text-red-500 mt-1">Client is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Appointment (Optional)</label>
          <select
            value={watch('appointmentId') || ''}
            onChange={(e) => setValue('appointmentId', e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="">-- No appointment --</option>
            {appointments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {new Date(apt.appointmentDateTime).toLocaleDateString()} - {apt.treatmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="true"
              checked={watch('isBefore') === true}
              onChange={() => setValue('isBefore', true)}
              className="w-4 h-4 text-[var(--primary-color)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">Before</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="false"
              checked={watch('isBefore') === false}
              onChange={() => setValue('isBefore', false)}
              className="w-4 h-4 text-[var(--primary-color)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">After</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Photo *</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--primary-hover)]"
            {...register('file', { required: 'Please select a file' })}
          />
          {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file.message}</p>}
        </div>

        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Preview:</p>
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-48 rounded-lg object-contain" />
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UploadPhotoModal;