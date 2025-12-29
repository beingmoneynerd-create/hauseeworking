import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { CreateHomeInput } from '../../hooks/useHomes';

interface AddHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateHomeInput) => Promise<void>;
}

export function AddHomeModal({ isOpen, onClose, onSubmit }: AddHomeModalProps) {
  const [formData, setFormData] = useState<CreateHomeInput>({
    address: '',
    neighborhood: '',
    price: 0,
    bedrooms: 3,
    bathrooms: 2,
    year_built: undefined,
    square_footage: undefined,
    primary_photo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.bedrooms < 0) {
      newErrors.bedrooms = 'Bedrooms cannot be negative';
    }

    if (formData.bathrooms < 0) {
      newErrors.bathrooms = 'Bathrooms cannot be negative';
    }

    if (formData.year_built && (formData.year_built < 1800 || formData.year_built > new Date().getFullYear())) {
      newErrors.year_built = 'Please enter a valid year';
    }

    if (formData.square_footage && formData.square_footage <= 0) {
      newErrors.square_footage = 'Square footage must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      address: '',
      neighborhood: '',
      price: 0,
      bedrooms: 3,
      bathrooms: 2,
      year_built: undefined,
      square_footage: undefined,
      primary_photo: '',
    });
    setErrors({});
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, photo: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: 'Image must be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, primary_photo: base64String });
        setErrors({ ...errors, photo: '' });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors({ ...errors, photo: 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
    }
  };

  const formatPriceInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Add New Home
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main St, City, State ZIP"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
              Neighborhood
            </label>
            <input
              type="text"
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Downtown, Westside, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Asking Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  id="price"
                  value={formData.price === 0 ? '' : formData.price.toLocaleString()}
                  onChange={(e) =>
                    setFormData({ ...formData, price: formatPriceInput(e.target.value) })
                  }
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="350,000"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-1">
                Square Feet
              </label>
              <input
                type="number"
                id="square_footage"
                value={formData.square_footage || ''}
                onChange={(e) =>
                  setFormData({ ...formData, square_footage: e.target.value ? parseInt(e.target.value) : undefined })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral ${
                  errors.square_footage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2,000"
              />
              {errors.square_footage && (
                <p className="mt-1 text-sm text-red-500">{errors.square_footage}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <select
                id="bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms <span className="text-red-500">*</span>
              </label>
              <select
                id="bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                id="year_built"
                value={formData.year_built || ''}
                onChange={(e) =>
                  setFormData({ ...formData, year_built: e.target.value ? parseInt(e.target.value) : undefined })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral ${
                  errors.year_built ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2020"
              />
              {errors.year_built && (
                <p className="mt-1 text-sm text-red-500">{errors.year_built}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-coral transition-colors">
              {formData.primary_photo ? (
                <div className="space-y-2">
                  <img
                    src={formData.primary_photo}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, primary_photo: '' })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {uploadingImage ? (
                      <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-2" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>
            {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-coral-dark transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{submitting ? 'Adding...' : 'Add Home'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
