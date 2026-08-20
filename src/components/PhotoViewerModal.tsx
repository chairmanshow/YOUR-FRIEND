import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoViewerModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ photo, onClose, onDelete }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-white pb-3 px-2">
          <div>
            <h4 className="font-medium text-lg">{photo.title || 'Memory with Sapna'}</h4>
            <p className="text-xs text-slate-400">{photo.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onDelete(photo.id);
                onClose();
              }}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition"
              title="Delete Photo"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <img
          src={photo.url}
          alt={photo.title}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
        />
      </div>
    </div>
  );
};
