"use client";

import { SharedPhoto } from "./types";
import { useState } from "react";

interface PhotoGridProps {
  photos: SharedPhoto[];
  onViewAll?: () => void;
}

export default function PhotoGrid({ photos, onViewAll }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<SharedPhoto | null>(null);

  // Show first 6-8 photos in grid, rest can be viewed via "View All"
  const displayPhotos = photos.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {displayPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <img
              src={photo.url}
              alt={`Photo ${photo.id}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/photo${photo.id}/300/300`;
              }}
            />
          </div>
        ))}
      </div>

      {/* Full Image Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedPhoto.url}
              alt={`Photo ${selectedPhoto.id}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
