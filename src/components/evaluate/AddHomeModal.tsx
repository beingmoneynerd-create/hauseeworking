import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { AddHomeFormData } from '../../types';

interface AddHomeModalProps {
  onClose: () => void;
  onSubmit: (formData: AddHomeFormData) => Promise<void>;
}

const BEDROOM_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5+', value: 5 },
];

const BATHROOM_OPTIONS = [
  { label: '1', value: 1 },
  { label: '1.5', value: 1.5 },
  { label: '2', value: 2 },
  { label: '2.5', value: 2.5 },
  { label: '3', value: 3 },
  { label: '3.5', value: 3.5 },
  { label: '4+', value: 4 },
];

export default function AddHomeModal({ onClose, onSubmit }: AddHomeModalProps) {
  const [formData, setFormData] = useState<AddHomeFormData>({
    address: '',
    neighborhood: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: undefined,
    propertyTaxes: undefined,
    squareFootage: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddHomeFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof AddHomeFormData, value: string | number | undefined) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddHomeFormData, string>> = {};

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.bedrooms <= 0) newErrors.bedrooms = 'Bedrooms is required';
    if (formData.bathrooms <= 0) newErrors.bathrooms = 'Bathrooms is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    formData.address.trim() &&
    formData.price > 0 &&
    formData.bedrooms > 0 &&
    formData.bathrooms > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add a Home</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-primary-400">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full h-12 px-4 border rounded-md focus:ring-2 transition-colors ${
                  errors.address
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-primary-400 focus:ring-primary-100'
                }`}
                placeholder="123 Main Street, Toronto, ON"
                disabled={isSubmitting}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                value={formData.neighborhood || ''}
                onChange={(e) => handleChange('neighborhood', e.target.value || undefined)}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                placeholder="Downtown Toronto"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-primary-400">*</span>
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={`w-full h-12 px-4 border rounded-md focus:ring-2 transition-colors ${
                  errors.price
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-primary-400 focus:ring-primary-100'
                }`}
                placeholder="500000"
                disabled={isSubmitting}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms <span className="text-primary-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleChange('bedrooms', parseFloat(e.target.value) || 0)}
                  className={`w-full h-12 px-4 pr-10 border rounded-md focus:ring-2 transition-colors appearance-none bg-white ${
                    errors.bedrooms
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : 'border-gray-300 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select...</option>
                  {BEDROOM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms <span className="text-primary-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleChange('bathrooms', parseFloat(e.target.value) || 0)}
                  className={`w-full h-12 px-4 pr-10 border rounded-md focus:ring-2 transition-colors appearance-none bg-white ${
                    errors.bathrooms
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : 'border-gray-300 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select...</option>
                  {BATHROOM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
              <input
                type="number"
                value={formData.yearBuilt || ''}
                onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value) || undefined)}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Taxes (Annual)</label>
              <input
                type="number"
                value={formData.propertyTaxes || ''}
                onChange={(e) => handleChange('propertyTaxes', parseFloat(e.target.value) || undefined)}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                placeholder="5000"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <input
                type="number"
                value={formData.squareFootage || ''}
                onChange={(e) => handleChange('squareFootage', parseInt(e.target.value) || undefined)}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
                placeholder="1500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Home'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
