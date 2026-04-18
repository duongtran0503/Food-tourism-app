import api from "@/lib/axios";

export const AudioService = {
  getAll: () => api.get("/audios"), 
  
  upload: (file: File, onProgress: (percent: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        onProgress(percent);
      },
    });
  },

  delete: (id: string) => api.delete(`/audios/${id}`),
};