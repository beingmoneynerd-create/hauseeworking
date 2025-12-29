import { useState, useEffect, useCallback } from 'react';
import { Home, AddHomeFormData } from '../types';
import { loadHomes, addHome, updateHome, deleteHome } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function useHomes() {
  const { user } = useAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomesData = useCallback(async () => {
    if (!user?.id) {
      setHomes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await loadHomes(user.id);

      if (loadError) {
        setError(loadError);
        setHomes([]);
      } else if (data) {
        setHomes(data);
      }
    } catch (err) {
      console.error('Error loading homes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load homes');
      setHomes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadHomesData();
  }, [loadHomesData]);

  const addNewHome = useCallback(async (formData: AddHomeFormData): Promise<{ success: boolean; error?: string; home?: Home }> => {
    if (!user?.id) {
      return { success: false, error: 'You must be logged in to add a home' };
    }

    const result = await addHome(user.id, formData);

    if (result.success && result.home) {
      setHomes(prev => [result.home!, ...prev]);
    }

    return result;
  }, [user?.id]);

  const updateHomeData = useCallback(async (homeId: string, updates: Partial<Home>): Promise<{ success: boolean; error?: string }> => {
    setHomes(prev => prev.map(h => h.id === homeId ? { ...h, ...updates } : h));

    const result = await updateHome(homeId, updates);

    if (!result.success) {
      await loadHomesData();
    }

    return result;
  }, [loadHomesData]);

  const deleteHomeData = useCallback(async (homeId: string): Promise<{ success: boolean; error?: string }> => {
    const result = await deleteHome(homeId);

    if (result.success) {
      setHomes(prev => prev.filter(h => h.id !== homeId));
    }

    return result;
  }, []);

  const toggleFavorite = useCallback(async (homeId: string) => {
    const home = homes.find(h => h.id === homeId);
    if (!home) return;

    const newFavoriteState = !home.favorite;
    await updateHomeData(homeId, { favorite: newFavoriteState });
  }, [homes, updateHomeData]);

  const toggleCompare = useCallback(async (homeId: string): Promise<{ success: boolean; error?: string }> => {
    const home = homes.find(h => h.id === homeId);
    if (!home) return { success: false, error: 'Home not found' };

    const selectedCount = homes.filter(h => h.compareSelected).length;

    if (!home.compareSelected && selectedCount >= 3) {
      return { success: false, error: 'You can compare up to 3 homes' };
    }

    const newCompareState = !home.compareSelected;
    return await updateHomeData(homeId, { compareSelected: newCompareState });
  }, [homes, updateHomeData]);

  const getCompareCount = useCallback(() => {
    return homes.filter(h => h.compareSelected).length;
  }, [homes]);

  const getComparableHomes = useCallback(() => {
    return homes.filter(h => h.compareSelected);
  }, [homes]);

  return {
    homes,
    isLoading,
    error,
    addHome: addNewHome,
    updateHome: updateHomeData,
    deleteHome: deleteHomeData,
    toggleFavorite,
    toggleCompare,
    compareCount: getCompareCount(),
    comparableHomes: getComparableHomes(),
    refresh: loadHomesData,
  };
}
