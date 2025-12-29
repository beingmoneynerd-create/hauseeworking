import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home as HomeIcon, Heart, X, Mountain, Printer } from 'lucide-react';
import { EvaluateTabType, Home } from '../types';
import { useHomes } from '../hooks/useHomes';
import EvaluateBrowse from '../components/evaluate/EvaluateBrowse';
import InspectionView from '../components/inspection/InspectionView';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastContainer';

export default function EvaluateTab() {
  const [activeTab, setActiveTab] = useState<EvaluateTabType>('browse');
  const [fadeTransition, setFadeTransition] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    homes,
    isLoading,
    addHome,
    toggleFavorite,
    toggleCompare,
    compareCount,
    comparableHomes,
  } = useHomes();

  const handleTabChange = (newTab: EvaluateTabType) => {
    setFadeTransition(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setFadeTransition(false);
    }, 150);
  };

  const handlePreviousTab = () => {
    const tabs: EvaluateTabType[] = ['browse', 'compare', 'inspection'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1]);
    }
  };

  const handleNextTab = () => {
    const tabs: EvaluateTabType[] = ['browse', 'compare', 'inspection'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1]);
    }
  };

  const handleAddHome = async (formData: any) => {
    const result = await addHome(formData);
    if (result.success) {
      showSuccess('Home added successfully!');
      return { success: true };
    } else {
      showError(result.error || 'Failed to add home. Please try again.');
      return { success: false, error: result.error };
    }
  };

  const handleToggleCompare = async (homeId: string) => {
    const result = await toggleCompare(homeId);
    return result;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Evaluation</h1>

        <div className="relative">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousTab}
                className="hidden md:block p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={activeTab === 'browse'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <nav className="flex-1 flex space-x-8 justify-center" aria-label="Tabs">
                {(['browse', 'compare', 'inspection'] as EvaluateTabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={
                      `relative py-4 px-1 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-primary-400 border-b-2 border-primary-400'
                          : 'text-gray-500 hover:text-gray-700'
                      }`
                    }
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'compare' && compareCount > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-primary-400 text-white text-xs rounded-full">
                        {compareCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleNextTab}
                className="hidden md:block p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={activeTab === 'inspection'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center mt-2 text-xs text-gray-500">
            <span className="md:hidden">Swipe left to {activeTab === 'browse' ? 'Compare' : 'Inspection'}</span>
            <span className="hidden md:inline">Click arrows to switch tabs</span>
          </div>
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
        {activeTab === 'browse' && (
          <EvaluateBrowse
            homes={homes}
            isLoading={isLoading}
            compareCount={compareCount}
            onAddHome={handleAddHome}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={handleToggleCompare}
            onCompareClick={() => setActiveTab('compare')}
          />
        )}
        {activeTab === 'compare' && (
          <CompareView
            homes={comparableHomes}
            onRemoveFromCompare={toggleCompare}
            onBackToBrowse={() => setActiveTab('browse')}
            onClearAll={() => {
              comparableHomes.forEach((h) => toggleCompare(h.id));
            }}
          />
        )}
        {activeTab === 'inspection' && (
          <InspectionView homes={homes} onBackToBrowse={() => setActiveTab('browse')} />
        )}
      </div>
    </div>
  );
}

interface CompareViewProps {
  homes: Home[];
  onRemoveFromCompare: (homeId: string) => void;
  onBackToBrowse: () => void;
  onClearAll: () => void;
}

