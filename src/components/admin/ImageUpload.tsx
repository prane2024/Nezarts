import React, { useCallback } from 'react';
import { Upload, X, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductImage {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  error: string | null;
  maxImages?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  error,
  maxImages = 5
}) => {
  const [dragActive, setDragActive] = React.useState(false);

  const validateFile = useCallback((file: File): { valid: boolean; message?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        message: `Invalid file type. Please upload ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')} files only.`
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        message: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      };
    }
    return { valid: true };
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: ProductImage[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (newImages.length >= remainingSlots) {
        errors.push(`Only ${remainingSlots} more image(s) can be added`);
        return;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push(validation.message || 'Invalid file');
        return;
      }

      newImages.push({
        file,
        preview: URL.createObjectURL(file)
      });
    });

    if (errors.length > 0) {
      toast.error(errors[0]);
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
      toast.success(`Successfully added ${newImages.length} image(s)`);
    }
  }, [images, maxImages, onImagesChange, validateFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success('Image removed');
  }, [images, onImagesChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images <span className="text-red-500">*</span>
        <span className="text-sm text-gray-500 ml-2">({images.length}/{maxImages})</span>
      </label>
      
      <div
        className={`mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 ${
          dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'
        } ${error ? 'border-red-300' : ''} border-dashed rounded-md transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-md">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {images.length < maxImages && (
            <label className="aspect-square flex items-center justify-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-purple-500 transition-colors">
              <div className="flex flex-col items-center">
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Add Image</span>
              </div>
              <input
                type="file"
                className="sr-only"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleImageChange}
                multiple
              />
            </label>
          )}
        </div>

        {images.length === 0 && (
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  accept={ALLOWED_TYPES.join(',')}
                  onChange={handleImageChange}
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WEBP up to 10MB each
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;