// src/renderer/api/core/photos.ts

export interface PhotoResponseDto {
  id: number;
  clientId: number;
  clientName: string;
  appointmentId?: number;
  fileName: string;
  filePath: string;
  description?: string;
  isBefore: boolean;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface UploadPhotoRequest {
  clientId: number;
  appointmentId?: number;
  isBefore: boolean;
  description?: string;
  file: File;
}

export interface PhotosAPI {
  getByClient(clientId: number): Promise<PhotoResponseDto[]>;
  getBeforeByClient(clientId: number): Promise<PhotoResponseDto[]>;
  getAfterByClient(clientId: number): Promise<PhotoResponseDto[]>;
  getById(id: number): Promise<PhotoResponseDto>;
  delete(id: number): Promise<boolean>;
  upload(data: UploadPhotoRequest): Promise<PhotoResponseDto>;
  getFileUrl(id: number): Promise<string>;
}

const photosAPI: PhotosAPI = {
  async getByClient(clientId) {
    const response = await window.backendAPI.photos("getByClient", {
      clientId,
    });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getBeforeByClient(clientId) {
    const response = await window.backendAPI.photos("getBeforeByClient", {
      clientId,
    });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getAfterByClient(clientId) {
    const response = await window.backendAPI.photos("getAfterByClient", {
      clientId,
    });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.photos("getById", { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.photos("delete", { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async upload(data) {
    const formData = new FormData();
    formData.append("ClientId", data.clientId.toString());
    if (data.appointmentId)
      formData.append("AppointmentId", data.appointmentId.toString());
    formData.append("IsBefore", data.isBefore.toString());
    if (data.description) formData.append("Description", data.description);
    formData.append("File", data.file);
    const response = await window.backendAPI.photos("upload", {
      data: formData,
    });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getFileUrl(id: number): Promise<string> {
    // This method doesn't need to call IPC; it just returns the constructed URL.
    // The actual token is appended by the service in main process.
    // We'll let the main process handle the token via the normal file endpoint.
    return await window.backendAPI
      .photos("getFileUrl", { id })
      .then((res) => res.data);
  },
};

export default photosAPI;
