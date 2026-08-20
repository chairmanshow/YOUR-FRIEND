import { PhotoItem } from '../types';

const STORAGE_KEY = 'meet_your_friend_photos';

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    title: 'Balcony evening ✨',
    date: 'Yesterday'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    title: 'Weekend coffee ☕',
    date: '3 days ago'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    title: 'Sky looking gorgeous 💙',
    date: 'Last week'
  }
];

export function getStoredPhotos(): PhotoItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS));
    return INITIAL_PHOTOS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PHOTOS;
  }
}

export function savePhoto(photo: PhotoItem): PhotoItem[] {
  const existing = getStoredPhotos();
  const updated = [photo, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deletePhoto(id: string): PhotoItem[] {
  const existing = getStoredPhotos();
  const updated = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
