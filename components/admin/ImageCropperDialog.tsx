// File: components/admin/ImageCropperDialog.tsx
'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from '@/lib/cropImage'; // Import fungsi utility tadi
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropperDialog({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
        onClose();
        // Reset state agar siap untuk penggunaan berikutnya
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    } catch (e) {
      console.error(e);
      alert('Gagal memproses gambar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white/90 backdrop-blur-xl border-pink-100">
        <DialogHeader className="p-6 pb-2 z-10 relative">
          <DialogTitle className="text-stone-800 font-lora font-bold">Posisikan Foto Profil</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[350px] bg-stone-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Kunci aspek rasio 1:1 (persegi)
              cropShape="round" // Bentuk potongan lingkaran
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteInternal}
              classes={{
                 containerClassName: "z-0"
              }}
            />
          )}
        </div>

        <div className="p-6 space-y-4 z-10 relative bg-white/60">
           {/* Kontrol Zoom */}
           <div className="flex items-center gap-4">
              <ZoomOut size={18} className="text-stone-400" />
              <Slider 
                defaultValue={[1]} 
                min={1} 
                max={3} 
                step={0.1} 
                value={[zoom]} 
                onValueChange={onZoomChange}
                className="flex-1"
              />
              <ZoomIn size={18} className="text-stone-400" />
           </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl">
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/20">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Terapkan
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}