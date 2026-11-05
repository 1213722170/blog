export interface GalleryImage {
  fileName: string;
  src: string;
  title: string;
  addedAt: string;
}
export function getGalleryImages(root?: string): GalleryImage[];
export function saveGalleryImage(payload: { mimeType: string; dataUrl: string; fileName: string }, root?: string): GalleryImage[];
export function deleteGalleryImage(fileName: string, root?: string): { images: GalleryImage[]; undoId: string };
export function restoreGalleryImage(undoId: string, root?: string): { images: GalleryImage[] };
