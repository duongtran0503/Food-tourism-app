import api from "@/lib/axios";

export const AudioService = {
  // 🎙️ Lấy danh sách audio của Merchant
  getAll: () => api.get("/audios"), 
  
  // ⬆️ Tải file lên Cloudinary thông qua Backend
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

  // 🗑️ Xóa audio
  delete: (id: string) => api.delete(`/audios/${id}`),
};