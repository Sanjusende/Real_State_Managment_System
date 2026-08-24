import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Edit2,
  Plus,
  Loader2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadPropertyImages } from '../../services/uploadService';
import Button from './Button';
import Modal from './Modal';
import clsx from 'clsx';

/**
 * Production-ready Multi-Image Uploader Component with:
 * - Multi-file upload via Multer & Cloudinary
 * - Live preview & drag/drop zone
 * - Thumbnail selection
 * - Reorder capability (move left/right)
 * - Alt text custom tagging
 * - Delete with cleanup
 */
export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 10,
  className = '',
}) {
  const [uploading, setUploading] = useState(false);
  const [editingAltIndex, setEditingAltIndex] = useState(null);
  const [altText, setAltText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setUploading(true);
    try {
      const res = await uploadPropertyImages(files);
      if (res?.data?.images) {
        const newUploaded = res.data.images;
        // Merge with existing
        const combined = [...images, ...newUploaded];

        // Ensure at least one image is thumbnail
        const hasThumbnail = combined.some((img) => img.isThumbnail);
        if (!hasThumbnail && combined.length > 0) {
          combined[0].isThumbnail = true;
        }

        // Re-index order
        const reindexed = combined.map((img, idx) => ({ ...img, order: idx }));
        onChange(reindexed);
        toast.success(`Successfully uploaded ${newUploaded.length} images.`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.message || 'Failed to upload images. Please check file type and size.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetThumbnail = (index) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isThumbnail: idx === index,
    }));
    onChange(updated);
    toast.success('Primary listing thumbnail updated.');
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    // Update order values
    const reindexed = newImages.map((img, idx) => ({ ...img, order: idx }));
    onChange(reindexed);
  };

  const handleDelete = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    // If we deleted the thumbnail, assign first remaining as thumbnail
    if (newImages.length > 0 && !newImages.some((img) => img.isThumbnail)) {
      newImages[0].isThumbnail = true;
    }
    const reindexed = newImages.map((img, idx) => ({ ...img, order: idx }));
    onChange(reindexed);
    toast.success('Image removed from listing.');
  };

  const openAltModal = (index) => {
    setEditingAltIndex(index);
    setAltText(images[index]?.alt || '');
  };

  const saveAltText = () => {
    if (editingAltIndex === null) return;
    const updated = [...images];
    updated[editingAltIndex] = { ...updated[editingAltIndex], alt: altText.trim() };
    onChange(updated);
    setEditingAltIndex(null);
    toast.success('Alt text updated.');
  };

  const handleAddFromUrl = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    const newImage = {
      url: urlInput.trim(),
      publicId: '',
      isThumbnail: images.length === 0,
      alt: 'Property Image',
      order: images.length,
    };

    const combined = [...images, newImage];
    onChange(combined);
    setUrlInput('');
    setShowUrlModal(false);
    toast.success('Image URL added.');
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Dropzone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 relative group',
          uploading
            ? 'border-emerald-300 bg-emerald-50/50 cursor-wait'
            : 'border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30'
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:border-emerald-400 transition-all">
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            {uploading ? 'Optimizing & Uploading to Cloudinary...' : 'Click to Upload Listing Photos'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Drag & drop or browse multiple files (JPEG, PNG, WebP up to 5MB each). Maximum {maxImages} images.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {images.length} / {maxImages} Uploaded
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlModal(true);
            }}
            className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 underline cursor-pointer"
          >
            Or paste image URL
          </button>
        </div>
      </div>

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Uploaded Photos (Reorder & Set Primary Thumbnail)</span>
            <span>{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {images.map((img, idx) => (
              <div
                key={img.publicId || img.url || idx}
                className={clsx(
                  'relative rounded-2xl overflow-hidden border-2 bg-slate-900 group shadow-xs transition-all aspect-4/3 flex flex-col justify-between p-2',
                  img.isThumbnail
                    ? 'border-emerald-500 ring-2 ring-emerald-400/20'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {/* Background Image */}
                <img
                  src={img.url}
                  alt={img.alt || `Property photo ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-white backdrop-blur-xs">
                    #{idx + 1}
                  </span>

                  {img.isThumbnail ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Thumbnail
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(idx)}
                      className="px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-emerald-600 text-white text-[10px] font-bold backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Set as listing thumbnail"
                    >
                      Make Cover
                    </button>
                  )}
                </div>

                {/* Overlay Bottom Controls Bar */}
                <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-xs rounded-xl p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 transition cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => openAltModal(idx)}
                      className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer"
                      title={img.alt ? `Alt: ${img.alt}` : 'Add Alt Text'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="p-1 rounded-lg hover:bg-red-500/80 transition cursor-pointer text-red-400 hover:text-white"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt Text Modal */}
      <Modal
        isOpen={editingAltIndex !== null}
        onClose={() => setEditingAltIndex(null)}
        title="Edit Image Description (Alt Text)"
        subtitle="Provide descriptive text for accessibility and SEO."
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alt Text / Caption
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Spacious Master Bedroom with Italian Marble"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingAltIndex(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={saveAltText}
            >
              Save Alt Text
            </Button>
          </div>
        </div>
      </Modal>

      {/* Paste URL Modal */}
      <Modal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        title="Add Image via Direct URL"
        subtitle="Paste an external image link"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Image URL (HTTPS)
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUrlModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddFromUrl}
            >
              Add Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
