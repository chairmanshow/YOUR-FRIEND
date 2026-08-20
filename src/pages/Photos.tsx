import React, { useState, useEffect, useRef } from 'react';
import { Plus, ImagePlus } from 'lucide-react';
import { PhotoItem } from '../types';
import { getStoredPhotos, savePhoto, deletePhoto, compressImage } from '../services/storage';
import { PhotoViewerModal } from '../components/PhotoViewerModal';

export const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(getStoredPhotos());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64Url = await compressImage(file);
      const newPhoto: PhotoItem = {
        id: Date.now().toString(),
        url: base64Url,
        title: 'New Memory ✨',
        date: 'Just now'
      };
      const updated = savePhoto(newPhoto);
      setPhotos(updated);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    const updated = deletePhoto(id);
    setPhotos(updated);
  };

  return (
    <div className="min-h-screen px-4 pt-6 md:pt-24 pb-24 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Moments & Memories</h2>
          <p className="text-slate-400 text-sm mt-1">Sapna's personal photo diary</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-md transition disabled:opacity-50 active:scale-95"
        >
          <Plus size={18} />
          <span>{isUploading ? 'Uploading...' : 'Add Photo'}</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 rounded-3xl border border-slate-800 text-center">
          <ImagePlus size={48} className="text-slate-600 mb-3" />
          <p className="text-slate-400">No photos added yet.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm transition duration-300 hover:scale-[1.02]"
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full object-cover rounded-2xl group-hover:opacity-90 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-white font-medium text-sm">{item.title}</span>
                <span className="text-slate-300 text-xs">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <PhotoViewerModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};
