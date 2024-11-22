import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={handlePrevious}
        className="absolute left-4 text-white hover:text-gray-300"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div className="relative max-w-4xl max-h-[80vh] mx-4">
        <img
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="max-h-[80vh] w-auto object-contain"
        />
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-4 text-white hover:text-gray-300"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ImageGallery;