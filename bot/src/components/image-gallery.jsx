'use client';

import React, { useState } from 'react';

export function ImageGallery({ images }) {
  const [selectedId, setSelectedId] = useState(images[0]?.id);

  const selectedImage = images.find((img) => img.id === selectedId);

  return (
    <div className="space-y-6">
      {selectedImage && (
        <div className="relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/20 transition-all duration-500 h-96">
          <img
            src={selectedImage.src || "/placeholder.svg"}
            alt={selectedImage.alt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary via-primary/80 to-transparent text-primary-foreground">
            <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedId(image.id)}
            className={`relative overflow-hidden rounded-lg transition-all duration-300 aspect-square border-2 ${
              selectedId === image.id
                ? 'border-primary shadow-lg shadow-primary/50'
                : 'border-primary/20 hover:border-primary/50'
            }`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {selectedId === image.id && (
              <div className="absolute inset-0 bg-primary/30" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
