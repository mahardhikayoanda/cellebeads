// File: components/ProductGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'; // Tambahkan ikon

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Cegah scroll pada body saat Lightbox terbuka
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isLightboxOpen]);

  // Fungsi Navigasi
  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setMainImageIndex(index);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* --- 1. Gambar Utama (Di Halaman Produk) --- */}
        <div 
          className="group relative aspect-square w-full overflow-hidden rounded-xl border border-stone-200 shadow-sm bg-white cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[mainImageIndex] || '/placeholder-banner.jpg'}
            alt={productName}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            priority
          />
          {/* Overlay icon zoom saat hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
          </div>
        </div>

        {/* --- 2. Thumbnail List (Slider Manual) --- */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white transition-all",
                  mainImageIndex === index 
                    ? "border-rose-500 ring-2 ring-rose-500/20 opacity-100" 
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- 3. LIGHTBOX MODAL (Full Screen) --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200">
          
          {/* Tombol Close */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Tombol Prev (Hanya jika gambar > 1) */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 md:left-8 text-white/70 hover:text-white p-3 z-50 bg-black/20 rounded-full hover:bg-black/50 transition-all"
            >
              <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
            </button>
          )}

          {/* Gambar Lightbox (Besar) */}
          <div className="relative w-full h-full max-w-7xl max-h-[85vh] p-4 flex items-center justify-center">
            <Image
              src={images[mainImageIndex] || '/placeholder-banner.jpg'}
              alt={productName}
              fill
              className="object-contain select-none"
              quality={100}
              priority
            />
          </div>

          {/* Tombol Next (Hanya jika gambar > 1) */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 md:right-8 text-white/70 hover:text-white p-3 z-50 bg-black/20 rounded-full hover:bg-black/50 transition-all"
            >
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
            </button>
          )}

          {/* Indikator Halaman & Thumbnail Kecil di Bawah Lightbox */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4">
            {/* Indikator Angka */}
            <div className="text-white/90 bg-black/50 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {mainImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail di Lightbox (Opsional, terlihat di desktop) */}
            {images.length > 1 && (
              <div className="hidden md:flex gap-2 overflow-x-auto max-w-[90vw] p-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={cn(
                      "relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border transition-all",
                      mainImageIndex === index ? "border-white opacity-100 scale-110" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}