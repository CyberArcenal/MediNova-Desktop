// src/renderer/api/core/backup.ts

export interface BackupFile {
  fileName: string;
  date: Date;
}

export interface BackupAPI {
  create(): Promise<string>;
  list(): Promise<BackupFile[]>;
  download(fileName: string): Promise<Blob>;
  cleanup(daysToKeep: number): Promise<boolean>;
}

const backupAPI: BackupAPI = {
  async create(): Promise<string> {
    const response = await window.backendAPI.backup('create', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async list(): Promise<BackupFile[]> {
    const response = await window.backendAPI.backup('list', {});
    if (!response.status) throw new Error(response.message);
    const fileNames: string[] = response.data;
    // Parse filename to extract date
    return fileNames.map(fileName => {
      let date: Date = new Date();
      // Try to extract date pattern: YYYYMMDD or YYYY-MM-DD or YYYYMMDD_HHMMSS
      const match = fileName.match(/(\d{4})[-_]?(\d{2})[-_]?(\d{2})/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        date = new Date(year, month, day);
      }
      return { fileName, date };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async download(fileName: string): Promise<Blob> {
    const response = await window.backendAPI.backup('download', { fileName });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async cleanup(daysToKeep: number): Promise<boolean> {
    const response = await window.backendAPI.backup('cleanup', { daysToKeep });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default backupAPI;