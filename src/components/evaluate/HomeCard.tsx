import { Heart, Mountain } from 'lucide-react';
import { Home } from '../../types';

interface HomeCardProps {
  home: Home;
  onToggleFavorite: (homeId: string) => void;
  onToggleCompare: (homeId: string) => void;
  onCardClick: () => void;
}

export default function HomeCard({ home, onToggleFavorite, onToggleCompare, onCardClick }: HomeCardProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadgeColor = (status: Home['evaluationStatus']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Home['evaluationStatus']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getOfferBadgeColor = (intent?: 'yes' | 'maybe' | 'no') => {
    switch (intent) {
      case 'yes':
        return 'bg-green-100 text-green-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      case 'no':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={onCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="relative h-48 bg-gray-200">
        {home.primaryPhoto ? (
          <img src={home.primaryPhoto} alt={home.address} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mountain className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(home.id);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
          title={home.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 ${home.favorite ? 'fill-primary-400 text-primary-400' : 'text-gray-600'}`}
          />
        </button>

        <label
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            checked={home.compareSelected}
            onChange={() => onToggleCompare(home.id)}
            className="w-4 h-4 text-primary-400 border-gray-300 rounded focus:ring-primary-400"
          />
          <span className="text-xs font-medium text-gray-700">Compare</span>
        </label>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{home.address}</h3>
        {home.neighborhood && (
          <p className="text-sm text-gray-600 mb-3">{home.neighborhood}</p>
        )}

        <p className="text-xl font-bold text-primary-400 mb-2">{formatCurrency(home.price)}</p>

        <p className="text-sm text-gray-600 mb-3">
          {home.bedrooms} bd • {home.bathrooms} ba
          {home.squareFootage && ` • ${home.squareFootage.toLocaleString()} sq ft`}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(home.evaluationStatus)}`}>
            {getStatusLabel(home.evaluationStatus)}
          </span>

          {home.offerIntent && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getOfferBadgeColor(home.offerIntent)}`}>
              Offer: {home.offerIntent.charAt(0).toUpperCase() + home.offerIntent.slice(1)}
            </span>
          )}

          {home.overallRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{home.overallRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
