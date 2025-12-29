import { useState } from 'react';
import { Plus, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHomes } from '../hooks/useHomes';
import { HomeCard } from '../components/evaluate/HomeCard';
import { AddHomeModal } from '../components/evaluate/AddHomeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/ToastContainer';

interface EvaluateBrowseProps {
  compareMode: boolean;
  onCompareModeChange: (enabled: boolean) => void;
}

export default function EvaluateBrowse({ compareMode, onCompareModeChange }: EvaluateBrowseProps) {
  const navigate = useNavigate();
  const { homes, loading, addHome, toggleFavorite, toggleCompare } = useHomes();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedCount = homes.filter((h) => h.compare_selected).length;

  const handleAddHome = async (input: any) => {
    try {
      await addHome(input);
      showToast('Home added successfully', 'success');
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
      throw error;
    }
  };

  const handleCardClick = (homeId: string) => {
    navigate(`/evaluate/home/${homeId}`);
  };

  const handleFavoriteClick = async (homeId: string) => {
    try {
      await toggleFavorite(homeId);
    } catch (error) {
      showToast('Failed to update favorite status', 'error');
    }
  };

  const handleCompareToggle = async (homeId: string) => {
    try {
      await toggleCompare(homeId);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleCompareClick = () => {
    navigate('/evaluate?tab=compare');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse Homes</h2>
          <p className="text-gray-600 mt-1">
            {homes.length === 0
              ? 'Add homes to start evaluating'
              : `${homes.length} home${homes.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => onCompareModeChange(e.target.checked)}
              className="w-4 h-4 text-coral accent-coral cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Compare Mode</span>
          </label>
        </div>
      </div>

      {homes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No homes yet</h3>
          <p className="text-gray-600 mb-6">Add your first home to start evaluating</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-coral text-white rounded-lg hover:bg-coral-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Home</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              compareMode={compareMode}
              onCardClick={handleCardClick}
              onFavoriteClick={handleFavoriteClick}
              onCompareToggle={handleCompareToggle}
            />
          ))}
        </div>
      )}

      {homes.length > 0 && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-coral text-white rounded-full shadow-lg hover:bg-coral-dark transition-all hover:scale-110 flex items-center justify-center z-40"
          aria-label="Add new home"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {selectedCount >= 2 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleCompareClick}
            className="bg-coral text-white px-6 py-3 rounded-full shadow-lg hover:bg-coral-dark transition-all hover:scale-105 font-medium"
          >
            Compare {selectedCount} home{selectedCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      <AddHomeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddHome}
      />
    </div>
  );
}
