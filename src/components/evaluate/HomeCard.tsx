import { Heart, MapPin, Star } from 'lucide-react';
import { Home } from '../../hooks/useHomes';

interface HomeCardProps {
  home: Home;
  compareMode: boolean;
  onCardClick: (homeId: string) => void;
  onFavoriteClick: (homeId: string) => void;
  onCompareToggle: (homeId: string) => void;
}

export function HomeCard({
  home,
  compareMode,
  onCardClick,
  onFavoriteClick,
  onCompareToggle,
}: HomeCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getOfferIntentBadge = () => {
    if (!home.offer_intent) return null;

    const configs = {
      yes: { bg: 'bg-green-100', text: 'text-green-800', label: 'Yes' },
      maybe: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Maybe' },
      no: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'No' },
    };

    const config = configs[home.offer_intent];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.favorite-button') ||
      target.closest('.compare-checkbox')
    ) {
      return;
    }
    onCardClick(home.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick(home.id);
  };

  const handleCompareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onCompareToggle(home.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(home.id);
        }
      }}
      aria-label={`Home at ${home.address}`}
    >
      <div className="relative h-48 bg-gray-200">
        {home.primary_photo ? (
          <img
            src={home.primary_photo}
            alt={home.address}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <button
          className="favorite-button absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
          onClick={handleFavoriteClick}
          aria-label={home.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 ${
              home.favorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>

        {compareMode && (
          <div
            className="compare-checkbox absolute top-3 left-3 bg-white rounded shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={home.compare_selected}
              onChange={handleCompareChange}
              className="w-6 h-6 m-2 cursor-pointer accent-coral"
              aria-label="Select for comparison"
            />
          </div>
        )}

        {home.offer_intent && (
          <div className="absolute bottom-3 left-3">{getOfferIntentBadge()}</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {formatPrice(home.price)}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{home.address}</p>
            {home.neighborhood && (
              <p className="text-xs text-gray-500">{home.neighborhood}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              {home.bedrooms} bed{home.bedrooms !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-300">|</span>
            <span>
              {home.bathrooms} bath{home.bathrooms !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Star
              className={`w-4 h-4 ${
                home.overall_rating > 0
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {home.overall_rating > 0 ? home.overall_rating.toFixed(1) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