function CompareView({ homes, onRemoveFromCompare, onBackToBrowse, onClearAll }: CompareViewProps) {
  if (homes.length < 2) {
    return (
      <EmptyState
        icon="⚖️"
        title="Pick at least 2 homes to compare"
        description="Select homes using the 'Compare' checkbox in the Browse view, then come back here to see them side-by-side."
        actionLabel="Go to Browse"
        onAction={onBackToBrowse}
      />
    );
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-8">
      <div className="mb-6 no-print">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Comparing {homes.length} homes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Side-by-side comparison of selected properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Comparison
            </button>
            <button
              onClick={onBackToBrowse}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Browse
            </button>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-primary-400 hover:text-primary-500 transition-colors"
        >
          Clear all selections
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="sticky left-0 bg-white z-10 w-[30%] p-4 text-left">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Property Details
                </span>
              </th>
              {homes.map((home) => (
                <th key={home.id} className="p-4 bg-gray-50 min-w-[280px]">
                  <div className="relative">
                    <button
                      onClick={() => onRemoveFromCompare(home.id)}
                      className="no-print absolute top-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="mb-3">
                      {home.primaryPhoto ? (
                        <img
                          src={home.primaryPhoto}
                          alt={home.address}
                          className="w-full h-28 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Mountain className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                        {home.address}
                      </h3>
                      <p className="text-sm text-gray-600">{home.neighborhood}</p>
                      {home.favorite && (
                        <div className="mt-2 flex items-center gap-1 text-red-400">
                          <Heart className="w-4 h-4 fill-current" />
                          <span className="text-xs font-medium">Favorited</span>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonSection title="BASIC INFORMATION">
              <ComparisonRow label="Price">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center">
                    <span className="text-xl font-bold text-primary-400">
                      {formatCurrency(home.price)}
                    </span>
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Bedrooms">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center text-gray-900">
                    {home.bedrooms}
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Bathrooms">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center text-gray-900">
                    {home.bathrooms}
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Year Built">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center text-gray-900">
                    {home.yearBuilt || '---'}
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Square Footage">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center text-gray-900">
                    {home.squareFootage ? home.squareFootage.toLocaleString() : '---'}
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Property Taxes (Annual)">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center text-gray-900">
                    {home.propertyTaxes ? formatCurrency(home.propertyTaxes) : '---'}
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Overall Rating">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-900">
                        {home.overallRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">/5.0</span>
                    </div>
                  </td>
                ))}
              </ComparisonRow>
              <ComparisonRow label="Offer Intent">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center">
                    {home.offerIntent ? (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          home.offerIntent === 'yes'
                            ? 'bg-green-100 text-green-800'
                            : home.offerIntent === 'maybe'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span>
                          {home.offerIntent === 'yes' ? '🟢' : home.offerIntent === 'maybe' ? '🟡' : '🔴'}
                        </span>
                        {home.offerIntent.charAt(0).toUpperCase() + home.offerIntent.slice(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">---</span>
                    )}
                  </td>
                ))}
              </ComparisonRow>
            </ComparisonSection>

            <ComparisonSection title="EVALUATION STATUS">
              <ComparisonRow label="Evaluation Status">
                {homes.map((home) => (
                  <td key={home.id} className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        home.evaluationStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : home.evaluationStatus === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {home.evaluationStatus === 'completed'
                        ? 'Completed'
                        : home.evaluationStatus === 'in_progress'
                        ? 'In Progress'
                        : 'Not Started'}
                    </span>
                  </td>
                ))}
              </ComparisonRow>
            </ComparisonSection>

            <tr className="bg-gray-50">
              <td colSpan={homes.length + 1} className="p-4 text-center text-sm text-gray-600">
                <p className="mb-2">
                  Detailed evaluation data will be available once you complete the evaluation for each
                  home.
                </p>
                <p className="text-xs text-gray-500">
                  Categories include: Exteriors, Interiors, Kitchen, Home Systems, Location, Additional
                  Features, Smart Features, and Monthly Costs.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ComparisonSectionProps {
  title: string;
  children: React.ReactNode;
}

function ComparisonSection({ title, children }: ComparisonSectionProps) {
  return (
    <>
      <tr className="bg-gray-100">
        <td colSpan={100} className="px-4 py-3 text-left">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        </td>
      </tr>
      {children}
    </>
  );
}

interface ComparisonRowProps {
  label: string;
  children: React.ReactNode;
}

function ComparisonRow({ label, children }: ComparisonRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="sticky left-0 bg-white px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
        {label}
      </td>
      {children}
    </tr>
  );
}
